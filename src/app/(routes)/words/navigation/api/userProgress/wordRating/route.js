// app/api/userProgress/wordRating/route.js
import { supabaseAdmin } from '@/lib/db/supabase';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { calculateNextReview, PRACTICE_THRESHOLD } from '../../../helpers/reviewHelperFunctions';
import { connectToDatabase } from '@/lib/db/mongodb';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'יש להתחבר כדי לשמור את הדירוג' },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, practice_counter')
      .eq('email', session.user.email)
      .single();

    if (userError) {
      console.error('User lookup error:', userError);
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    const { word_id, level, currentSequencePosition, isEndOfList } = await request.json();

    // Fetch word data from MongoDB to get inflections
    const { db } = await connectToDatabase();
    const categories = ['500', '1000', '1500', '2000', '2500'];
    
    let wordData = null;
    for (const category of categories) {
      const collection = db.collection(category);
      wordData = await collection.findOne({ index: parseInt(word_id) });
      if (wordData) break;
    }

    // Create word_forms object structure
    const wordForms = wordData ? {
      word: wordData.word,
      inflections: wordData.inf || []
    } : {
      word: '',
      inflections: []
    };

    // אם הרמה היא 1, נמחק את הרשומה אם היא קיימת
    if (level === 1) {
      const { error: deleteError } = await supabaseAdmin
        .from('user_words')
        .delete()
        .match({ user_id: userData.id, word_id: parseInt(word_id) });

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }
      return NextResponse.json({ success: true });
    }

    // בדיקה והעדכון של מונה התרגול
    let shouldRedirectToPractice = false;
    if (level > 1) {
      const newCounter = (userData.practice_counter || 0) + level;
      
      if (newCounter >= PRACTICE_THRESHOLD) {
        shouldRedirectToPractice = true;
        await supabaseAdmin
          .from('users')
          .update({ practice_counter: 0 })
          .eq('id', userData.id);
      } else {
        await supabaseAdmin
          .from('users')
          .update({ practice_counter: newCounter })
          .eq('id', userData.id);
      }
    }

    // בדוק אם כבר קיימת רשומה למילה זו
    const { data: existingWord, error: existingWordError } = await supabaseAdmin
      .from('user_words')
      .select('current_sequence_position, level, next_review')
      .eq('user_id', userData.id)
      .eq('word_id', parseInt(word_id))
      .single();

    if (existingWordError && existingWordError.code !== 'PGRST116') {
      console.error('Existing word lookup error:', existingWordError);
      throw existingWordError;
    }

    let finalLevel = level;
    let position = existingWord?.current_sequence_position || currentSequencePosition;

    const nextReview = calculateNextReview(
      position,
      finalLevel,
      isEndOfList,
      existingWord?.next_review || position
    );

    const insertData = {
      user_id: userData.id,
      word_id: parseInt(word_id),
      level: finalLevel,
      last_seen: new Date().toISOString(),
      next_review: nextReview,
      current_sequence_position: position,
      word_forms: wordForms  // Now using the new object structure
    };

    const { error: upsertError } = await supabaseAdmin
      .from('user_words')
      .upsert(insertData, {
        onConflict: 'user_id,word_id',
        update: [
          'level', 
          'last_seen', 
          'next_review', 
          'current_sequence_position',
          'word_forms'
        ]
      });

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      throw upsertError;
    }

    return NextResponse.json({ 
      success: true,
      shouldRedirectToPractice,
      practiceCounter: shouldRedirectToPractice ? 0 : (userData.practice_counter || 0) + (level > 1 ? level : 0)
    });

  } catch (error) {
    console.error('Full error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאת שרת פנימית' },
      { status: 500 }
    );
  }
}