'use server'

import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/db/supabase'
import { requireAuthAndOwnership } from '@/utils/auth-helpers'

export async function getPreviousWord(userId, currentIndex) {
  // אימות - כל הבדיקות בשורה אחת!
  await requireAuthAndOwnership(userId);

  const { data: userData, error: userError } = await supabaseAdmin
    .from('user_preferences')
    .select('last_position')
    .eq('user_id', userId)
    .single()

  if (userError) throw userError
  if (!userData?.last_position) throw new Error('No previous position found')

  const { index } = userData.last_position

  if (String(currentIndex) === String(index)) {
    return { message: 'ניתן לחזור לאחור, מילה אחת בלבד!' }
  }

  redirect(`/words?index=${index}`)
}