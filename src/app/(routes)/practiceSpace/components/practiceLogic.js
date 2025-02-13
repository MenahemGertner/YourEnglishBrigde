'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getNextWord } from '@/app/(routes)/words/navigation/actions/getNextWord'  // ייבוא ישיר של ה-server action

const PracticeLogic = ({ children }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [showResult, setShowResult] = useState(false)

  const handleComplete = () => {
    setShowResult(true)
  }

  const handleReturn = async () => {
    if (!session?.user?.id) {
      router.push('/words')
      return
    }

    try {
      // קריאה ישירה ל-server action
      const nextWord = await getNextWord(session.user.id)

      if (nextWord.error) {
        throw new Error(nextWord.error)
      }

      if (nextWord.found) {
        router.push(`/words?index=${nextWord.index}&category=${nextWord.category}`)
      } else if (nextWord.status === 'LIST_END' || nextWord.status === 'COMPLETE') {
        router.push(`/words?status=${nextWord.status}&message=${encodeURIComponent(nextWord.message)}${nextWord.nextCategory ? `&nextCategory=${nextWord.nextCategory}` : ''}`)
      } else {
        router.push('/words')
      }
    } catch (error) {
      console.error('Error returning from practice:', error)
      router.push('/words')
    }
  }

  return children({ handleReturn, handleComplete, showResult })
}

export default PracticeLogic