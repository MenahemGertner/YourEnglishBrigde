'use client'
import { useSession } from "next-auth/react"
import { useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getNextWord } from '../../actions/getNextWord'
import GradientCat from './GradientCat'

const StoppingPoint = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Pre-fetch state
  const prefetchedNextWord = useRef(null)
  const prefetchInProgress = useRef(false)
  const hasCheckedPosition = useRef(false)

  // בדיקה אם להציג את החתול
  const shouldShowCat = session && 
                        pathname !== '/words' &&
                        pathname !== '/practiceSpace'

  // Pre-fetch על hover - רץ רק פעם אחת!
  const handleMouseEnter = async () => {
    // אם כבר עשינו prefetch - לא צריך שוב
    if (hasCheckedPosition.current || prefetchInProgress.current) return
    if (!session?.user?.id) return

    try {
      prefetchInProgress.current = true
      hasCheckedPosition.current = true
      
      const nextWord = await getNextWord(session.user.id)
      
      // שמירת התוצאה
      if (nextWord.lastPosition !== null && nextWord.lastPosition !== undefined) {
        prefetchedNextWord.current = nextWord
      }
    } catch (error) {
      console.error('Prefetch error:', error)
      prefetchedNextWord.current = null
    } finally {
      prefetchInProgress.current = false
    }
  }

  const handleCatClick = async () => {
    if (!session?.user?.id || isLoading) return
         
    try {
      setIsLoading(true)
      
      // אם יש prefetch - השתמש בו, אחרת טען עכשיו
      let nextWord = prefetchedNextWord.current
      
      if (!nextWord) {
        nextWord = await getNextWord(session.user.id)
      }

      if (nextWord.status === 'PRACTICE_NEEDED') {
        router.push('/practiceSpace')
      } else if (nextWord.found) {
        router.push(`/words?index=${nextWord.index}&category=${nextWord.category}`)
      }
    } catch (error) {
      console.error('Error in handleCatClick:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!shouldShowCat) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={handleCatClick}
        onMouseEnter={handleMouseEnter} // ← Pre-fetch על hover!
        disabled={isLoading}
        className={`${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div className="relative group">
          <div>
            <GradientCat
              isAnimated={true}
              className="transition-transform duration-200 hover:scale-110"
            />
          </div>
          
          <div className="absolute bg-white border border-gray-200 rounded-md p-2 shadow-lg -right-2 bottom-full mb-1 text-sm text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            חזרה לרצף הלמידה
          </div>
        </div>
      </button>
    </div>
  )
}

export default StoppingPoint