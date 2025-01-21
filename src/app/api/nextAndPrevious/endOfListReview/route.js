// app/api/nextAndPrevious/endOfListReview/route.js
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

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // מביא את כל המילים שצריכות חזרה
    const { data: remainingWords } = await supabaseAdmin
      .from('user_words')
      .select('word_id, level, next_review')  // הוספנו next_review לselect
      .eq('user_id', userData.id)
      .gt('level', 1)  // רק מילים שצריכות חזרה
      .order('next_review', { ascending: true })  // קודם לפי next_review
      .order('level', { ascending: false });  // במקרה של שוויון, לפי רמת קושי

    return NextResponse.json(remainingWords || []);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}