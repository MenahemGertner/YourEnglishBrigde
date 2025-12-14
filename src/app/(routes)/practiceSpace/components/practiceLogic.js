'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getNextWord } from '@/app/(routes)/words/navigation/actions/getNextWord'

const PracticeLogic = ({ children }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [showResult, setShowResult] = useState(false)
  
  // שמירת המילה הבאה שנטענה מראש
  const prefetchedNextWord = useRef(null)
  const prefetchInProgress = useRef(false)

  // Pre-fetch המילה הבאה רק אחרי שהדף נטען לגמרי
  useEffect(() => {
    const doPrefetch = async () => {
      if (!session?.user?.id) return
      if (prefetchInProgress.current) return

      try {
        prefetchInProgress.current = true
        
        const nextWord = await getNextWord(session.user.id)
        
        if (!nextWord.error && nextWord.found) {
          prefetchedNextWord.current = nextWord
        }
      } catch (error) {
        console.error('Prefetch error:', error)
        prefetchedNextWord.current = null
      } finally {
        prefetchInProgress.current = false
      }
    }

    // המתנה לטעינת הדף + קצת delay נוסף לוודא שהכל נטען
    // requestIdleCallback מבטיח שזה רץ רק כשהדפדפן פנוי
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        doPrefetch()
      }, { timeout: 2000 }) // מקסימום 2 שניות המתנה
      
      return () => window.cancelIdleCallback(idleCallback)
    } else {
      // Fallback לדפדפנים ישנים - סתם delay ארוך
      const timeoutId = setTimeout(doPrefetch, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [session?.user?.id])

  const handleComplete = () => {
    setShowResult(true)
  }

  const handleReturn = async () => {
    if (!session?.user?.id) {
      router.push('/words')
      return
    }

    try {
      let nextWord = prefetchedNextWord.current

      // אם אין prefetch או שהוא נכשל, נשתמש בזרימה הרגילה
      if (!nextWord) {
        nextWord = await getNextWord(session.user.id)
      }

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