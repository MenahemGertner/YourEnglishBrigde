'use client'

import { Cat } from 'lucide-react'
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getNextWord } from '../../actions/getNextWord'

const StoppingPoint = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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

  const FloatingCat = () => {
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
      const tooltipInterval = setInterval(() => {
        setShowTooltip(true)
        setTimeout(() => {
          setShowTooltip(false)
        }, 2000)
      }, 3000)

      return () => clearInterval(tooltipInterval)
    }, [])

    if (!session || pathname === '/words' || pathname === '/practiceSpace' ||
         pathname === '/afterRegistration'|| pathname === '/startLearn' || pathname === '/checkYourLevel') {
      return null
    }

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={handleCatClick}
          disabled={isLoading}
          className={`${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <div className="relative">
            <div className="animate-bounce">
              <Cat 
                className="h-14 w-14 transition-colors duration-200 text-blue-900 hover:text-blue-700"
              />
            </div>
            
            <div className={`absolute bg-white border border-gray-200 rounded-md p-2 shadow-lg -right-2 bottom-full mb-1 text-sm text-gray-700 whitespace-nowrap transition-opacity duration-300 ${
              showTooltip ? 'opacity-100' : 'opacity-0'
            }`}>
              חזרה לרצף הלמידה
            </div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div>
      <FloatingCat />
    </div>
  )
}

export default StoppingPoint