import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';

// Cache לשמירת בקשות שכבר טופלו
const processedRequests = new Map();

// ניקוי cache כל 10 דקות
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of processedRequests.entries()) {
    if (now - timestamp > 10 * 60 * 1000) { // 10 דקות
      processedRequests.delete(key);
    }
  }
}, 60 * 1000); // בדיקה כל דקה

export async function POST(req) {
  try {
    const idempotencyKey = req.headers.get('X-Idempotency-Key');
    
    // בדיקת idempotency
    if (idempotencyKey && processedRequests.has(idempotencyKey)) {
      console.log('⚠️ Duplicate request detected, returning cached response');
      return NextResponse.json(processedRequests.get(idempotencyKey));
    }

    const { 
      email, 
      name, 
      avatar_url, 
      phone,
      city,
      street,
      house_number,
      zip_code,
      planId,
      paymentMethod,
      transactionId 
    } = await req.json();

    console.log('📝 Starting complete-purchase for:', email);

    // בדיקות בסיסיות
    if (!email || !name) {
      return NextResponse.json(
        { error: 'חסרים פרטים חיוניים - אימייל ושם' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: 'מספר טלפון הוא שדה חובה' },
        { status: 400 }
      );
    }

    // בדיקה שה-planId תקין
    const validPlans = ['Free Trial', 'Intensive', 'Premium'];
    if (!planId || !validPlans.includes(planId)) {
      return NextResponse.json(
        { error: 'סוג מנוי לא תקין' },
        { status: 400 }
      );
    }

    // בדיקה אם המשתמש כבר קיים
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .schema('public')
      .from('users')
      .select('*, subscriptions(*)')
      .eq('email', email.toLowerCase())
      .single();

    let userId;
    let isNewUser = false;

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking user:', checkError);
      return NextResponse.json(
        { error: 'שגיאה בבדיקת משתמש קיים' },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log('👤 User already exists, updating details...');
      
      // עדכון הפרטים של המשתמש הקיים
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .schema('public')
        .from('users')
        .update({
          name,
          avatar_url: avatar_url || existingUser.avatar_url,
          phone: phone || existingUser.phone,
          city: city || existingUser.city,
          street: street || existingUser.street,
          house_number: house_number || existingUser.house_number,
          zip_code: zip_code || existingUser.zip_code,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating user:', updateError);
        return NextResponse.json(
          { error: 'שגיאה בעדכון פרטי המשתמש' },
          { status: 500 }
        );
      }

      userId = existingUser.id;
      console.log('✅ User updated successfully:', userId);

    } else {
      console.log('🆕 Creating new user...');
      
      // יצירת משתמש חדש
      const { data: newUser, error: insertError } = await supabaseAdmin
        .schema('public')
        .from('users')
        .insert([
          {
            email: email.toLowerCase(),
            name,
            avatar_url: avatar_url || null,
            phone,
            city: city || null,
            street: street || null,
            house_number: house_number || null,
            zip_code: zip_code || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating user:', insertError);
        return NextResponse.json(
          { error: 'שגיאה ביצירת המשתמש: ' + insertError.message },
          { status: 500 }
        );
      }

      userId = newUser.id;
      isNewUser = true;
      console.log('✅ User created successfully:', userId);

      // יצירת הגדרות אישיות למשתמש חדש
      const { error: preferencesError } = await supabaseAdmin
        .schema('public')
        .from('user_preferences')
        .insert([
          {
            user_id: userId,
            practice_counter: 0,
            practice_threshold: 25,
            story_level: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (preferencesError) {
        console.error('⚠️ Error creating preferences:', preferencesError);
      } else {
        console.log('✅ User preferences created');
      }
    }

    // מיפוי תכניות למנויים
    const subscriptionMapping = {
      'Free Trial': {
        type: 'Free Trial',
        durationDays: 7,
        basePrice: 0
      },
      'Intensive': {
        type: 'Intensive', 
        durationDays: 90,
        basePrice: 747
      },
      'Premium': {
        type: 'Premium',
        durationDays: 360,
        basePrice: 2148
      }
    };

    const selectedPlan = subscriptionMapping[planId];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + selectedPlan.durationDays);

    // בדיקה אם יש מנוי פעיל
    const { data: activeSubscription } = await supabaseAdmin
      .schema('public')
      .from('subscriptions')
      .select()
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .single();

    if (activeSubscription) {
      console.log('⚠️ User already has an active subscription');
      return NextResponse.json(
        { error: 'למשתמש זה כבר יש מנוי פעיל' },
        { status: 400 }
      );
    }

    // יצירת מנוי חדש
    const { data: newSubscription, error: subscriptionError } = await supabaseAdmin
      .schema('public')
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
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
      console.error('❌ Error creating subscription:', subscriptionError);
      
      // רק אם יצרנו משתמש חדש - נמחק אותו
      if (isNewUser) {
        await supabaseAdmin
          .schema('public')
          .from('users')
          .delete()
          .eq('id', userId);
      }

      return NextResponse.json(
        { error: 'שגיאה ביצירת המנוי: ' + subscriptionError.message },
        { status: 500 }
      );
    }

    console.log('✅ Subscription created successfully:', newSubscription.id);

    // חישוב סכום בפועל (אם זה פריסה, רק התשלום הראשון)
    const actualPrice = paymentMethod === 'installments' 
      ? Math.ceil(selectedPlan.basePrice / 3) 
      : selectedPlan.basePrice;

    // רישום בהיסטוריית מנויים
    const { error: historyError } = await supabaseAdmin
      .schema('public')
      .from('subscription_history')
      .insert({
        user_id: userId,
        subscription_id: newSubscription.id,
        action_type: 'created',
        plan_type: selectedPlan.type,
        amount_paid: actualPrice,
        payment_method: paymentMethod || 'full',
        transaction_id: transactionId || null
      });

    if (historyError) {
      console.error('⚠️ Error recording history:', historyError);
    } else {
      console.log('✅ Subscription history recorded');
    }

    // TODO: שליחת מייל ברכה - יתווסף בהמשך
    // try {
    //   await sendWelcomeEmail(email, name);
    //   console.log('✅ Welcome email sent successfully to:', email);
    // } catch (emailError) {
    //   console.error('⚠️ Failed to send welcome email:', emailError.message);
    // }

    // קבלת הנתונים המעודכנים
    const { data: finalUser } = await supabaseAdmin
      .schema('public')
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    const successResponse = {
      success: true,
      user: finalUser,
      subscription: newSubscription,
      message: 'הרכישה הושלמה בהצלחה',
      isNewUser: isNewUser
    };

    // שמירה ב-cache
    if (idempotencyKey) {
      processedRequests.set(idempotencyKey, successResponse);
    }

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('❌ Complete purchase error:', error);
    
    const errorResponse = {
      error: 'שגיאה כללית בתהליך השלמת הרכישה'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}