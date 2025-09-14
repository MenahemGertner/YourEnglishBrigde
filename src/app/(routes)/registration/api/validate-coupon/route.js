// /registration/api/validate-coupon/route.js
import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { couponCode, email } = await req.json();

    // בדיקת תקינות הפרמטרים
    if (!couponCode || !email) {
      return NextResponse.json(
        { error: 'קוד קופון וכתובת מייל נדרשים', valid: false },
        { status: 400 }
      );
    }

    // טיפול בקופון המנהלי הישן
    if (couponCode === '13579') {
      return NextResponse.json({
        valid: true,
        message: 'Admin coupon validated'
      });
    }

    // בדיקת הקופון במסד הנתונים
    const { data: coupon, error: fetchError } = await supabaseAdmin
      .schema('public')
      .from('coupons')
      .select('*')
      .eq('code', couponCode)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching coupon:', fetchError);
      return NextResponse.json(
        { error: 'שגיאה בבדיקת הקופון', valid: false },
        { status: 500 }
      );
    }

    // אם הקופון לא קיים
    if (!coupon) {
      return NextResponse.json({
        valid: false,
        error: 'קוד קופון לא קיים'
      });
    }

    // בדיקה שהמייל תואם
    if (coupon.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({
        valid: false,
        error: 'קוד זה אינו תקף עבור כתובת מייל זו'
      });
    }

    // בדיקה שהקופון לא שומש כבר
    if (coupon.is_used) {
      return NextResponse.json({
        valid: false,
        error: 'קוד זה כבר שומש בעבר'
      });
    }

    // בדיקת תאריך תפוגה
    const now = new Date();
    const expiresAt = new Date(coupon.expires_at);
    
    if (now > expiresAt) {
      return NextResponse.json({
        valid: false,
        error: 'קוד זה פג תוקף'
      });
    }

    // הכל תקין - הקופון בתוקף
    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        email: coupon.email,
        expires_at: coupon.expires_at
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'שגיאה כללית בבדיקת הקופון', valid: false },
      { status: 500 }
    );
  }
}