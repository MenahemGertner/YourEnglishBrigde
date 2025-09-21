import { supabaseAdmin } from '@/lib/db/supabase';
import { requireAuth } from '@/utils/auth-helpers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // אימות פשוט - אם לא מחובר, מחזיר level: null
    let session;
    try {
      session = await requireAuth();
    } catch (error) {
      return NextResponse.json({ level: null });
    }

    const { searchParams } = new URL(request.url);
    const wordId = searchParams.get('word_id');

    if (!wordId) {
      return NextResponse.json({ level: null });
    }

    const userId = session.user.id;

    // שאילתה פשוטה עם supabaseAdmin
    const { data: wordData, error: wordError } = await supabaseAdmin
      .from('user_words')
      .select('level')
      .eq('user_id', userId)
      .eq('word_id', parseInt(wordId))
      .single();

    if (wordError && wordError.code !== 'PGRST116') {
      console.error('Word lookup error:', wordError);
      return NextResponse.json({ level: null });
    }

    return NextResponse.json({ level: wordData?.level || null });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ level: null });
  }
}