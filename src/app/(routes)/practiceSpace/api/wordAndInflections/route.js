import { supabaseAdmin } from '@/lib/db/supabase';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'יש להתחבר כדי לצפות במילים' },
        { status: 401 }
      );
    }

    // Get user ID first
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError) {
      console.error('User lookup error:', userError);
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    // Get words and their levels
    const { data: userWords, error: wordsError } = await supabaseAdmin
      .from('user_words')
      .select('word_forms, level')
      .eq('user_id', userData.id)
      .not('word_forms', 'is', null);

    if (wordsError) {
      console.error('Words lookup error:', wordsError);
      return NextResponse.json({ error: 'שגיאה בשליפת המילים' }, { status: 500 });
    }

    // Initialize the result structure
    const result = {
      words: {
        level2: [],
        level3: [],
        level4: []
      },
      inflections: {
        level2: [],
        level3: [],
        level4: []
      }
    };

    // Process each word and organize by level
    userWords.forEach(item => {
      if (item.word_forms && item.level >= 2 && item.level <= 4) {
        // Add the main word to the appropriate level
        if (item.word_forms.word) {
          result.words[`level${item.level}`].push(item.word_forms.word);
        }

        // Add inflections to the appropriate level
        if (item.word_forms.inflections && Array.isArray(item.word_forms.inflections)) {
          result.inflections[`level${item.level}`].push(...item.word_forms.inflections);
        }
      }
    });

    // Remove duplicates from each array
    for (const level of [2, 3, 4]) {
      result.words[`level${level}`] = [...new Set(result.words[`level${level}`])];
      result.inflections[`level${level}`] = [...new Set(result.inflections[`level${level}`])];
    }

    return NextResponse.json({
      words: result.words,
      inflections: result.inflections,
      stats: {
        words: {
          level2: result.words.level2.length,
          level3: result.words.level3.length,
          level4: result.words.level4.length,
          total: result.words.level2.length + result.words.level3.length + result.words.level4.length
        },
        inflections: {
          level2: result.inflections.level2.length,
          level3: result.inflections.level3.length,
          level4: result.inflections.level4.length,
          total: result.inflections.level2.length + result.inflections.level3.length + result.inflections.level4.length
        }
      }
    });

  } catch (error) {
    console.error('Full error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאת שרת פנימית' },
      { status: 500 }
    );
  }
}