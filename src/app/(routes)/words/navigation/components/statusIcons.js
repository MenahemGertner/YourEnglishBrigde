'use client'
import { CircleDot, Info, ArrowRight } from 'lucide-react'
import { useWordNavigation } from '../hooks/useWordNavigation'
import { useWordRating } from '../hooks/useWordRating'
import { usePreviousNavigation } from '../hooks/usePreviousNavigation'
import Tooltip from '@/components/features/Tooltip'
import IconData from '@/lib/data/ColorMap'
import NavigationMessage from './navigationMessage'

const StatusIcons = ({ wordData }) => {
  // const { isLoading, handleWordRating } = useWordNavigation({ wordData })
  const { 
    handleWordRating, 
    isLoading, 
    error,
    navigationState,
    handleNextCategory
  } = useWordRating({ wordData })

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
  title="למילה הקודמת"
  className={`p-2 rounded hover:bg-gray-100 ${
    isPrevLoading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  <ArrowRight className="w-6 h-6 text-blue-900/80" />
</button>

          <div className="flex gap-4">
            {IconData.map((icon) => (
              <div key={icon.level} className="flex flex-col items-center">
                <Tooltip content={icon.content}>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Info className="w-5 h-5 text-blue-900/80" />
                  </button>
                </Tooltip>
                
                <button
                  disabled={isLoading}
                  onClick={() => handleWordRating(icon.level)}
                  className={`p-2 rounded hover:opacity-70 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CircleDot
                    className="w-14 h-14"
                    style={{ color: icon.color }}
                  />
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