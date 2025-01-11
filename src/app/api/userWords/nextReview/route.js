import { supabaseAdmin } from '../../../lib/supabase';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      console.error('User lookup error:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const currentIndex = parseInt(searchParams.get('currentIndex')) || 0;

    // הבא את כל המילים שצריכות חזרה
    const { data, error } = await supabaseAdmin
      .from('user_words')
      .select('*')
      .eq('user_id', userData.id)
      .gt('level', 1)
      .order('next_review', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // סנן רק מילים שהגיע זמן החזרה שלהן
    const dueWords = data.filter(word => 
      word.next_review <= currentIndex || currentIndex === parseInt(searchParams.get('currentIndex'))
    );

    return NextResponse.json(dueWords || []);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}