'use server'

import { intervals } from '../helpers/reviewHelperFunctions';
import { createServerClient } from '@/lib/db/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function updateInfo(userId, wordId, level, category, word, inf) {
  try {
    if (!userId) throw new Error('נדרש מזהה משתמש');
    if (!wordId || !category) throw new Error('נדרש מזהה מילה וקטגוריה');
    if (!level || !Number.isInteger(level) || level < 1 || level > 4) {
      throw new Error('רמת קושי לא תקינה');
    }

    // קבלת מידע על הסשן מהשרת
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken || !session?.user?.id) {
      throw new Error('נדרש אימות');
    }
    
    // וידוא שהמשתמש מנסה לגשת למידע שלו בלבד
    if (session.user.id !== userId) {
      throw new Error('גישה לא מורשית');
    }
    
    // יצירת לקוח Supabase עם הטוקן של המשתמש
    const supabaseClient = createServerClient(session.accessToken);

    // בדיקה האם המילה קיימת
    const { data: existingWord, error: checkError } = await supabaseClient
      .from('user_words')
      .select('*')
      .match({ user_id: userId, word_id: wordId })
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    // קבלת נתוני המשתמש הנוכחיים
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('practice_counter, last_position')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // טיפול ברמה 1 - מחיקה
    if (level === 1) {
      if (existingWord) {
        await supabaseClient
          .from('user_words')
          .delete()
          .match({ user_id: userId, word_id: wordId });
      }

      const updatedLastPosition = {
        index: wordId,
        category,
        learning_sequence_pointer: userData.last_position?.learning_sequence_pointer || 0
      };

      if (wordId - 1 == (userData.last_position?.learning_sequence_pointer || 0) || userData.last_position === null) {
        updatedLastPosition.learning_sequence_pointer = wordId;
      }

      await supabaseClient
        .from('users')
        .update({
          last_position: updatedLastPosition
        })
        .eq('id', userId);

      return { success: true, action: 'deleted' };
    }

    // טיפול ברמות 2-4
    let result;
    if (existingWord) {
      const nextReview = existingWord.next_review + intervals[level];
      
      const { data: updateData, error: updateError } = await supabaseClient
        .from('user_words')
        .update({
          level,
          next_review: nextReview
        })
        .match({ user_id: userId, word_id: wordId })
        .select();

      if (updateError) throw updateError;
      result = { success: true, action: 'updated', data: updateData[0] };
    } else {
      const nextReview = wordId + intervals[level];
      
      // יצירת אובייקט word_forms מהנתונים החדשים
      const word_forms = {
        word: word,
        inflections: inf
      };

      const { data: createData, error: createError } = await supabaseClient
        .from('user_words')
        .insert([{
          user_id: userId,
          word_id: wordId,
          level,
          next_review: nextReview,
          word_forms
        }])
        .select();

      if (createError) throw createError;
      result = { success: true, action: 'created', data: createData[0] };
    }

    const updatedLastPosition = {
      index: wordId,
      category,
      learning_sequence_pointer: userData.last_position?.learning_sequence_pointer || 0
    };

    if (wordId - 1 == (userData.last_position?.learning_sequence_pointer || 0)|| userData.last_position === null) {
      updatedLastPosition.learning_sequence_pointer = wordId;
    }

    await supabaseClient
      .from('users')
      .update({
        last_position: updatedLastPosition,
        practice_counter: (userData.practice_counter || 0) + level
      })
      .eq('id', userId);

    return result;

  } catch (error) {
    console.error('Error in updateInfo:', error);
    return { success: false, error: error.message };
  }
}