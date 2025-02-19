'use client'
import { CircleDot, Info, ArrowRight } from 'lucide-react'
import { useWordRating } from '../hooks/useWordRating'
import { usePreviousNavigation } from '../hooks/usePreviousNavigation'
import Tooltip from '@/components/features/Tooltip'
import IconData from '@/lib/data/ColorMap'
import NavigationMessage from './navigationMessage'

const StatusIcons = ({ word, index, category, inf }) => {
  const { 
    handleWordRating, 
    isLoading, 
    error,
    navigationState,
    handleNextCategory
  } = useWordRating({ word, index, category, inf  })

  const { handlePrevious, isPrevLoading, message } = usePreviousNavigation()

  return (
    <>
      <div className="flex flex-col gap-2 border-t p-4">
        {error && (
          <div className="text-red-600 text-sm text-center mb-2">
            {error}
          </div>
        )}
        {message && (
          <div className="text-blue-900 text-sm text-center mb-2">
            {message}
          </div>
        )}
        <div className="flex gap-4 justify-between items-center">
        <button
  onClick={handlePrevious}
  disabled={isPrevLoading}
  title="למילה האחרונה"
  className={`p-2 duration-300 hover:scale-125 ${
    isPrevLoading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  <ArrowRight className="w-6 h-6 text-blue-900/80" />
</button>

          <div className="flex gap-4">
            {IconData.map((icon) => (
              <div key={icon.level} className="flex flex-col items-center">
                <Tooltip content={icon.content}>
                  <button className="p-1 hover:bg-gray-100 rounded ">
                    <Info className="w-5 h-5 text-blue-900/80" />
                  </button>
                </Tooltip>
                
                <button
  disabled={isLoading}
  onClick={() => handleWordRating(icon.level)}
  className={`
    p-2 
    rounded-full 
    transition-all duration-300 ease-in-out
    transform hover:scale-110 hover:shadow-lg
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500
    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-md'}
  `}
>
  <div className="relative">
    <CircleDot
      className="w-14 h-14 transition-transform duration-300 hover:rotate-12"
      style={{ color: icon.color }}
    />
    <div 
      className="absolute inset-0 rounded-full opacity-0 hover:opacity-20"
      style={{ backgroundColor: icon.color, transition: 'opacity 0.3s' }}
    />
  </div>
</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NavigationMessage
        navigationState={navigationState}
        onNextCategory={handleNextCategory}
      />
    </>
  )
}

export default StatusIcons