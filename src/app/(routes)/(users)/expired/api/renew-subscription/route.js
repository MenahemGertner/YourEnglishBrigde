import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  try {
    // וידוא שהמשתמש מחובר
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'נדרשת התחברות' },
        { status: 401 }
      );
    }

    const { newPlanId } = await req.json();

    // בדיקה שה-planId תקין
    const validPlans = ['Free Trial', 'Intensive', 'Premium'];
    if (!newPlanId || !validPlans.includes(newPlanId)) {
      return NextResponse.json(
        { error: 'סוג מנוי לא תקין' },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;

    // שליפת פרטי המשתמש
    const { data: user, error: userError } = await supabaseAdmin
      .schema('public')
      .from('users')
      .select('id, email, name')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    // שליפת המנוי הנוכחי (כולל פגי תוקף)
    const { data: currentSubscription, error: subError } = await supabaseAdmin
      .schema('public')
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      return NextResponse.json(
        { error: 'שגיאה בשליפת מנוי' },
        { status: 500 }
      );
    }

    // חישוב הנחה לפי סוג המנוי הקודם
    let discount = 0;
    if (currentSubscription.subscription_type === 'Premium') {
      discount = 20; // 20% הנחה למשתמש פרימיום
    } else if (currentSubscription.subscription_type === 'Intensive') {
      discount = 10; // 10% הנחה למשתמש אינטנסיבי
    }

    // מיפוי planId לפרטי מנוי
    const subscriptionMapping = {
      'Free Trial': {
        type: 'Free Trial',
        durationDays: 7,
        basePrice: 0
      },
      'Intensive': {
        type: 'Intensive',
        durationDays: 90,
        basePrice: 747 // 249 * 3
      },
      'Premium': {
        type: 'Premium',
        durationDays: 360,
        basePrice: 2148 // 179 * 12
      }
    };

    const selectedPlan = subscriptionMapping[newPlanId];
    
    // חישוב תאריכים חדשים - בדיקה אם המנוי עדיין פעיל
    const now = new Date();
    const currentEndDate = new Date(currentSubscription.end_date);
    const isStillActive = currentSubscription.status === 'active' && currentEndDate > now;

    let startDate, endDate;
    
    if (isStillActive) {
      // המנוי עדיין פעיל - התחל מתאריך הסיום הנוכחי
      startDate = new Date(currentSubscription.start_date); // שומרים את תאריך ההתחלה המקורי
      endDate = new Date(currentEndDate);
      endDate.setDate(endDate.getDate() + selectedPlan.durationDays);
      
      console.log(`🔄 Renewing active subscription - extending from ${currentEndDate.toISOString()} by ${selectedPlan.durationDays} days`);
    } else {
      // המנוי פג תוקף - התחל מהיום
      startDate = now;
      endDate = new Date(now);
      endDate.setDate(endDate.getDate() + selectedPlan.durationDays);
      
      console.log(`🆕 Renewing expired subscription - starting fresh from ${now.toISOString()}`);
    }

    // קביעת סוג הפעולה
    let actionType = 'renewed';
    if (currentSubscription.subscription_type === 'Free Trial' && newPlanId !== 'Free Trial') {
      actionType = 'upgraded';
    } else if (newPlanId === 'Premium' && currentSubscription.subscription_type !== 'Premium') {
      actionType = 'upgraded';
    } else if (newPlanId === 'Intensive' && currentSubscription.subscription_type === 'Premium') {
      actionType = 'downgraded';
    }

    // עדכון המנוי הקיים
    const { data: updatedSubscription, error: updateError } = await supabaseAdmin
      .schema('public')
      .from('subscriptions')
      .update({
        subscription_type: selectedPlan.type,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentSubscription.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'שגיאה בעדכון המנוי: ' + updateError.message },
        { status: 500 }
      );
    }

    // חישוב הסכום ששולם (אחרי הנחה)
    const finalAmount = selectedPlan.basePrice * (1 - discount / 100);

    // רישום בהיסטוריה - פשוט וממוקד!
    const { error: historyError } = await supabaseAdmin
      .schema('public')
      .from('subscription_history')
      .insert({
        user_id: user.id,
        subscription_id: currentSubscription.id,
        action_type: actionType,
        plan_type: selectedPlan.type,
        amount_paid: finalAmount
      });

    if (historyError) {
      // לא נכשיל את כל התהליך בגלל שגיאה בהיסטוריה
      console.error('Error recording history:', historyError);
    }

    const daysAdded = isStillActive ? selectedPlan.durationDays : null;
    console.log(`✅ Subscription ${actionType}: ${currentSubscription.subscription_type} → ${selectedPlan.type}${daysAdded ? ` (+${daysAdded} days)` : ''}`);

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      actionType,
      discount,
      wasExtended: isStillActive,
      daysAdded: daysAdded,
      message: isStillActive 
        ? `המנוי הוארך בהצלחה! קיבלת ${selectedPlan.durationDays} ימים נוספים`
        : 'המנוי חודש בהצלחה',
      redirectTo: '/levelSelection?showWelcome=true'
    });

  } catch (error) {
    console.error('Renew subscription error:', error);
    return NextResponse.json(
      { error: 'שגיאה כללית בתהליך חידוש המנוי' },
      { status: 500 }
    );
  }
}