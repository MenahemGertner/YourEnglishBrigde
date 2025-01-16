// app/api/userWords/nextReview/route.js
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

    // קבל את כל המילים שדורשות חזרה
    const { data: words, error: wordsError } = await supabaseAdmin
      .from('user_words')
      .select('*')
      .eq('user_id', userData.id)
      .gt('level', 1);

    if (wordsError) {
      console.error('Supabase error:', wordsError);
      return NextResponse.json({ error: wordsError.message }, { status: 500 });
    }

    // פילטור מילים שמוכנות לחזרה
    const dueWords = words.filter(word => {
      // וודא שזו לא המילה הנוכחית
      if (word.word_id === currentIndex) {
        return false;
      }

      // וודא שעבר מספיק זמן מהפעם האחרונה שראינו את המילה
      const timeSinceLastPosition = currentIndex - word.current_sequence_position;
      
      const intervals = {
        2: 10,
        3: 5,
        4: 3
      };

      // בדוק אם עבר המרווח המינימלי הנדרש לרמה זו
      const requiredInterval = intervals[word.level] || 0;
      
      return (
        word.next_review <= currentIndex && // הגיע זמן החזרה המתוכנן
        timeSinceLastPosition >= requiredInterval // עבר מספיק זמן מהפעם האחרונה
      );
    });

    // מיין את המילים לפי עדיפות
    dueWords.sort((a, b) => {
      // קודם כל, מיין לפי רמת קושי (גבוה יותר = דחוף יותר)
      if (a.level !== b.level) {
        return b.level - a.level;
      }
      // אם הרמה זהה, מיין לפי זמן החזרה המתוכנן
      return a.next_review - b.next_review;
    });

    // אם נמצאה מילה לחזרה, עדכן את המיקום הנוכחי שלה
    if (dueWords.length > 0) {
      const wordToReview = dueWords[0];
      
      // עדכן את המיקום הנוכחי של המילה
      const { error: updateError } = await supabaseAdmin
        .from('user_words')
        .update({
          current_sequence_position: currentIndex,
          last_seen: new Date().toISOString()
        })
        .eq('user_id', userData.id)
        .eq('word_id', wordToReview.word_id);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json(dueWords || []);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}