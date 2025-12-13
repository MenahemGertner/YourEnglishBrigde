'use client'

import { CircleDot, Info, ArrowRight, Loader2 } from 'lucide-react'
import { usePreviousNavigation } from '../hooks/usePreviousNavigation'
import Tooltip from '@/components/features/Tooltip'
import IconData from '@/lib/data/ColorMap'
import NavigationMessage from './navigationMessage'

// StatusIcons.js
const StatusIcons = ({ 
  handleWordRating,
  isLoading,
  error,
  navigationState,
  handleNextCategory
}) => {
  const { handlePrevious, isPrevLoading, message } = usePreviousNavigation()
  
  // 🔒 חסימת כפתורים כאשר טוענים תרגול
  const isDisabled = isLoading || navigationState.isLoadingPractice
  
  return (
    <>
      {/* 🎨 הודעת טעינה לתרגול */}
      {navigationState.isLoadingPractice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-800">
              {navigationState.message || 'ממשיכים לתרגול...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2 p-2 sm:p-4">
        {error && (
          <div className="text-red-600 text-xs sm:text-sm text-center mb-2">
            {error}
          </div>
        )}
        {message && (
          <div className="text-blue-900 text-xs sm:text-sm text-center mb-2">
            {message}
          </div>
        )}
        <div className="flex gap-2 sm:gap-4 justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isPrevLoading || isDisabled}
            title="למילה האחרונה"
            className={`p-1 sm:p-2 duration-300 hover:scale-125 ${
              (isPrevLoading || isDisabled) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-blue-900/80" />
          </button>
          
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
            {IconData.map((icon) => (
              <div key={icon.level} className="flex flex-col items-center">
                <Tooltip content={icon.content}>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Info className="w-3 h-3 sm:w-5 sm:h-5 text-blue-900/80" />
                  </button>
                </Tooltip>
                                
                <button
                  disabled={isDisabled}
                  onClick={() => handleWordRating(icon.level)}
                  className={`
                    p-1 sm:p-2
                    rounded-full 
                    transition-all duration-300 ease-in-out
                    transform hover:scale-110 hover:shadow-lg
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'shadow-md'}
                  `}
                >
                  <div className="relative">
                    <CircleDot
                      className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 transition-transform duration-300 hover:rotate-12"
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