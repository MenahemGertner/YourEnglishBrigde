'use server'

import { supabaseAdmin } from '@/lib/db/supabase';
import { requireAuthAndOwnership } from '@/utils/auth-helpers';
import { categories } from '../helpers/reviewHelperFunctions';

/**
 * Pre-fetch המילה הבאה - ללא עדכון DB
 * מחזיר את word_id הבא + מידע על הסטטוס (תרגול/רשימה חדשה וכו')
 * 
 * ⚠️ חשוב: פונקציה זו לא מנסה לחזות את הדירוג של המשתמש!
 * היא רק מחזירה מה תהיה המילה הבאה ברצף הנוכחי
 * 
 * @param {string} userId - מזהה המשתמש
 * @param {number} currentWordId - המילה הנוכחית (נדלג עליה!)
 * @param {string} currentCategory - הקטגוריה הנוכחית
 */
export async function prefetchNextWord(userId, currentWordId, currentCategory) {
  try {
    // בדיקות בסיסיות
    if (!currentWordId || !currentCategory) {
      throw new Error('נדרש מזהה מילה וקטגוריה');
    }

    // אימות
    await requireAuthAndOwnership(userId);

    // שליפת נתונים - רק מה שצריך לחישוב המילה הבאה
    const userDataResult = await supabaseAdmin
      .from('user_preferences')
      .select('last_position')
      .eq('user_id', userId)
      .single();

    if (userDataResult.error) {
      throw userDataResult.error;
    }

    const userData = userDataResult.data;
    
    // חישוב ה-pointer הבא - אחרי המילה הנוכחית
    const currentPointer = userData.last_position?.learning_sequence_pointer || 0;
    
    const nextPointer = (currentWordId - 1 === currentPointer || userData.last_position === null) 
      ? currentWordId 
      : currentPointer;

    // חיפוש המילה הבאה (ללא עדכון DB!)
    const nextWord = await findNextWordReadOnly(
      userId, 
      nextPointer,
      currentCategory,
      currentWordId // סינון המילה הנוכחית!
    );

    return {
      success: true,
      nextWord
    };

  } catch (error) {
    console.error('Error in prefetchNextWord:', error);
    return { 
      success: false, 
      error: error.message,
      nextWord: null
    };
  }
}

/**
 * מוצא את המילה הבאה - קריאה בלבד, ללא שינוי DB
 * לוגיקה זהה ל-findNextWord המקורי אבל ללא side effects
 * 
 * @param {string} userId - מזהה המשתמש
 * @param {number} learningSequencePointer - ה-pointer הנוכחי
 * @param {string} currentCategory - הקטגוריה הנוכחית
 * @param {number} excludeWordId - מילה לא לכלול בתוצאות (המילה הנוכחית)
 */
async function findNextWordReadOnly(userId, learningSequencePointer, currentCategory, excludeWordId = null) {
  try {
    // 1. חיפוש מילים לחזרה - בעדיפות גבוהה
    const reviewWordsResult = await supabaseAdmin
      .from('user_words')
      .select('word_id, next_review')
      .eq('user_id', userId)
      .lte('next_review', learningSequencePointer)
      .order('next_review', { ascending: true })
      .limit(5); // 🔑 נביא כמה מילים כדי לסנן את הנוכחית

    if (reviewWordsResult.error) {
      throw reviewWordsResult.error;
    }

    if (reviewWordsResult.data && reviewWordsResult.data.length > 0) {
      // 🔍 סינון המילה הנוכחית
      const filteredWords = excludeWordId 
        ? reviewWordsResult.data.filter(w => w.word_id !== excludeWordId)
        : reviewWordsResult.data;

      if (filteredWords.length > 0) {
        return {
          found: true,
          index: filteredWords[0].word_id,
          category: currentCategory,
          source: 'review'
        };
      }
    }

    // 2. אם לא הגענו לקצה של 300 מילים - נציג מילה חדשה
    if (learningSequencePointer % 300 !== 0) {
      const nextIndex = learningSequencePointer + 1;
      
      // פשוט נחזיר את האינדקס - הטעינה מ-MongoDB תקרה בדף עצמו
      return {
        found: true,
        index: nextIndex,
        category: currentCategory,
        source: 'new'
      };
    }

    // 3. חיפוש מילים מתקדמות לחזרה
    const futureWordsResult = await supabaseAdmin
      .from('user_words')
      .select('word_id, next_review')
      .eq('user_id', userId)
      .gt('next_review', learningSequencePointer)
      .order('next_review', { ascending: true })
      .limit(5); // 🔑 נביא כמה מילים כדי לסנן את הנוכחית

    if (futureWordsResult.error) {
      throw futureWordsResult.error;
    }

    if (futureWordsResult.data && futureWordsResult.data.length > 0) {
      // 🔍 סינון המילה הנוכחית
      const filteredWords = excludeWordId
        ? futureWordsResult.data.filter(w => w.word_id !== excludeWordId)
        : futureWordsResult.data;

      if (filteredWords.length > 0) {
        return {
          found: true,
          index: filteredWords[0].word_id,
          category: currentCategory,
          source: 'future'
        };
      }
    }

    // 4. בדיקת קטגוריה הבאה
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
    console.error('Error in findNextWordReadOnly:', error);
    throw new Error(`Failed to find next word: ${error.message}`);
  }
}