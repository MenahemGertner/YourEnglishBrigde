'use client';
import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AudioButton from '@/components/features/AudioButton';
import InflectionSentences from './inflectionSentences';
import useOpenWindow from '@/app/(routes)/words/card/hooks/openWindow';
import { ColorContext } from '../../navigation/components/colorContext';

const Inflections = ({ inf = [], word = '', infl = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const [wordsList, setWordsList] = useState([]);
  
  const { selectedColor } = useContext(ColorContext);
  
  const INFLECTION_SECTION_TITLE = "wordInflections";
  const { isOpen, toggleSection } = useOpenWindow(INFLECTION_SECTION_TITLE);
  
  const TRANSITION_DURATION = 300; // ms
  
  useEffect(() => {
    if ((inf && inf.length) || word) {
      const combinedList = [...(word ? [word] : []), ...(inf ? [...inf].reverse() : [])];
      const uniqueList = [...new Set(combinedList)];
      
      setWordsList(uniqueList);
      
      if (currentIndex >= uniqueList.length) {
        setCurrentIndex(0);
      }
    }
  }, [inf, word, currentIndex]);

  const handleTransition = (direction, indexUpdater) => {
    if (isTransitioning || !wordsList.length) return;
    
    setIsTransitioning(true);
    setSlideDirection(direction);
    
    setTimeout(() => {
      setCurrentIndex(indexUpdater);
      setIsTransitioning(false);
      setSlideDirection(null);
    }, TRANSITION_DURATION);
  };

  const goToNext = () => {
    handleTransition('left', (prev) => (prev + 1) % wordsList.length);
  };

  const goToPrevious = () => {
    handleTransition('right', (prev) => (prev === 0 ? wordsList.length - 1 : prev - 1));
  };

  const getSiblingIndex = (offset) => {
    if (!wordsList.length) return -1;
    if (wordsList.length < 3) return -1;
    
    const newIndex = (currentIndex + offset + wordsList.length) % wordsList.length;
    return newIndex;
  };

  const currentWord = wordsList[currentIndex] || '';
  const previousWord = getSiblingIndex(-1) >= 0 ? wordsList[getSiblingIndex(-1)] : '';
  const nextWord = getSiblingIndex(1) >= 0 ? wordsList[getSiblingIndex(1)] : '';
  const hasMultipleWords = wordsList.length > 1;
  
  const containerAnimationClass = slideDirection ? 
    `animate-slide-${slideDirection}` : '';

  const handleOpenWindow = () => {
    if (infl) {
      toggleSection(INFLECTION_SECTION_TITLE);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Compact Title */}
      <div className="text-center mb-2">
        <h2 className="text-sm font-medium text-blue-500/70 inline-block">
          הטיות ומשפטים לתרגול
        </h2>
      </div>

      <div className="flex items-center justify-center space-x-2">
        {/* Previous button */}
        <NavigationButton 
          direction="previous"
          onClick={goToPrevious}
          disabled={isTransitioning || !hasMultipleWords}
          selectedColor={selectedColor}
        />
        
        <div className="overflow-hidden flex-grow">
          <div className={`flex items-center justify-center min-h-6 ${containerAnimationClass}`}>
            <div 
              className={`
                flex items-center 
                bg-white 
                border 
                border-blue-100 
                px-3 py-1 
                rounded-lg 
                shadow-sm 
                transition-transform 
                duration-300 
                hover:scale-105 
                ${(infl || der) ? 'cursor-pointer' : ''}
              `}
              onClick={handleOpenWindow}
              style={{
                ...(selectedColor ? {
                  borderColor: selectedColor,
                  boxShadow: `0 0 5px 1px ${selectedColor}40`
                } : {})
              }}
            >
              {previousWord && (
                <div className="text-center px-1 opacity-40">
                  <p className="text-blue-500 text-xs">{previousWord}</p>
                </div>
              )}
              
              <div className="text-center px-1">
                <p className="text-blue-900 font-semibold text-base">{currentWord}</p>
              </div>
              
              {nextWord && (
                <div className="text-center px-1 opacity-40">
                  <p className="text-blue-500 text-xs">{nextWord}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Next button */}
        <NavigationButton 
          direction="next"
          onClick={goToNext}
          disabled={isTransitioning || !hasMultipleWords}
          selectedColor={selectedColor}
        />
        
        {/* Audio button component */}
        {currentWord && (
          <div className="ml-1">
            <AudioButton text={currentWord} />
          </div>
        )}
      </div>
      
      {isOpen && (
        <div className="mt-2">
          <InflectionSentences 
            infl={infl}
          />
        </div>
      )}
    </div>
  );
};

// Compact Navigation button component
const NavigationButton = ({ direction, onClick, disabled, selectedColor }) => {
  const isNext = direction === "next";
  
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full 
        bg-white 
        border 
        border-blue-100 
        text-blue-500 
        hover:bg-blue-50 
        focus:outline-none 
        focus:ring-1 
        focus:ring-blue-200 
        p-1 
        transition-colors 
        duration-200 
        ${isNext ? 'ml-1' : 'mr-1'}
      `}
      style={{
        ...(selectedColor ? {
          borderColor: selectedColor,
          color: selectedColor
        } : {})
      }}
      aria-label={`${isNext ? 'Next' : 'Previous'} word`}
      disabled={disabled}
    >
      {isNext ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
};

export default Inflections;