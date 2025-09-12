import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';
// ✅ הוספת ה-import החדש
import { sendWelcomeEmail } from '@/lib/email/mailer';

export async function POST(req) {
  try {
    const { email, name, avatar_url, planId } = await req.json();

    // בדיקה אם המשתמש נכנס דרך Google
    if (!email || !name) {
      return NextResponse.json(
        { error: 'יש לבצע זיהוי באמצעות Google לפני ההרשמה' },
        { status: 400 }
      );
    }

    // בדיקה שה-planId תקין
    const validPlans = ['free', 'monthly', 'semi-annual'];
    if (!planId || !validPlans.includes(planId)) {
      return NextResponse.json(
        { error: 'סוג מנוי לא תקין' },
        { status: 400 }
      );
    }

    // בדיקה אם המשתמש קיים עם schema מפורש
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .schema('public')
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking user:', checkError);
      return NextResponse.json(
        { error: checkError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // יצירת משתמש חדש עם schema מפורש
    const { data: newUser, error: insertError } = await supabaseAdmin
      .schema('public')
      .from('users')
      .insert([
        {
          email,
          name,
          avatar_url,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    console.log('User created successfully:', newUser);

    // מיפוי planId לסוג מנוי ותוקף
    const subscriptionMapping = {
      'free': {
        type: 'free',
        durationDays: 14
      },
      'monthly': {
        type: 'premium', 
        durationDays: 30
      },
      'semi-annual': {
        type: 'pro',
        durationDays: 180
      }
    };

    const selectedPlan = subscriptionMapping[planId];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + selectedPlan.durationDays);

    // יצירת מנוי למשתמש החדש
    const { data: newSubscription, error: subscriptionError } = await supabaseAdmin
      .schema('public')
      .from('subscriptions')
      .insert([
        {
          user_id: newUser.id,
          subscription_type: selectedPlan.type,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      // אם נכשלה יצירת המנוי, נמחק את המשתמש שנוצר
      await supabaseAdmin
        .schema('public')
        .from('users')
        .delete()
        .eq('id', newUser.id);

      return NextResponse.json(
        { error: 'שגיאה ביצירת המנוי: ' + subscriptionError.message },
        { status: 500 }
      );
    }

    console.log('Subscription created successfully:', newSubscription);

    // ✅ שליחת מייל ברכה - החלק החדש!
    try {
      await sendWelcomeEmail(email, name);
      console.log('✅ Welcome email sent successfully to:', email);
    } catch (emailError) {
      // חשוב: אם המייל נכשל, המשתמש עדיין נרשם בהצלחה!
      console.error('⚠️ Failed to send welcome email, but registration completed:', emailError.message);
      
      // אפשר להוסיף כאן שמירה של המייל הכושל לטבלת queue לניסיון מאוחר יותר
      // או לשלוח התראה למנהל המערכת
    }

    return NextResponse.json({
      user: newUser,
      subscription: newSubscription,
      message: 'המשתמש והמנוי נוצרו בהצלחה',
      // ✅ מידע על שליחת המייל (אופציונלי)
      emailSent: true // או false אם נכשל
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'שגיאה כללית בתהליך ההרשמה' },
      { status: 500 }
    );
  }
}