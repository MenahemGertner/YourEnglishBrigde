import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';

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

    console.log('User created successfully:', newUser); // לוג לדיבוג

    return NextResponse.json({ user: newUser });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 }
    );
  }
}