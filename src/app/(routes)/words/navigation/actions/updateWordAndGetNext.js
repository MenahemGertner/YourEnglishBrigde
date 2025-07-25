'use server'

import { intervals, PRACTICE_THRESHOLD, categories } from '../helpers/reviewHelperFunctions';
import { createServerClient } from '@/lib/db/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getWordByIndex } from '@/lib/db/getWordByIndex';


export async function updateWordAndGetNext(userId, wordId, level, category) {
  try {
    if (!userId) throw new Error('נדרש מזהה משתמש');
    if (!wordId || !category) throw new Error('נדרש מזהה מילה וקטגוריה');
    if (!level || !Number.isInteger(level) || level < 1 || level > 4) {
      throw new Error('רמת קושי לא תקינה');
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken || !session?.user?.id) {
      throw new Error('נדרש אימות');
    }
    
    if (session.user.id !== userId) {
      throw new Error('גישה לא מורשית');
    }
    
    const supabaseClient = createServerClient(session.accessToken);

    // **שלב 1: קבלת נתונים במקביל**
    const existingWordPromise = supabaseClient
      .from('user_words')
      .select('*')
      .match({ user_id: userId, word_id: wordId })
      .single();

    const userDataPromise = supabaseClient
      .from('users')
      .select('practice_counter, last_position')
      .eq('id', userId)
      .single();

    // המתנה לשני הפרומיסים
    const existingWordResult = await existingWordPromise;
    const userDataResult = await userDataPromise;

    // טיפול בשגיאות
    if (existingWordResult.error && existingWordResult.error.code !== 'PGRST116') {
      throw existingWordResult.error;
    }
    if (userDataResult.error) {
      throw userDataResult.error;
    }

    const existingWord = existingWordResult.data;
    const userData = userDataResult.data;

    // **שלב 2: חישוב נתונים חדשים**
    const newPracticeCounter = (userData.practice_counter || 0) + (level === 1 ? 0 : level);
    const learningSequencePointer = userData.last_position?.learning_sequence_pointer || 0;
    
    const updatedLastPosition = {
      index: wordId,
      category,
      learning_sequence_pointer: userData.last_position?.learning_sequence_pointer || 0
    };

    if (wordId - 1 === learningSequencePointer || userData.last_position === null) {
      updatedLastPosition.learning_sequence_pointer = wordId;
    }

    // **שלב 3: עדכון המילה**
    let wordUpdateResult;
    
    if (level === 1) {
      // מחיקת המילה
      if (existingWord) {
        wordUpdateResult = await supabaseClient
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
        wordUpdateResult = await supabaseClient
          .from('user_words')
          .update({
            level,
            next_review: nextReview
          })
          .match({ user_id: userId, word_id: wordId });
      } else {
        wordUpdateResult = await supabaseClient
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

    // **שלב 4: עדכון נתוני המשתמש וחיפוש המילה הבאה במקביל**
    const userUpdatePromise = supabaseClient
      .from('users')
      .update({
        last_position: updatedLastPosition,
        practice_counter: newPracticeCounter
      })
      .eq('id', userId);

    const nextWordPromise = findNextWord(
      supabaseClient, 
      userId, 
      updatedLastPosition.learning_sequence_pointer,
      category
    );

    // ביצוע שני הפרומיסים במקביל
    const userUpdateResult = await userUpdatePromise;
    const nextWordResult = await nextWordPromise;

    // בדיקת שגיאות
    if (userUpdateResult.error) {
      throw userUpdateResult.error;
    }

    // בדיקת סף התרגול
    if (newPracticeCounter >= PRACTICE_THRESHOLD) {
      await supabaseClient
        .from('users')
        .update({ practice_counter: 0 })
        .eq('id', userId);

      return {
        success: true,
        action: level === 1 ? 'deleted' : (existingWord ? 'updated' : 'created'),
        nextWord: {
          found: false,
          status: 'PRACTICE_NEEDED',
          lastPosition: updatedLastPosition
        }
      };
    }

    return {
      success: true,
      action: level === 1 ? 'deleted' : (existingWord ? 'updated' : 'created'),
      nextWord: nextWordResult
    };

  } catch (error) {
    console.error('Error in updateWordAndGetNext:', error);
    return { success: false, error: error.message };
  }
}

// **פונקציה עזר לחיפוש המילה הבאה**
async function findNextWord(supabaseClient, userId, learningSequencePointer, currentCategory) {
  try {
    // חיפוש מילים לחזרה - בעדיפות גבוהה
    const reviewWordsResult = await supabaseClient
      .from('user_words')
      .select('word_id, next_review')
      .eq('user_id', userId)
      .lte('next_review', learningSequencePointer)
      .order('next_review', { ascending: true })
      .limit(1);

    if (reviewWordsResult.error) {
      throw reviewWordsResult.error;
    }

    if (reviewWordsResult.data && reviewWordsResult.data.length > 0) {
      return {
        found: true,
        index: reviewWordsResult.data[0].word_id,
        category: currentCategory,
        source: 'review'
      };
    }

    // אם הגענו לקצה של 300 מילים, עבור למילים לחזרה
    if (learningSequencePointer % 300 !== 0) {
      // נסה למצוא מילה חדשה
try {
  const nextIndex = learningSequencePointer + 1;
  const nextWord = await getWordByIndex(nextIndex);

  if (nextWord) {
    return {
      found: true,
      index: nextWord.index,
      category: nextWord.category,
      source: 'new'
    };
  }
} catch (fetchError) {
  console.warn('Failed to get next word directly:', fetchError);
}

    }

    // חיפוש מילים מתקדמות לחזרה
    const futureWordsResult = await supabaseClient
      .from('user_words')
      .select('word_id, next_review')
      .eq('user_id', userId)
      .gt('next_review', learningSequencePointer)
      .order('next_review', { ascending: true })
      .limit(1);

    if (futureWordsResult.error) {
      throw futureWordsResult.error;
    }

    if (futureWordsResult.data && futureWordsResult.data.length > 0) {
      return {
        found: true,
        index: futureWordsResult.data[0].word_id,
        category: currentCategory,
        source: 'future'
      };
    }

    // בדיקת קטגוריה הבאה
    const currentCategoryIndex = categories.indexOf(currentCategory);
    const nextCategory = categories[currentCategoryIndex + 1];

    if (nextCategory) {
      return {
        found: false,
        status: 'LIST_END',
        message: 'סיימת את כל המילים ברשימה הנוכחית',
        nextCategory,
        currentCategory
      };
    }

    return {
      found: false,
      status: 'COMPLETE',
      message: 'סיימת את כל הרשימות! כל הכבוד!'
    };

  } catch (error) {
    console.error('Error in findNextWord:', error);
    throw new Error(`Failed to find next word: ${error.message}`);
  }
}