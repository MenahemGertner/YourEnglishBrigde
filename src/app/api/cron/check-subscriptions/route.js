import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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
    const { data: notificationUsers } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .eq('end_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .is('notification_sent_at', null);

    // 2. בדיקת מנויים שפגו
    const { data: expiredUsers } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lte('end_date', new Date().toISOString().split('T')[0]);

    // 3. עיבוד התראות
    for (const user of notificationUsers || []) {
      // כאן תקרא לפונקציה שלך לשליחת מייל
      await sendNotificationEmail(user);
      
      // עדכון שההתראה נשלחה
      await supabase
        .from('subscriptions')
        .update({ notification_sent_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    // 4. עיבוד מנויים שפגו
    for (const user of expiredUsers || []) {
      // כאן תקרא לפונקציה שלך לביטול מנוי
      await cancelSubscription(user);
      
      // עדכון סטטוס למנוי פג
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', user.id);
    }

    return NextResponse.json({ 
      success: true,
      notificationsSent: notificationUsers?.length || 0,
      subscriptionsCancelled: expiredUsers?.length || 0
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// פונקציות עזר (תמלא אותן מאוחר יותר)
async function sendNotificationEmail(user) {
  // TODO: לוגיקת שליחת מייל
  console.log(`Sending notification to user ${user.user_id}`);
}

async function cancelSubscription(user) {
  // TODO: לוגיקת ביטול מנוי
  console.log(`Cancelling subscription for user ${user.user_id}`);
}