import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { getPreviousWord } from '../actions/previousWord'

export const usePreviousNavigation = () => {
  const { data: session } = useSession()
  const [isPrevLoading, setIsPrevLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePrevious = async () => {
    if (!session?.user?.id) return
    try {
      setIsPrevLoading(true)
      const currentIndex = new URLSearchParams(window.location.search).get('index')
      const result = await getPreviousWord(session.user.id, currentIndex)
      
      if (result?.message) {
        setMessage(result.message)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setIsPrevLoading(false)
    }
  }

  return { 
    handlePrevious, 
    isPrevLoading, 
    message 
  }
}