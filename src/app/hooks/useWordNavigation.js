// hooks/useWordNavigation.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export function useWordNavigation({ wordData, setSelectedColor }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRegularIndex, setLastRegularIndex] = useState(null);
  const [isEndOfList, setIsEndOfList] = useState(false);

  const category = wordData?.category || '500';
  const index = wordData?.index;

  // שמירת המיקום האחרון ב-localStorage
  const saveLastRegularIndex = useCallback((index) => {
    if (index) {
      localStorage.setItem('lastRegularIndex', index.toString());
    } else {
      localStorage.removeItem('lastRegularIndex');
    }
  }, []);

  // טעינת המיקום האחרון מ-localStorage בעת טעינת הדף
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const endOfList = params.get('isEndOfList');
    const savedLastIndex = localStorage.getItem('lastRegularIndex');
    
    if (endOfList === 'true') {
      setIsEndOfList(true);
    }
    
    if (savedLastIndex) {
      setLastRegularIndex(parseInt(savedLastIndex));
    }
  }, []);

  const navigateToNextWord = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (isEndOfList) {
        const reviewResponse = await fetch('/api/nextAndPrevious/endOfListReview');
        if (!reviewResponse.ok) {
          throw new Error('Failed to get review words');
        }
        
        const reviewWords = await reviewResponse.json();
        const remainingWords = reviewWords.filter(word => word.word_id !== parseInt(index));

        if (remainingWords.length > 0) {
          router.push(`/words?index=${remainingWords[0].word_id}&category=${category}&isEndOfList=true`);
          return;
        }

        setError('סיימת ללמוד את כל המילים והחזרות!');
        return;
      }

      const reviewResponse = await fetch(
        `/api/userWords/nextReview?currentIndex=${lastRegularIndex || index}`
      );
      
      if (!reviewResponse.ok) {
        throw new Error('Failed to check review words');
      }
      
      const reviewWords = await reviewResponse.json();

      if (reviewWords && reviewWords.length > 0 && reviewWords[0].word_id !== parseInt(index)) {
        if (!lastRegularIndex) {
          const newLastIndex = index;
          setLastRegularIndex(newLastIndex);
          saveLastRegularIndex(newLastIndex);
        }
        router.push(`/words?index=${reviewWords[0].word_id}&category=${category}`);
        return;
      }

      const nextResponse = await fetch(
        `/api/nextAndPrevious?category=${category}&direction=next&index=${lastRegularIndex || index}`
      );
      
      if (!nextResponse.ok) {
        throw new Error('Failed to get next word');
      }
      
      const nextWord = await nextResponse.json();
      
      if (nextWord.completed) {
        setIsEndOfList(true);
        
        const endListReviewResponse = await fetch('/api/nextAndPrevious/endOfListReview');
        if (!endListReviewResponse.ok) {
          throw new Error('Failed to get end of list review words');
        }
        
        const endListReviewWords = await endListReviewResponse.json();
        if (endListReviewWords && endListReviewWords.length > 0) {
          router.push(`/words?index=${endListReviewWords[0].word_id}&category=${category}&isEndOfList=true`);
          return;
        }
        
        setError(nextWord.message);
        return;
      }

      setLastRegularIndex(null);
      saveLastRegularIndex(null);
      router.push(`/words?index=${nextWord.index}&category=${category}`);

    } catch (error) {
      console.error('Navigation error:', error);
      setError('שגיאה במעבר למילה הבאה');
    } finally {
      setIsLoading(false);
    }
  }, [category, index, isEndOfList, lastRegularIndex, router, saveLastRegularIndex]);


  const handleWordRating = useCallback(async (color, level) => {
    if (!session?.user?.id) {
      setError('יש להתחבר כדי לשמור את הדירוג');
      return;
    }
  
    setIsLoading(true);
    try {
      const currentSequencePosition = parseInt(wordData.index);
  
      const response = await fetch('/api/userWords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word_id: wordData.index,
          level,
          currentSequencePosition,
          isEndOfList
        }),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      const data = await response.json();
      
      // שמירת המיקום הנוכחי לפני המעבר לדף התרגול
      if (data.shouldRedirectToPractice) {
        localStorage.setItem('lastPosition', wordData.index);
        localStorage.setItem('isEndOfList', isEndOfList);  // שמירת המצב
        router.push('/practiceSpace');
        return;
    }
  
      setSelectedColor(color);
      setTimeout(() => {
        setSelectedColor(null);
        navigateToNextWord();
      }, 300);
  
    } catch (error) {
      console.error('Error in handleClick:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [wordData.index, session?.user?.id, setSelectedColor, navigateToNextWord, router, isEndOfList]);

  // Effect for URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const endOfList = params.get('isEndOfList');
    const lastIndex = params.get('lastRegularIndex');
    
    if (endOfList === 'true') {
      setIsEndOfList(true);
    }
    
    if (lastIndex) {
      setLastRegularIndex(parseInt(lastIndex));
    }
  }, []);

  return {
    error,
    isLoading,
    handleWordRating,
    isEndOfList,
  };
}