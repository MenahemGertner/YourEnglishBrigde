// app/(routes)/words/navigation/api/wordUpdate/route.js
import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';
import { withUser } from '@/utils/withUser';

export const GET = withUser(async (request, userId) => {
  const { searchParams } = new URL(request.url);
  const wordId = searchParams.get('id');

  if (!wordId) {
    return NextResponse.json(
      { status: 'error', error: 'נדרש מזהה מילה' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('user_words')
    .select('*')
    .match({ user_id: userId, word_id: wordId })
    .single();

    if (error && error.code !== 'PGRST116') throw error;
    return NextResponse.json({
      status: 'success',
      data: data || null
    });
});

export const POST = withUser(async (request, userId) => {
  const { word_id, level = 0, next_review = null, word_forms = null } = await request.json();

  if (!word_id) {
    return NextResponse.json(
      { status: 'error', error: 'נדרש מזהה מילה' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('user_words')
    .insert([{
      user_id: userId,
      word_id,
      level,
      next_review,
      word_forms,
      current_sequence_position: 0,
      created_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    }])
    .select();

  if (error) throw error;
  return data[0];
});

export const DELETE = withUser(async (request, userId) => {
  const { searchParams } = new URL(request.url);
  const wordId = searchParams.get('id');

  if (!wordId) {
    return NextResponse.json(
      { status: 'error', error: 'נדרש מזהה מילה' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('user_words')
    .delete()
    .match({ user_id: userId, word_id: wordId });

  if (error) throw error;
  return null;
});

// PATCH עבור user_words - עדכון פרטי מילה
export const PATCH = withUser(async (request, userId) => {
  const { word_id, ...updates } = await request.json();

  if (!word_id) {
    return NextResponse.json(
      { status: 'error', error: 'נדרש מזהה מילה' },
      { status: 400 }
    );
  }

  // בדיקה שיש מה לעדכן
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { status: 'error', error: 'לא נשלחו שדות לעדכון' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('user_words')
    .update(updates)
    .match({ user_id: userId, word_id: word_id })
    .select();

  if (error) throw error;
  return data[0];
});