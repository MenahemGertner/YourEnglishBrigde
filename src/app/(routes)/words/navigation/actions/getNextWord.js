'use server'

import { headers } from 'next/headers'
import { PRACTICE_THRESHOLD, categories } from '../helpers/reviewHelperFunctions'
import { supabaseAdmin } from '@/lib/db/supabase'
import { requireAuthAndOwnership } from '@/utils/auth-helpers'

export async function getNextWord(userId) {
  try {
    // אימות - כל הבדיקות בשורה אחת!
    await requireAuthAndOwnership(userId);

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('last_position, practice_counter')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // הגדרת lastPosition לשימוש בכל ההחזרות
    const lastPosition = userData.last_position

    // Check if practice threshold reached
    // בדיקת התרגול רק במצב פיתוח, דילוג עליה במצב ייצור
    if (process.env.NODE_ENV == 'development' && userData.practice_counter >= PRACTICE_THRESHOLD) {
      // Reset practice counter
      await supabaseAdmin
        .from('users')
        .update({ practice_counter: 0 })
        .eq('id', userId)

      return {
        found: false,
        status: 'PRACTICE_NEEDED',
        lastPosition: lastPosition,
        currentCategory: userData.current_category
      }
    }

    const learningSequencePointer = userData.last_position?.learning_sequence_pointer || 0
    const currentCategory = userData.last_position?.category || '300'

    // Try to find word with next_review <= learning_sequence_pointer
    const { data: wordsLTE, error: wordsLTEError } = await supabaseAdmin
      .from('user_words')
      .select('word_id, next_review')
      .eq('user_id', userId)
      .lte('next_review', learningSequencePointer)
      .order('next_review', { ascending: true })
      .limit(1)

    if (wordsLTEError) throw wordsLTEError

    if (wordsLTE && wordsLTE.length > 0) {
      const word = wordsLTE[0]
      return {
        found: true,
        index: word.word_id,
        category: currentCategory,
        lastPosition: lastPosition
      }
    }

    // Check if current index is divisible by 300 - if so, skip to review words
    if (learningSequencePointer % 300 !== 0) {
      // Try to find next new word
      const headersList = await headers()
      const domain = headersList.get('host')
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
      const nextIndex = learningSequencePointer + 1

      const response = await fetch(
        `${protocol}://${domain}/words/card/api/word?index=${nextIndex}&category=${currentCategory}`,
        { cache: 'no-store' }
      )

      if (response.ok) {
        const nextWord = await response.json()
        return {
          found: true,
          index: nextWord.index,
          category: nextWord.category,
          lastPosition: lastPosition
        }
      }
    }

    // Try to find word with next_review > learning_sequence_pointer
    const { data: wordsGT, error: wordsGTError } = await supabaseAdmin
      .from('user_words')
      .select('word_id, next_review')
      .eq('user_id', userId)
      .gt('next_review', learningSequencePointer)
      .order('next_review', { ascending: true })
      .limit(1)

    if (wordsGTError) throw wordsGTError

    if (wordsGT && wordsGT.length > 0) {
      const word = wordsGT[0]
      return {
        found: true,
        index: word.word_id,
        category: currentCategory,
        lastPosition: lastPosition
      }
    }

    // Check if there's a next category available
    const currentCategoryIndex = categories.indexOf(currentCategory)
    const nextCategory = categories[currentCategoryIndex + 1]

    if (nextCategory) {
      return {
        found: false,
        status: 'LIST_END',
        message: 'סיימת את כל המילים ברשימה הנוכחית',
        nextCategory,
        currentCategory,
        lastPosition: lastPosition
      }
    }

    // No more categories available
    return {
      found: false,
      status: 'COMPLETE',
      message: 'סיימת את כל הרשימות! כל הכבוד!',
      lastPosition: lastPosition
    }
  } catch (error) {
    console.error('Error in getNextWord:', error)
    return {
      found: false,
      error: error.message,
      lastPosition: null // במקרה של שגיאה, נחזיר null
    }
  }
}