// app/api/userWords/route.js
import { supabaseAdmin } from '../../lib/supabase';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

function calculateNextReview(currentPosition, level) {
  if (level === 1) return null;
  const intervals = { 2: 10, 3: 5, 4: 3 };
  return currentPosition + (intervals[level] || 0);
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
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError) {
      console.error('User lookup error:', userError);
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    const { word_id, level, currentSequencePosition } = await request.json();

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

    // בדוק אם כבר קיימת רשומה למילה זו
    const { data: existingWord } = await supabaseAdmin
      .from('user_words')
      .select('current_sequence_position, level')
      .eq('user_id', userData.id)
      .eq('word_id', parseInt(word_id))
      .single();

    let finalLevel = level;
    let position;

    if (existingWord) {
      // אם לא נשלחה רמה חדשה, השתמש ברמה הקיימת
      finalLevel = level || existingWord.level;
      // השתמש במיקום הקיים
      position = existingWord.current_sequence_position;
    } else {
      // מילה חדשה - השתמש במיקום הנוכחי
      position = currentSequencePosition;
    }

    const nextReview = calculateNextReview(position, finalLevel);

    const insertData = {
      user_id: userData.id,
      word_id: parseInt(word_id),
      level: finalLevel,
      last_seen: new Date().toISOString(),
      next_review: nextReview,
      current_sequence_position: position
    };

    const { error } = await supabaseAdmin
      .from('user_words')
      .upsert(insertData, {
        onConflict: 'user_id,word_id',
        update: ['level', 'last_seen', 'next_review']  // לא מעדכנים את current_sequence_position
      });

    if (error) {
      console.error('Upsert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Full error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאת שרת פנימית' },
      { status: 500 }
    );
  }
}