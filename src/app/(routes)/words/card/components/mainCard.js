'use client'
import { useContext, useEffect, useState } from 'react';
import { WordContext } from '../../page.js';
import { ColorContext } from '../../navigation/components/colorContext';
import ConditionalRender from '@/components/features/ConditionalRender';
import Inflections from './inflections';
import MainWord from './mainWord';
import Sentences from './sentences';

const MainCard = () => {
  const wordData = useContext(WordContext);
  const { selectedColor, cardStyle } = useContext(ColorContext);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (selectedColor) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedColor]);

  if (!wordData) return <ConditionalRender/>;

  return (
    <div 
      className={`bg-gray-50 rounded-t-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
        w-80 min-w-[250px]
        md:w-96 lg:w-[450px]
        min-h-32 md:min-h-40 lg:min-h-48
        mx-2 sm:mx-auto
        transition-all duration-300 ease-in-out
        ${isAnimating ? 'animate-pulse' : ''}`}
      style={{
        ...cardStyle,
        animation: isAnimating ? 'pulseBorder 1s ease-in-out' : 'none'
      }}
    >
      <div className="flex flex-col items-center gap-1 py-4 md:py-6 lg:py-8">
        {/* Index number */}
        <div className="text-blue-400/70 text-sm mb-1">
          {wordData.index}
        </div>
        <div className="mb-2">
          <MainWord 
            word={wordData.word}
            tr={wordData.tr}
            ps={wordData.ps}
          />
        </div>
        <ConditionalRender data={wordData.inf}>
          <Inflections
            inf={wordData.inf}
          />
        </ConditionalRender>
        <div className="mt-6">
          <Sentences
            sen={wordData.sen}
            inf={wordData.inf}
            word={wordData.word}
          />
        </div>
      </div>
    </div>
  );
};

export default MainCard;