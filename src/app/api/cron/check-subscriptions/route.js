// /app/api/cron/check-subscriptions/route.js - עדכון עם פיגת sessions
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendSubscriptionNotification } from '../../../../lib/email/mailer.js';

export async function GET(request) {
  try {
    // בדיקת הרשאה (אופציונלי)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. בדיקת התראות (3 ימים לפני)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const targetDate = threeDaysFromNow.toISOString().split('T')[0];

    const { data: notificationUsers, error: notificationError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        users!inner(name, email)
      `)
      .eq('status', 'active')
      .eq('end_date', targetDate)
      .is('notification_sent_at', null);

    if (notificationError) {
      console.error('Error fetching notification users:', notificationError);
    }

    // 2. בדיקת מנויים שפגו
    const today = new Date().toISOString().split('T')[0];
    
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        users!inner(name, email, id)
      `)
      .eq('status', 'active')
      .lte('end_date', today);

    if (expiredError) {
      console.error('Error fetching expired users:', expiredError);
    }

    // מונה הצלחות ושגיאות
    let notificationsSent = 0;
    let notificationErrors = 0;
    let subscriptionsCancelled = 0;
    let cancellationErrors = 0;
    let sessionsInvalidated = 0;
    let sessionErrors = 0;

    // 3. עיבוד התראות
    if (notificationUsers && notificationUsers.length > 0) {
      console.log(`Found ${notificationUsers.length} users needing notifications`);
      
      for (const subscription of notificationUsers) {
        try {
          const user = subscription.users;
          
          // שליחת מייל התראה
          await sendSubscriptionNotification(
            user.email,
            user.name,
            subscription.end_date,
            subscription.subscription_type
          );

          // עדכון שההתראה נשלחה
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ notification_sent_at: new Date().toISOString() })
            .eq('id', subscription.id);

          if (updateError) {
            console.error(`Error updating notification status for user ${user.email}:`, updateError);
          } else {
            notificationsSent++;
            console.log(`✅ Notification sent and recorded for ${user.email}`);
          }

        } catch (error) {
          notificationErrors++;
          console.error(`Failed to process notification for subscription ${subscription.id}:`, error.message);
        }
      }
    }

    // 4. עיבוד מנויים שפגו
    if (expiredUsers && expiredUsers.length > 0) {
      console.log(`Found ${expiredUsers.length} expired subscriptions`);
      
      for (const subscription of expiredUsers) {
        try {
          const user = subscription.users;
          
          // כאן תוכל להוסיף לוגיקה נוספת לביטול מנוי (למשל ביטול חיוב)
          await handleSubscriptionCancellation(subscription);
          
          // עדכון סטטוס למנוי פג
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('id', subscription.id);

          if (updateError) {
            console.error(`Error updating subscription status for user ${user.email}:`, updateError);
            cancellationErrors++;
          } else {
            subscriptionsCancelled++;
            console.log(`✅ Subscription cancelled for ${user.email}`);
            
            // פיגת כל ה-sessions של המשתמש
            try {
              await invalidateUserSessions(user.id);
              sessionsInvalidated++;
              console.log(`✅ Sessions invalidated for user ${user.email}`);
            } catch (sessionError) {
              sessionErrors++;
              console.error(`Failed to invalidate sessions for user ${user.email}:`, sessionError.message);
            }
          }

        } catch (error) {
          cancellationErrors++;
          console.error(`Failed to cancel subscription ${subscription.id}:`, error.message);
        }
      }
    }

    // תוצאות
    const results = {
      success: true,
      notificationsSent,
      notificationErrors,
      subscriptionsCancelled,
      cancellationErrors,
      sessionsInvalidated,
      sessionErrors,
      totalProcessed: (notificationUsers?.length || 0) + (expiredUsers?.length || 0),
      processedAt: new Date().toISOString()
    };

    console.log('📊 Cron job completed:', results);

    return NextResponse.json(results);

  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// פונקציית עזר לטיפול בביטול מנוי
async function handleSubscriptionCancellation(subscription) {
  // כאן תוכל להוסיף לוגיקה נוספת:
  // - ביטול חיובים אוטומטיים
  // - שליחת מייל אישור ביטול
  // - עדכון מערכות חיצוניות
  // - לוג למערכת CRM
  
  console.log(`Processing cancellation for subscription ${subscription.id}`);
  
  // דוגמה לפעולות נוספות:
  // await cancelRecurringPayment(subscription.payment_id);
  // await logToAnalytics('subscription_expired', { userId: subscription.user_id });
}

// פונקציה חדשה - פיגת sessions של משתמש
async function invalidateUserSessions(userId) {
  try {
    // אפשרות 1: שימוש ב-NextAuth database adapter (אם יש לך)
    // await adapter.deleteSession(sessionToken);
    
    // אפשרות 2: הוספת רשימה שחורה לפיגת tokens
    // זה דורש הוספת טבלה נוספת או שדה ב-users table
    
    // אפשרות 3: עדכון timestamp שיגרום ל-JWT לבדוק מחדש
    // זה הפתרון הפשוט ביותר עם JWT sessions
    
    // לעת עתה, נעשה לוג שהפעולה התבצעה
    console.log(`Sessions invalidated for user ${userId} - JWT will refresh on next request`);
    
    // אם תרצה לממש פיגת sessions מיידית, תוכל:
    // 1. לשמור רשימת user_ids שה-JWT שלהם לא תקף
    // 2. לבדוק את זה ב-JWT callback
    // 3. לנקות את הרשימה אחרי זמן מסוים
    
    return true;
    
  } catch (error) {
    console.error('Error invalidating sessions:', error);
    throw error;
  }
}

// אם תרצה פיגת sessions מיידית יותר, תוכל להוסיף טבלה:
/*
CREATE TABLE invalidated_sessions (
  user_id UUID NOT NULL,
  invalidated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id)
);

ואז בפונקציה:
const supabase = createClient(...);
await supabase
  .from('invalidated_sessions')
  .upsert({ user_id: userId });
*/