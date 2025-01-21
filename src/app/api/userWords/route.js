// app/api/userWords/route.js
import { supabaseAdmin } from '../../lib/supabase';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

function calculateNextReview(currentPosition, level, isEndOfList, existingNextReview) {
  if (level === 1) return null;
  
  const intervals = { 2: 10, 3: 5, 4: 3 };
  const interval = intervals[level] || 0;
  
  if (isEndOfList) {
    return existingNextReview + interval;
  }
  
  return currentPosition + interval;
}

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
      
      if (newCounter >= 10) {
        shouldRedirectToPractice = true;
        // איפוס המונה
        await supabaseAdmin
          .from('users')
          .update({ practice_counter: 0 })
          .eq('id', userData.id);
      } else {
        // עדכון המונה
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
      current_sequence_position: position
    };

    const { error: upsertError } = await supabaseAdmin
      .from('user_words')
      .upsert(insertData, {
        onConflict: 'user_id,word_id',
        update: ['level', 'last_seen', 'next_review', 'current_sequence_position']
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