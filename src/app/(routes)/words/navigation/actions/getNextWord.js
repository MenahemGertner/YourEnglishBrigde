'use server'

import { headers } from 'next/headers'
import { PRACTICE_THRESHOLD, categories } from '../helpers/reviewHelperFunctions'
import { createServerClient } from '@/lib/db/supabase'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth';

export async function getNextWord(userId) {
  try {
    if (!userId) {
      throw new Error('נדרש מזהה משתמש')
    }

    // קבלת מידע על הסשן מהשרת
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.user?.id) {
      throw new Error('נדרש אימות')
    }
    
    // וידוא שהמשתמש מנסה לגשת למידע שלו בלבד
    if (session.user.id !== userId) {
      throw new Error('גישה לא מורשית')
    }
    
    // יצירת לקוח Supabase עם הטוקן של המשתמש
    const supabase = createServerClient(session.accessToken)

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('last_position, practice_counter')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Check if practice threshold reached
    // בדיקת התרגול רק במצב ייצור, דילוג עליה במצב פיתוח
if (process.env.NODE_ENV == 'development' && userData.practice_counter >= PRACTICE_THRESHOLD) {
  // Reset practice counter
  await supabase
    .from('users')
    .update({ practice_counter: 0 })
    .eq('id', userId)

  return {
    found: false,
    status: 'PRACTICE_NEEDED',
    lastPosition: userData.last_position,
    currentCategory: userData.current_category
  }
}

    const learningSequencePointer = userData.last_position?.learning_sequence_pointer || 0
    const currentCategory = userData.last_position?.category || '500'

    // Try to find word with next_review <= learning_sequence_pointer
    const { data: wordsLTE, error: wordsLTEError } = await supabase
      .from('user_words')
      .select('word_id, next_review, word_forms')
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
        category: word.word_forms?.category || currentCategory
      }
    }

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
        category: nextWord.category
      }
    }

    // Try to find word with next_review > learning_sequence_pointer
    const { data: wordsGT, error: wordsGTError } = await supabase
      .from('user_words')
      .select('word_id, next_review, word_forms')
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
        category: word.word_forms?.category || currentCategory
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
        currentCategory
      }
    }

    // No more categories available
    return {
      found: false,
      status: 'COMPLETE',
      message: 'סיימת את כל הרשימות! כל הכבוד!'
    }
  } catch (error) {
    console.error('Error in getNextWord:', error)
    return {
      found: false,
      error: error.message
    }
  }
}