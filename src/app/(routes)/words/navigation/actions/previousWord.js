'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/db/supabase'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getPreviousWord(userId, currentIndex) {
  if (!userId) throw new Error('User ID is required')
  
  // קבלת מידע על הסשן מהשרת
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken || !session?.user?.id) {
    throw new Error('Authentication required')
  }
  
  // וידוא שהמשתמש מנסה לגשת למידע שלו בלבד
  if (session.user.id !== userId) {
    throw new Error('Unauthorized access')
  }
  
  // יצירת לקוח Supabase עם הטוקן של המשתמש
  // הטוקן כבר אמור להיות מחודש אוטומטית על ידי NextAuth
  const supabaseClient = createServerClient(session.accessToken)

  const { data: userData, error: userError } = await supabaseClient
    .from('users')
    .select('last_position')
    .eq('id', userId)
    .single()

  if (userError) throw userError
  if (!userData?.last_position) throw new Error('No previous position found')

  const { index, category } = userData.last_position

  if (String(currentIndex) === String(index)) {
    return { message: 'ניתן לחזור לאחור, מילה אחת בלבד!' }
  }

  redirect(`/words?index=${index}&category=${category}`)
}