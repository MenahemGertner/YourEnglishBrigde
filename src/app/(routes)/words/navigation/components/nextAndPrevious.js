// app/words/navigation/components/ModernNavigation.js
'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAdjacentIndex } from '../helpers/navigationHelpers';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function ModernNavigation({ index, categorySize }) {
  const currentIndex = parseInt(index);
  const nextIndex = getAdjacentIndex(currentIndex, 'next', categorySize);
  const prevIndex = getAdjacentIndex(currentIndex, 'prev', categorySize);
  
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // המרחק המינימלי בפיקסלים שנדרש להחלקה
  const minSwipeDistance = 50;
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      // ניווט באמצעות מקשי המקלדת
      if (event.key === 'ArrowRight' && prevIndex) {
        window.location.href = `/words?index=${prevIndex}`;
      } else if (event.key === 'ArrowLeft' && nextIndex) {
        window.location.href = `/words?index=${nextIndex}`;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextIndex, prevIndex]);

  // טיפול בהחלקות במובייל
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && prevIndex) {
      window.location.href = `/words?index=${prevIndex}`;
    } else if (isRightSwipe && nextIndex) {
      window.location.href = `/words?index=${nextIndex}`;
    }
  };

  return (
    <div 
      className="w-full mx-auto px-4 py-2"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* כפתורי ניווט מינימליסטיים */}
      <div className="flex justify-between items-center max-w-xl mx-auto">
        <Link
          href={prevIndex ? `/words?index=${prevIndex}` : '#'}
          className={`
            flex items-center justify-center rounded-full w-12 h-12
            transition-all duration-300
            ${!prevIndex 
              ? 'opacity-30 cursor-not-allowed bg-gray-100' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 hover:scale-110 shadow-sm hover:shadow'}
          `}
          aria-disabled={!prevIndex}
          onClick={(e) => !prevIndex && e.preventDefault()}
          aria-label="לפריט הקודם"
        >
          <ChevronRight className="w-6 h-6 text-blue-600" />
        </Link>
        
        <Link
          href={nextIndex ? `/words?index=${nextIndex}` : '#'}
          className={`
            flex items-center justify-center rounded-full w-12 h-12
            transition-all duration-300
            ${!nextIndex 
              ? 'opacity-30 cursor-not-allowed bg-gray-100' 
              : 'bg-gradient-to-r from-indigo-100 to-blue-50 hover:from-indigo-200 hover:to-blue-100 hover:scale-110 shadow-sm hover:shadow'}
          `}
          aria-disabled={!nextIndex}
          onClick={(e) => !nextIndex && e.preventDefault()}
          aria-label="לפריט הבא"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600" />
        </Link>
      </div>
    </div>
  );
}