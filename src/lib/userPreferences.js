'use server'

import { supabaseAdmin } from '@/lib/db/supabase';

const CACHE_KEY = 'practice_threshold';
const STORY_LEVEL_KEY = 'story_level';
const INFLECTION_VIEW_MODE_KEY = 'inflection_view_mode';
const DEFAULT_THRESHOLD = 25;
const DEFAULT_STORY_LEVEL = 3;
const DEFAULT_INFLECTION_VIEW_MODE = 'practice';

/**
 * קריאת סף התרגול מ-Supabase (ללא cache)
 * פונקציה זו תשמש בעיקר ב-server actions
 */
export async function getPracticeThreshold(userId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .select('practice_threshold')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching practice threshold:', error);
      return DEFAULT_THRESHOLD;
    }

    return data?.practice_threshold || DEFAULT_THRESHOLD;
  } catch (error) {
    console.error('Error in getPracticeThreshold:', error);
    return DEFAULT_THRESHOLD;
  }
}

/**
 * עדכון סף התרגול ב-Supabase
 */
export async function updatePracticeThreshold(userId, value) {
  try {
    // ולידציה
    if (![15, 25, 40].includes(value)) {
      return { success: false, error: 'ערך לא תקין. בחר 15, 25 או 40' };
    }

    const { error } = await supabaseAdmin
      .from('user_preferences')
      .update({ practice_threshold: value })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating practice threshold:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updatePracticeThreshold:', error);
    return { success: false, error: 'שגיאה בעדכון ההגדרות' };
  }
}

/**
 * קריאת רמת הסיפור המועדפת
 * תחילה בודק ב-localStorage, אם אין - מביא מהשרת
 */
export async function getStoryLevel(userId) {
  try {
    // בדיקה ב-localStorage (זמין רק בצד הלקוח)
    if (typeof window !== 'undefined') {
      const cachedLevel = localStorage.getItem(`${STORY_LEVEL_KEY}_${userId}`);
      if (cachedLevel !== null) {
        const level = parseInt(cachedLevel);
        if (level >= 1 && level <= 5) {
          return level;
        }
      }
    }

    // אם אין ב-localStorage או שאנחנו בשרת, מביאים מהמסד
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .select('story_level')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching story level:', error);
      return DEFAULT_STORY_LEVEL;
    }

    const level = data?.story_level || DEFAULT_STORY_LEVEL;

    // שמירה ב-localStorage לפעם הבאה
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORY_LEVEL_KEY}_${userId}`, level.toString());
    }

    return level;
  } catch (error) {
    console.error('Error in getStoryLevel:', error);
    return DEFAULT_STORY_LEVEL;
  }
}

/**
 * עדכון רמת הסיפור המועדפת
 * מעדכן גם במסד הנתונים וגם ב-localStorage
 */
export async function updateStoryLevel(userId, level) {
  try {
    // ולידציה
    if (![1, 2, 3, 4, 5].includes(level)) {
      return { success: false, error: 'ערך לא תקין. בחר רמה בין 1 ל-5' };
    }

    // עדכון במסד הנתונים
    const { error } = await supabaseAdmin
      .from('user_preferences')
      .update({ story_level: level })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating story level:', error);
      return { success: false, error: error.message };
    }

    // עדכון ב-localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORY_LEVEL_KEY}_${userId}`, level.toString());
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateStoryLevel:', error);
    return { success: false, error: 'שגיאה בעדכון ההגדרות' };
  }
}

/**
 * קריאת מצב התצוגה המועדף להטיות
 * תחילה בודק ב-localStorage, אם אין - מביא מהשרת
 */
export async function getInflectionViewMode(userId) {
  try {
    // בדיקה ב-localStorage (זמין רק בצד הלקוח)
    if (typeof window !== 'undefined') {
      const cachedMode = localStorage.getItem(`${INFLECTION_VIEW_MODE_KEY}_${userId}`);
      if (cachedMode !== null) {
        if (['practice', 'default'].includes(cachedMode)) {
          return cachedMode;
        }
      }
    }

    // אם אין ב-localStorage או שאנחנו בשרת, מביאים מהמסד
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .select('inflection_view_mode')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching inflection view mode:', error);
      return DEFAULT_INFLECTION_VIEW_MODE;
    }

    const mode = data?.inflection_view_mode || DEFAULT_INFLECTION_VIEW_MODE;

    // שמירה ב-localStorage לפעם הבאה
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${INFLECTION_VIEW_MODE_KEY}_${userId}`, mode);
    }

    return mode;
  } catch (error) {
    console.error('Error in getInflectionViewMode:', error);
    return DEFAULT_INFLECTION_VIEW_MODE;
  }
}

/**
 * עדכון מצב התצוגה המועדף להטיות
 * מעדכן גם במסד הנתונים וגם ב-localStorage
 */
export async function updateInflectionViewMode(userId, mode) {
  try {
    // ולידציה
    if (!['practice', 'default'].includes(mode)) {
      return { success: false, error: 'ערך לא תקין. בחר practice או default' };
    }

    // עדכון במסד הנתונים
    const { error } = await supabaseAdmin
      .from('user_preferences')
      .update({ inflection_view_mode: mode })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating inflection view mode:', error);
      return { success: false, error: error.message };
    }

    // עדכון ב-localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${INFLECTION_VIEW_MODE_KEY}_${userId}`, mode);
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateInflectionViewMode:', error);
    return { success: false, error: 'שגיאה בעדכון ההגדרות' };
  }
}