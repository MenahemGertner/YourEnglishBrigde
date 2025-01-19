// app/api/register/route.js
import { supabaseAdmin } from '../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
      const { email, name, avatar_url, planId } = await req.json();
  
      console.log('Received registration data:', { email, name, avatar_url, planId }); // לוג לדיבוג
  

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
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error - ' + error.message },
      { status: 500 }
    );
  }
}