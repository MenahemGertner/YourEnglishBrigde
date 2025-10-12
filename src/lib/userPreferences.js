'use server'

import { supabaseAdmin } from '@/lib/db/supabase';

const CACHE_KEY = 'practice_threshold';
const DEFAULT_THRESHOLD = 25;

/**
 * קריאת סף התרגול מ-Supabase (ללא cache)
 * פונקציה זו תשמש בעיקר ב-server actions
 */
export async function getPracticeThreshold(userId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('practice_threshold')
      .eq('id', userId)
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
      .from('users')
      .update({ practice_threshold: value })
      .eq('id', userId);

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