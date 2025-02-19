'use client'

import { useState, useContext  } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ColorContext } from '../components/colorContext'
import { updateInfo } from '../actions/updateInfo'
import { getNextWord } from '../actions/getNextWord'
import { getStartingIndexForCategory } from '../helpers/reviewHelperFunctions'

export function useWordRating({ word, index, category, inf  }) {
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
    currentCategory: null
  })

  const handleNextCategory = async () => {
    if (navigationState.nextCategory) {
      const startingIndex = getStartingIndexForCategory(navigationState.nextCategory)
      router.push(`/words?index=${startingIndex}&category=${navigationState.nextCategory}`)
      setNavigationState({ showMessage: false })
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

    try {
      setIsLoading(true)
      setError(null)

      // הפעלת אנימציית שינוי צבע
      await handleColorChange(level)

      const result = await updateInfo(
        session.user.id,
        index,
        level,
        category,
        word,
        inf
      )

      if (!result?.success) {
        throw new Error(result?.error || 'שגיאה בעדכון המילה')
      }

      const nextWord = await getNextWord(session.user.id)

      if (nextWord.error) {
        throw new Error(nextWord.error)
      }

      if (nextWord.status === 'PRACTICE_NEEDED') {
        // Store return position before redirecting to practice
        localStorage.setItem('practiceReturnPosition', nextWord.lastPosition.index)
        localStorage.setItem('practiceReturnCategory', nextWord.currentCategory)
        router.push('/practiceSpace')
      } else if (nextWord.found) {
        router.push(`/words?index=${nextWord.index}&category=${nextWord.category}`)
      } else if (nextWord.status === 'LIST_END' || nextWord.status === 'COMPLETE') {
        setNavigationState({
          showMessage: true,
          status: nextWord.status,
          message: nextWord.message,
          nextCategory: nextWord.nextCategory,
          currentCategory: nextWord.currentCategory
        })
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
    isAuthenticated: status === 'authenticated',
    isSessionLoading: status === 'loading'
  }
}