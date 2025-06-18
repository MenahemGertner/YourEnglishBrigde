import { createServerClient } from '@/lib/db/supabase';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.accessToken) {
      return NextResponse.json(
        { error: 'יש להתחבר כדי לצפות במילים' },
        { status: 401 }
      );
    }

    // יצירת לקוח Supabase עם הטוקן של המשתמש
    const supabaseClient = createServerClient(session.accessToken);
    
    // Get user ID - אופציונלי כי ה-ID אמור להיות בסשן
    const userId = session.user.id;
    
    let userIdToUse;
    
    if (!userId) {
      // במקרה שאין ID בסשן, אפשר לחפש אותו לפי אימייל
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
      }
      
      userIdToUse = userData.id;
    } else {
      userIdToUse = userId;
    }

    // Get word indices and their levels - שליפת האינדקסים במקום המילים
    const { data: userWords, error: wordsError } = await supabaseClient
      .from('user_words')
      .select('word_id, level')
      .eq('user_id', userIdToUse)
      .not('word_id', 'is', null);

    if (wordsError) {
      console.error('Words lookup error:', wordsError);
      return NextResponse.json({ error: 'שגיאה בשליפת המילים' }, { status: 500 });
    }

    // Initialize the result structure
    const result = {
      wordIndices: {
        level2: [],
        level3: [],
        level4: []
      }
    };

    // Process each word index and organize by level
    userWords.forEach(item => {
      if (item.word_id && item.level >= 2 && item.level <= 4) {
        result.wordIndices[`level${item.level}`].push(parseInt(item.word_id));
      }
    });

    // Remove duplicates from each array
    for (const level of [2, 3, 4]) {
      result.wordIndices[`level${level}`] = [...new Set(result.wordIndices[`level${level}`])];
    }

    return NextResponse.json({
      wordIndices: result.wordIndices,
      stats: {
        level2: result.wordIndices.level2.length,
        level3: result.wordIndices.level3.length,
        level4: result.wordIndices.level4.length,
        total: result.wordIndices.level2.length + result.wordIndices.level3.length + result.wordIndices.level4.length
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