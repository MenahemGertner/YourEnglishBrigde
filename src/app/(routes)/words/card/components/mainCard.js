'use client'
import { useContext, useEffect, useState } from 'react';
import ConditionalRender from '@/components/features/ConditionalRender';
import Inflections from './inflections';
import MainWord from './mainWord';
import Sentences from './sentences';
import { ColorContext } from '../../navigation/components/colorContext';

const MainCard = ({ word, index, tr, ps, inf, sen }) => {
  const { selectedColor } = useContext(ColorContext);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (selectedColor) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedColor]);

  if (!inf) return <ConditionalRender/>;

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
        ...(selectedColor ? {
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: selectedColor
        } : {}),
        animation: isAnimating ? 'pulseBorder 1s ease-in-out' : 'none'
      }}
    >
      <div className="flex flex-col items-center gap-1 py-4 md:py-6 lg:py-8">
        <div className="text-blue-400/70 text-sm mb-1">
          {index}
        </div>
        <div className="mb-2">
          <MainWord 
            word={word}
            tr={tr}
            ps={ps}
          />
        </div>
        <ConditionalRender data={inf}>
          <Inflections
            inf={inf}
          />
        </ConditionalRender>
        <div className="mt-6">
          <Sentences
            sen={sen}
            inf={inf}
            word={word}
          />
        </div>
      </div>
    </div>
  );
};

export default MainCard;