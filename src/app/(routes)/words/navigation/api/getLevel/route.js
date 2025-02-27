import { createServerClient } from '@/lib/db/supabase';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.accessToken) {
      return NextResponse.json({ level: null });
    }

    const { searchParams } = new URL(request.url);
    const wordId = searchParams.get('word_id');

    if (!wordId) {
      return NextResponse.json({ level: null });
    }

    // יצירת לקוח Supabase עם הטוקן של המשתמש
    const supabaseClient = createServerClient(session.accessToken);

    // Get user ID - אופציונלי כי ה-ID כבר אמור להיות בסשן
    const userId = session.user.id;

    if (!userId) {
      // במקרה שאין ID בסשן, אפשר לחפש אותו לפי אימייל
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        return NextResponse.json({ level: null });
      }

      // Get word level 
      const { data: wordData, error: wordError } = await supabaseClient
        .from('user_words')
        .select('level')
        .eq('user_id', userData.id)
        .eq('word_id', parseInt(wordId))
        .single();

      if (wordError && wordError.code !== 'PGRST116') {
        console.error('Word lookup error:', wordError);
        return NextResponse.json({ level: null });
      }

      return NextResponse.json({ level: wordData?.level || null });
    } else {
      // שימוש ישיר ב-ID מהסשן
      const { data: wordData, error: wordError } = await supabaseClient
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
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ level: null });
  }
}