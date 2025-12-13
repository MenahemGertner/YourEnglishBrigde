'use client'

import { useState, useContext, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ColorContext } from '../components/colorContext'
import { prefetchNextWord } from '../actions/prefetchNextWord'
import { updateCurrentWordRating } from '../actions/updateCurrentWordRating'
import { updateWordAndGetNext } from '../actions/updateWordAndGetNext'
import { getStartingIndexForCategory } from '../helpers/reviewHelperFunctions'

const STORAGE_KEY = 'practiceProgress'

export function useWordRating({ index, category }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { handleColorChange } = useContext(ColorContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [navigationState, setNavigationState] = useState({
    showMessage: false,
    status: null,
    message: '',
    nextCategory: null,
    currentCategory: null,
    isLoadingPractice: false
  })

  // State לשמירת המילה ה-prefetched
  const [prefetchedWord, setPrefetchedWord] = useState(null)
  
  // Ref למניעת prefetch כפול
  const prefetchInProgress = useRef(false)
  
  // Ref למניעת prefetch מיד אחרי חזרה מתרגול
  const justReturnedFromPractice = useRef(false)

  // טעינת הנתונים מ-localStorage בטעינה ראשונית
  const [practiceProgress, setPracticeProgress] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (err) {
        console.error('Error loading practiceProgress from localStorage:', err)
      }
    }
    return { counter: 0, threshold: 25 }
  })

  // שמירת הנתונים ב-localStorage כל פעם שהם משתנים
  useEffect(() => {
    if (typeof window !== 'undefined' && practiceProgress) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(practiceProgress))
      } catch (err) {
        console.error('Error saving practiceProgress to localStorage:', err)
      }
    }
  }, [practiceProgress])

  // Pre-fetch המילה הבאה כשמילה חדשה נטענת
  useEffect(() => {
    // בדיקה: האם חזרנו זה עתה מתרגול?
    if (typeof window !== 'undefined') {
      const returnedFromPractice = localStorage.getItem('practiceReturnPosition')
      if (returnedFromPractice && parseInt(returnedFromPractice) === index) {
        justReturnedFromPractice.current = true
        // לא מוחקים עדיין - רק מסמנים
        return
      }
    }
    
    // אם זה הדירוג הראשון אחרי חזרה מתרגול
    if (justReturnedFromPractice.current) {
      justReturnedFromPractice.current = false
      // עכשיו כן נמחק את ה-flag
      if (typeof window !== 'undefined') {
        localStorage.removeItem('practiceReturnPosition')
      }
      return
    }
    
    const doPrefetch = async () => {
      // תנאים למניעת prefetch מיותר
      if (!session?.user?.id || !index || !category) return
      if (prefetchInProgress.current) return
      if (navigationState.showMessage) return

      try {
        prefetchInProgress.current = true

        const result = await prefetchNextWord(
          session.user.id,
          index,
          category
        )

        if (result.success && result.nextWord) {
          setPrefetchedWord(result.nextWord)
        } else {
          setPrefetchedWord(null)
        }

      } catch (err) {
        console.error('Prefetch error:', err)
        setPrefetchedWord(null)
      } finally {
        prefetchInProgress.current = false
      }
    }

    const timeoutId = setTimeout(doPrefetch, 50)
    return () => clearTimeout(timeoutId)
  }, [index, category, session?.user?.id, navigationState.showMessage])

  const handleNextCategory = async () => {
    if (navigationState.nextCategory) {
      const startingIndex = getStartingIndexForCategory(navigationState.nextCategory)
      router.push(`/words?index=${startingIndex}&category=${navigationState.nextCategory}`)
      setNavigationState({ 
        showMessage: false,
        status: null,
        message: '',
        nextCategory: null,
        currentCategory: null,
        isLoadingPractice: false
      })
    }
  }

  const handleWordRating = async (level) => {
    if (!session?.user?.id) {
      setError('נא להתחבר כדי להמשיך')
      return
    }

    if (!index || !category) {
      setError('חסר מזהה מילה')
      return
    }

    // מניעת לחיצות כפולות
    if (isLoading || navigationState.isLoadingPractice) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // הפעלת אנימציית צבע במקביל
      const colorPromise = handleColorChange(level)

      // בדיקה: האם יש לנו prefetch מוכן?
      const hasPrefetch = prefetchedWord && (
        prefetchedWord.found || 
        prefetchedWord.status === 'LIST_END' || 
        prefetchedWord.status === 'COMPLETE'
      )

      if (hasPrefetch) {
        // עדכון + אנימציה במקביל
        const [updateResult] = await Promise.all([
          updateCurrentWordRating(session.user.id, index, level, category),
          colorPromise
        ])

        if (!updateResult?.success) {
          throw new Error(updateResult?.error || 'שגיאה בעדכון המילה')
        }

        // עדכון practiceProgress
        if (updateResult.newPracticeCounter !== undefined && updateResult.practiceThreshold) {
          setPracticeProgress({
            counter: updateResult.newPracticeCounter,
            threshold: updateResult.practiceThreshold
          })

          // בדיקה: האם צריך לעבור לתרגול?
          if (updateResult.needsPractice) {
            // אפס progress
            const resetProgress = { counter: 0, threshold: updateResult.practiceThreshold }
            setPracticeProgress(resetProgress)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resetProgress))
            
            setNavigationState({
              showMessage: false,
              status: 'LOADING_PRACTICE',
              message: 'ממשיכים לתרגול...',
              isLoadingPractice: true,
              nextCategory: null,
              currentCategory: null
            })
            
            localStorage.setItem('practiceReturnPosition', index)
            localStorage.setItem('practiceReturnCategory', category)
            setPrefetchedWord(null)
            prefetchInProgress.current = false
            justReturnedFromPractice.current = false
            
            router.push('/practiceSpace')
            return
          }
          
          // בדיקה חלופית (backup) - במקרה ש-needsPractice לא עבד
          const effectiveThreshold = updateResult.atListEnd ? 10 : updateResult.practiceThreshold
          
          if (updateResult.newPracticeCounter >= effectiveThreshold) {
            const resetProgress = { counter: 0, threshold: updateResult.practiceThreshold }
            setPracticeProgress(resetProgress)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resetProgress))
            
            setNavigationState({
              showMessage: false,
              status: 'LOADING_PRACTICE',
              message: 'ממשיכים לתרגול...',
              isLoadingPractice: true,
              nextCategory: null,
              currentCategory: null
            })
            
            localStorage.setItem('practiceReturnPosition', index)
            localStorage.setItem('practiceReturnCategory', category)
            setPrefetchedWord(null)
            prefetchInProgress.current = false
            justReturnedFromPractice.current = false
            
            router.push('/practiceSpace')
            return
          }
        }

        // ניקוי ה-prefetch לפני navigation
        setPrefetchedWord(null)
        prefetchInProgress.current = false

        // Navigate למילה ה-prefetched
        if (prefetchedWord.found) {
          router.push(`/words?index=${prefetchedWord.index}&category=${prefetchedWord.category}`)
        } else if (prefetchedWord.status === 'LIST_END' || prefetchedWord.status === 'COMPLETE') {
          setNavigationState({
            showMessage: true,
            status: prefetchedWord.status,
            message: prefetchedWord.message,
            nextCategory: prefetchedWord.nextCategory,
            currentCategory: prefetchedWord.currentCategory,
            isLoadingPractice: false
          })
        }
        
      } else {
        // FALLBACK: אין prefetch - חזרה לזרימה הרגילה
        const result = await updateWordAndGetNext(
          session.user.id,
          index,
          level,
          category
        )

        if (!result?.success) {
          throw new Error(result?.error || 'שגיאה בעדכון המילה')
        }

        if (result.practiceProgress) {
          setPracticeProgress(result.practiceProgress)
        }

        await colorPromise

        const nextWord = result.nextWord

        if (nextWord.status === 'PRACTICE_NEEDED') {
          const resetProgress = { counter: 0, threshold: result.practiceProgress?.threshold || 25 }
          setPracticeProgress(resetProgress)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resetProgress))
          
          setIsLoading(true)
          setNavigationState({
            showMessage: false,
            status: 'LOADING_PRACTICE',
            message: 'ממשיכים לתרגול...',
            isLoadingPractice: true,
            nextCategory: null,
            currentCategory: null
          })
          
          localStorage.setItem('practiceReturnPosition', nextWord.lastPosition.index)
          localStorage.setItem('practiceReturnCategory', nextWord.currentCategory)
          justReturnedFromPractice.current = false
          
          router.push('/practiceSpace')
        } else if (nextWord.found) {
          router.push(`/words?index=${nextWord.index}&category=${nextWord.category}`)
        } else if (nextWord.status === 'LIST_END' || nextWord.status === 'COMPLETE') {
          setNavigationState({
            showMessage: true,
            status: nextWord.status,
            message: nextWord.message,
            nextCategory: nextWord.nextCategory,
            currentCategory: nextWord.currentCategory,
            isLoadingPractice: false
          })
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'שגיאה לא ידועה'
      console.error('Error updating word:', errorMessage, err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    handleWordRating,
    navigationState,
    handleNextCategory,
    practiceProgress,
    isAuthenticated: status === 'authenticated',
    isSessionLoading: status === 'loading'
  }
}