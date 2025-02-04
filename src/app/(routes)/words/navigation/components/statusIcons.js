// components/StatusIcons.js
'use client'
import { CircleDot, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import Tooltip from '@/components/features/Tooltip';
import { useContext } from 'react';
import { ColorContext } from './colorContext';
import { WordContext } from '../../page';
import IconData from '@/lib/data/ColorMap';
import { useWordNavigation } from '../hooks/useWordNavigation';
import NavigationMessage from './navigationMessage'

const StatusIcons = () => {
  const { setSelectedColor } = useContext(ColorContext);
  const wordData = useContext(WordContext);
  
  const {
    error,
    isLoading,
    handleWordRating,
    navigateToPrevWord,
    navigationState,
    handleNextCategory
  } = useWordNavigation({ wordData, setSelectedColor });

  return (
    <div className="flex flex-col gap-2 border-t p-4">
      <div className="flex gap-4 justify-between items-center">
        {/* כפתור חזרה */}
        <button
          onClick={navigateToPrevWord}
          disabled={isLoading}
          className={`p-2 rounded hover:bg-gray-100 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ArrowRight className="w-6 h-6 text-blue-900/80" />
        </button>

        {/* כפתורי הדירוג */}
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
                onClick={() => handleWordRating(icon.color, icon.level)}
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

      <NavigationMessage 
        navigationState={navigationState}
        onNextCategory={handleNextCategory}
      />

      {error && (
        <div className="text-red-500 text-sm mt-2 text-right">
          {error}
        </div>
      )}
    </div>
  );
};

export default StatusIcons;