import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';

// Cache לשמירת בקשות שכבר טופלו
const processedRequests = new Map();

// ניקוי cache כל 10 דקות
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of processedRequests.entries()) {
    if (now - timestamp > 10 * 60 * 1000) {
      processedRequests.delete(key);
    }
  }
}, 60 * 1000);

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
      installmentsCount,
      paymentDetails,
      transactionId,
      mode, // 'new' או 'renewal'
      previousPlan,
      userId
    } = await req.json();

    console.log('📝 Starting complete-purchase for:', email, 'Mode:', mode);
    console.log('📊 Payment details:', { planId, installmentsCount, paymentDetails });

    // בדיקות בסיסיות
    if (!email || !name) {
      return NextResponse.json(
        { error: 'חסרים פרטים חיוניים - אימייל ושם' },
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

    // בדיקת תקינות מספר תשלומים
    if (!installmentsCount || installmentsCount < 1) {
      return NextResponse.json(
        { error: 'מספר תשלומים לא תקין' },
        { status: 400 }
      );
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

    // חישוב סכום התשלום הראשון
    let amountPaid = selectedPlan.basePrice;
    if (paymentDetails && paymentDetails.firstPayment) {
      amountPaid = paymentDetails.firstPayment;
    } else if (installmentsCount > 1) {
      const regularPayment = Math.floor(selectedPlan.basePrice / installmentsCount);
      const totalRegularPayments = regularPayment * (installmentsCount - 1);
      amountPaid = selectedPlan.basePrice - totalRegularPayments;
    }

    // === טיפול במשתמש ===
    let userIdFinal;
    let isNewUser = false;

    if (mode === 'renewal' && userId) {
      // מצב חידוש - המשתמש כבר קיים
      console.log('🔄 Renewal mode - using existing user:', userId);
      userIdFinal = userId;
      
      // עדכון פרטי משתמש אם צריך (למקרה שיש עדכונים)
      const { error: updateError } = await supabaseAdmin
        .schema('public')
        .from('users')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('⚠️ Error updating user timestamp:', updateError);
      }

    } else {
      // מצב רגיל - בדיקה אם המשתמש קיים או יצירה חדשה
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .schema('public')
        .from('users')
        .select('*, subscriptions(*)')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking user:', checkError);
        return NextResponse.json(
          { error: 'שגיאה בבדיקת משתמש קיים' },
          { status: 500 }
        );
      }

      if (existingUser) {
        console.log('👤 User already exists, updating details...');
        
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

        userIdFinal = existingUser.id;
        console.log('✅ User updated successfully:', userIdFinal);

      } else {
        console.log('🆕 Creating new user...');
        
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

        userIdFinal = newUser.id;
        isNewUser = true;
        console.log('✅ User created successfully:', userIdFinal);

        // יצירת preferences למשתמש חדש
        const { error: preferencesError } = await supabaseAdmin
          .schema('public')
          .from('user_preferences')
          .insert([
            {
              user_id: userIdFinal,
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
    }

    // === טיפול במנוי ===
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + selectedPlan.durationDays);

    let newSubscription;
    let actionType = 'created';

    if (mode === 'renewal') {
      // מצב חידוש - עדכון המנוי הקיים
      console.log('🔄 Renewal mode - updating existing subscription');

      // שליפת המנוי הנוכחי
      const { data: currentSubscription, error: fetchError } = await supabaseAdmin
        .schema('public')
        .from('subscriptions')
        .select('*')
        .eq('user_id', userIdFinal)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching current subscription:', fetchError);
        return NextResponse.json(
          { error: 'שגיאה בשליפת מנוי נוכחי' },
          { status: 500 }
        );
      }

      // קביעת סוג הפעולה
      if (previousPlan === 'Free Trial' && planId !== 'Free Trial') {
        actionType = 'upgraded';
      } else if (planId === 'Premium' && previousPlan !== 'Premium') {
        actionType = 'upgraded';
      } else if (planId === 'Intensive' && previousPlan === 'Premium') {
        actionType = 'downgraded';
      } else {
        actionType = 'renewed';
      }

      // בדיקה אם המנוי עדיין פעיל
      const currentEndDate = new Date(currentSubscription.end_date);
      const isStillActive = currentSubscription.status === 'active' && currentEndDate > startDate;

      let finalStartDate, finalEndDate;
      
      if (isStillActive) {
        // המנוי עדיין פעיל - התחל מתאריך הסיום הנוכחי
        finalStartDate = new Date(currentSubscription.start_date);
        finalEndDate = new Date(currentEndDate);
        finalEndDate.setDate(finalEndDate.getDate() + selectedPlan.durationDays);
        console.log(`🔄 Extending active subscription by ${selectedPlan.durationDays} days`);
      } else {
        // המנוי פג תוקף - התחל מהיום
        finalStartDate = startDate;
        finalEndDate = endDate;
        console.log(`🆕 Starting fresh subscription from today`);
      }

      // עדכון המנוי
      const { data: updatedSub, error: updateError } = await supabaseAdmin
        .schema('public')
        .from('subscriptions')
        .update({
          subscription_type: selectedPlan.type,
          status: 'active',
          start_date: finalStartDate.toISOString(),
          end_date: finalEndDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSubscription.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating subscription:', updateError);
        return NextResponse.json(
          { error: 'שגיאה בעדכון המנוי: ' + updateError.message },
          { status: 500 }
        );
      }

      newSubscription = updatedSub;
      console.log(`✅ Subscription ${actionType}:`, currentSubscription.subscription_type, '→', selectedPlan.type);

    } else {
      // מצב רגיל - יצירת מנוי חדש
      
      // בדיקה אם יש מנוי פעיל (למשתמש קיים שמנסה לקנות שוב)
      const { data: activeSubscription } = await supabaseAdmin
        .schema('public')
        .from('subscriptions')
        .select()
        .eq('user_id', userIdFinal)
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
      const { data: createdSub, error: subscriptionError } = await supabaseAdmin
        .schema('public')
        .from('subscriptions')
        .insert([
          {
            user_id: userIdFinal,
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
        
        if (isNewUser) {
          await supabaseAdmin
            .schema('public')
            .from('users')
            .delete()
            .eq('id', userIdFinal);
        }

        return NextResponse.json(
          { error: 'שגיאה ביצירת המנוי: ' + subscriptionError.message },
          { status: 500 }
        );
      }

      newSubscription = createdSub;
      actionType = 'created';
      console.log('✅ Subscription created successfully:', newSubscription.id);
    }

    // === רישום בהיסטוריה ===
    const paymentMethod = installmentsCount === 1 ? 'full' : `installments_${installmentsCount}`;
    
    const { error: historyError } = await supabaseAdmin
      .schema('public')
      .from('subscription_history')
      .insert({
        user_id: userIdFinal,
        action_type: actionType,
        plan_type: selectedPlan.type,
        amount_paid: amountPaid,
        payment_method: paymentMethod,
        transaction_id: transactionId || null
      });

    if (historyError) {
      console.error('⚠️ Error recording history:', historyError);
    } else {
      console.log('✅ Subscription history recorded:', { 
        actionType,
        paymentMethod, 
        amountPaid, 
        installmentsCount 
      });
    }

    // === קבלת נתונים סופיים ===
    const { data: finalUser } = await supabaseAdmin
      .schema('public')
      .from('users')
      .select()
      .eq('id', userIdFinal)
      .single();

    const successResponse = {
      success: true,
      user: finalUser,
      subscription: newSubscription,
      paymentInfo: {
        amountPaid,
        installmentsCount,
        paymentMethod,
        totalAmount: selectedPlan.basePrice
      },
      actionType: actionType,
      message: mode === 'renewal' ? 'המנוי חודש בהצלחה' : 'הרכישה הושלמה בהצלחה',
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