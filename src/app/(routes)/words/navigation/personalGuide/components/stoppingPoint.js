'use client'
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getNextWord } from '../../actions/getNextWord'
import GradientCat from './GradientCat'

const StoppingPoint = () => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [hasLastPosition, setHasLastPosition] = useState(false) // שינוי מ-null ל-false
  const [isCheckingPosition, setIsCheckingPosition] = useState(true) // מצב בדיקה
  const [retryCount, setRetryCount] = useState(0)

  // בדיקת last_position של המשתמש
  useEffect(() => {
    const checkLastPosition = async () => {
      if (status === 'loading' || !session?.user?.id) {
        return
      }

      try {
        console.log(`Attempt ${retryCount + 1}: Calling getNextWord`)
        const nextWord = await getNextWord(session.user.id)
        console.log('getNextWord result:', nextWord)
        
        // עכשיו getNextWord תמיד מחזיר lastPosition
        const result = nextWord.lastPosition !== null && nextWord.lastPosition !== undefined
        setHasLastPosition(result)
        setIsCheckingPosition(false) // סיום הבדיקה
        
        // אם קיבלנו false בפעם הראשונה, ננסה שוב אחרי 2 שניות
        if (!result && retryCount < 3) {
          console.log('Got false, will retry in 2 seconds...')
          setIsCheckingPosition(true) // חזרה למצב בדיקה
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000)
        }
      } catch (error) {
        console.error('Error checking last position:', error)
        setHasLastPosition(false)
        setIsCheckingPosition(false) // סיום הבדיקה גם במקרה של שגיאה
        
        // גם במקרה של שגיאה, ננסה שוב
        if (retryCount < 3) {
          setIsCheckingPosition(true)
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000)
        }
      }
    }

    checkLastPosition()
  }, [session?.user?.id, status, retryCount])

  const handleCatClick = async () => {
    if (!session?.user?.id || isLoading) return
         
    try {
      setIsLoading(true)
      const nextWord = await getNextWord(session.user.id)

      if (nextWord.status === 'PRACTICE_NEEDED') {
        router.push('/practiceSpace')
      } else if (nextWord.found) {
        router.push(`/words?index=${nextWord.index}&category=${nextWord.category}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const shouldShowCat = session && 
                        !isCheckingPosition && // לא להציג כשעדיין בודקים
                        hasLastPosition === true && 
                        pathname !== '/words' &&
                        pathname !== '/practiceSpace'

  // הוספת לוגים לדיבוג
  console.log('StoppingPoint Debug:', {
    session: !!session,
    isCheckingPosition,
    hasLastPosition,
    pathname,
    shouldShowCat,
    nextWordResult: 'will be logged in useEffect'
  })

  return (
    <div>
      {shouldShowCat && (
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={handleCatClick}
            disabled={isLoading}
            className={`${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="relative">
              <div>
                <GradientCat
                  isAnimated={true}
                  className="transition-transform duration-200 hover:scale-110"
                />
              </div>
              
              <div className="absolute bg-white border border-gray-200 rounded-md p-2 shadow-lg -right-2 bottom-full mb-1 text-sm text-gray-700 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300">
                חזרה לרצף הלמידה
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default StoppingPoint