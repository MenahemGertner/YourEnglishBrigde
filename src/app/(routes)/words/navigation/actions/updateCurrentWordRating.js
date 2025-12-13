'use server'

import { intervals } from '../helpers/reviewHelperFunctions';
import { supabaseAdmin } from '@/lib/db/supabase';
import { requireAuthAndOwnership } from '@/utils/auth-helpers';
import { getPracticeThreshold } from '@/lib/userPreferences';

/**
 * עדכון דירוג המילה הנוכחית בלבד - ללא חיפוש המילה הבאה
 * פונקציה זו רצה ב-background אחרי שכבר ניווטנו למילה הבאה
 */
export async function updateCurrentWordRating(userId, wordId, level, category) {
  try {
    // בדיקות בסיסיות
    if (!wordId || !category) throw new Error('נדרש מזהה מילה וקטגוריה');
    if (!level || !Number.isInteger(level) || level < 1 || level > 4) {
      throw new Error('רמת קושי לא תקינה');
    }

    // אימות
    await requireAuthAndOwnership(userId);

    // שליפת נתונים במקביל
    const [existingWordResult, userDataResult, practiceThreshold] = await Promise.all([
      supabaseAdmin
        .from('user_words')
        .select('*')
        .match({ user_id: userId, word_id: wordId })
        .single(),
      supabaseAdmin
        .from('user_preferences')
        .select('practice_counter, last_position')
        .eq('user_id', userId)
        .single(),
      getPracticeThreshold(userId)
    ]);

    // טיפול בשגיאות
    if (existingWordResult.error && existingWordResult.error.code !== 'PGRST116') {
      throw existingWordResult.error;
    }
    if (userDataResult.error) {
      throw userDataResult.error;
    }

    const existingWord = existingWordResult.data;
    const userData = userDataResult.data;

    // חישוב נתונים חדשים
    const newPracticeCounter = (userData.practice_counter || 0) + (level === 1 ? 0 : level);
    const learningSequencePointer = userData.last_position?.learning_sequence_pointer || 0;
    
    // חישוב effectiveThreshold לפני עדכון ה-pointer
    const effectiveThreshold = (learningSequencePointer % 300 === 0) ? 10 : practiceThreshold;
    
    const updatedLastPosition = {
      index: wordId,
      category,
      learning_sequence_pointer: userData.last_position?.learning_sequence_pointer || 0
    };

    if (wordId - 1 === learningSequencePointer || userData.last_position === null) {
      updatedLastPosition.learning_sequence_pointer = wordId;
    }

    // עדכון המילה ב-user_words
    let wordUpdateResult;
    
    if (level === 1) {
      // מחיקת המילה
      if (existingWord) {
        wordUpdateResult = await supabaseAdmin
          .from('user_words')
          .delete()
          .match({ user_id: userId, word_id: wordId });
      }
    } else {
      // עדכון או יצירת המילה
      const nextReview = existingWord 
        ? existingWord.next_review + intervals[level]
        : wordId + intervals[level];

      if (existingWord) {
        wordUpdateResult = await supabaseAdmin
          .from('user_words')
          .update({
            level,
            next_review: nextReview
          })
          .match({ user_id: userId, word_id: wordId });
      } else {
        wordUpdateResult = await supabaseAdmin
          .from('user_words')
          .insert([{
            user_id: userId,
            word_id: wordId,
            level,
            next_review: nextReview
          }]);
      }
    }

    // בדיקת שגיאות בעדכון המילה
    if (wordUpdateResult?.error) {
      throw wordUpdateResult.error;
    }

    // בדיקה: האם עברנו לרמה חדשה?
    const isLevelComplete = updatedLastPosition.learning_sequence_pointer % 300 === 0
    let finalPracticeCounter = newPracticeCounter
    
    // רק נאפס אם סיימנו את הרשימה וגם אין יותר מילות חזרה ברשימה הנוכחית
    if (isLevelComplete && updatedLastPosition.learning_sequence_pointer > 0) {
      // חישוב טווח המילים של הרשימה הנוכחית
      const currentListStart = Math.floor((updatedLastPosition.learning_sequence_pointer - 1) / 300) * 300 + 1;
      const currentListEnd = currentListStart + 299;
      
      // בדיקה: האם יש עוד מילות חזרה ברשימה הנוכחית?
      const remainingReviewsResult = await supabaseAdmin
        .from('user_words')
        .select('word_id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('word_id', currentListStart)
        .lte('word_id', currentListEnd);
      
      const hasRemainingReviews = remainingReviewsResult.count > 0;
      
      if (!hasRemainingReviews) {
        finalPracticeCounter = 0
      }
    }

    // עדכון user_preferences
    const userUpdateResult = await supabaseAdmin
      .from('user_preferences')
      .update({
        last_position: updatedLastPosition,
        practice_counter: finalPracticeCounter
      })
      .eq('user_id', userId);

    if (userUpdateResult.error) {
      throw userUpdateResult.error;
    }

    // בדיקה אם צריך לאפס את ה-counter (הגענו לסף)
    const needsPractice = finalPracticeCounter >= effectiveThreshold;
    
    if (needsPractice) {
      await supabaseAdmin
        .from('user_preferences')
        .update({ practice_counter: 0 })
        .eq('user_id', userId);
    }

    return {
      success: true,
      action: level === 1 ? 'deleted' : (existingWord ? 'updated' : 'created'),
      newPracticeCounter: finalPracticeCounter,
      practiceThreshold,
      atListEnd: isLevelComplete,
      needsPractice
    };

  } catch (error) {
    console.error('Error in updateCurrentWordRating:', error);
    return { success: false, error: error.message };
  }
}