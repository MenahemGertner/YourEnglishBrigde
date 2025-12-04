// נתיב: (users)/registration/api/mark-coupon-used/route.js

import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { couponCode, userId } = await req.json();

    if (!couponCode || !userId) {
      return NextResponse.json(
        { error: 'חסרים פרטים' },
        { status: 400 }
      );
    }

    // סימון הקופון כמשומש
    const { error } = await supabaseAdmin
      .schema('public')
      .from('coupons')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_by_user_id: userId
      })
      .eq('code', couponCode);

    if (error) {
      console.error('Error marking coupon as used:', error);
      return NextResponse.json(
        { error: 'שגיאה בעדכון הקופון' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Mark coupon error:', error);
    return NextResponse.json(
      { error: 'שגיאה כללית' },
      { status: 500 }
    );
  }
}