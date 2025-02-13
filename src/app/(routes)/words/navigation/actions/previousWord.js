'use server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function getPreviousWord(userId, currentIndex) {
  if (!userId) throw new Error('User ID is required')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('last_position')
    .eq('id', userId)
    .single()

  if (userError) throw userError
  if (!userData?.last_position) throw new Error('No previous position found')

  const { index, category } = userData.last_position

  // אם המשתמש כבר נמצא במילה הקודמת, מחזירים רק הודעה
  if (currentIndex === index) {
    return { message: 'ניתן לחזור לאחור, מילה אחת בלבד!' }
  }

  // רק אם המשתמש לא במילה הקודמת, מבצעים redirect
  redirect(`/words?index=${index}&category=${category}`)
}