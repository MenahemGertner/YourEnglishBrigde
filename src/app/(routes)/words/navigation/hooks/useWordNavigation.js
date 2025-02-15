// import { useState, useEffect, useCallback, useContext } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from "next-auth/react";
// import { getStartingIndexForCategory, getNextCategory } from '../helpers/reviewHelperFunctions'
// import { ColorContext } from '../components/colorContext';


// export function useWordNavigation({ wordData }) {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const { setSelectedColor } = useContext(ColorContext);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastRegularIndex, setLastRegularIndex] = useState(null);
//   const [isEndOfList, setIsEndOfList] = useState(false);
//   const [navigationState, setNavigationState] = useState({
//     showMessage: false,
//     message: '',
//     status: '',
//     nextCategory: null
//   });

//   const category = wordData?.category || '500';
//   const index = wordData?.index;
//   const { handleColorChange } = useContext(ColorContext);

//   // שמירת המיקום האחרון ב-localStorage
//   const saveLastRegularIndex = useCallback((index) => {
//     if (index) {
//       localStorage.setItem('lastRegularIndex', index.toString());
//     } else {
//       localStorage.removeItem('lastRegularIndex');
//     }
//   }, []);

//   // טעינת המיקום האחרון מ-localStorage בעת טעינת הדף
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const endOfList = params.get('isEndOfList');
//     const savedLastIndex = localStorage.getItem('lastRegularIndex');
    
//     if (endOfList === 'true') {
//       setIsEndOfList(true);
//     }
    
//     if (savedLastIndex) {
//       setLastRegularIndex(parseInt(savedLastIndex));
//     }
//   }, []);

//   const navigateToNextWord = useCallback(async () => {
//     try {
//       setIsLoading(true);
      
//       if (isEndOfList) {
//         const reviewResponse = await fetch('/words/navigation/api/reviewManagement/endOfListReview');
//         if (!reviewResponse.ok) {
//           throw new Error('Failed to get review words');
//         }
        
//         const reviewWords = await reviewResponse.json();
//         const remainingWords = reviewWords.filter(word => word.word_id !== parseInt(index));

//         if (remainingWords.length > 0) {
//           router.push(`/words?index=${remainingWords[0].word_id}&category=${category}&isEndOfList=true`);
//           return;
//         }

//         const nextCategory = getNextCategory(category);
//         setNavigationState({
//           showMessage: true,
//           message: 'סיימת ללמוד את כל המילים והחזרות ברשימה הנוכחית!',
//           status: nextCategory ? 'LIST_END' : 'COMPLETE',
//           nextCategory
//         });
//         return;
//       }

//       const reviewResponse = await fetch(
//         `/words/navigation/api/reviewManagement/nextReview?currentIndex=${lastRegularIndex || index}`
//       );
      
//       if (!reviewResponse.ok) {
//         throw new Error('Failed to check review words');
//       }
      
//       const reviewWords = await reviewResponse.json();

//       if (reviewWords && reviewWords.length > 0 && reviewWords[0].word_id !== parseInt(index)) {
//         if (!lastRegularIndex) {
//           const newLastIndex = index;
//           setLastRegularIndex(newLastIndex);
//           saveLastRegularIndex(newLastIndex);
//         }
//         router.push(`/words?index=${reviewWords[0].word_id}&category=${category}`);
//         return;
//       }

//       const nextResponse = await fetch(
//         `/words/navigation/api/wordNavigation?category=${category}&direction=next&index=${lastRegularIndex || index}`
//       );
      
//       if (!nextResponse.ok) {
//         throw new Error('Failed to get next word');
//       }
      
//       const nextWord = await nextResponse.json();
      
//       if (nextWord.completed) {
//         setIsEndOfList(true);
        
//         const endListReviewResponse = await fetch('/words/navigation/api/reviewManagement/endOfListReview');
//         if (!endListReviewResponse.ok) {
//           throw new Error('Failed to get end of list review words');
//         }
        
//         const endListReviewWords = await endListReviewResponse.json();
//         if (endListReviewWords && endListReviewWords.length > 0) {
//           router.push(`/words?index=${endListReviewWords[0].word_id}&category=${category}&isEndOfList=true`);
//           return;
//         }
        
//         const nextCategory = getNextCategory(category);
//         setNavigationState({
//           showMessage: true,
//           message: nextWord.message,
//           status: nextCategory ? 'LIST_END' : 'COMPLETE',
//           nextCategory
//         });
//         return;
//       }

//       setLastRegularIndex(null);
//       saveLastRegularIndex(null);
//       router.push(`/words?index=${nextWord.index}&category=${category}`);

//     } catch (error) {
//       console.error('Navigation error:', error);
//       setError('שגיאה במעבר למילה הבאה');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [category, index, isEndOfList, lastRegularIndex, router, saveLastRegularIndex]);

//   const navigateToPrevWord = useCallback(async () => {
//     try {
//       setIsLoading(true);
      
//       // אם אנחנו במצב של סוף רשימה, נחזור למילה האחרונה הרגילה
//       if (isEndOfList && lastRegularIndex) {
//         router.push(`/words?index=${lastRegularIndex}&category=${category}`);
//         setIsEndOfList(false);
//         setNavigationState({
//           showMessage: false,
//           message: '',
//           status: '',
//           nextCategory: null
//         });
//         return;
//       }

//       // בדיקה אם אנחנו במצב של חזרה וצריך לחזור למילה הקודמת ברצף הרגיל
//       if (lastRegularIndex) {
//         const prevResponse = await fetch(
//           `/words/navigation/api/wordNavigation?category=${category}&direction=prev&index=${lastRegularIndex}`
//         );
        
//         if (!prevResponse.ok) {
//           throw new Error('Failed to get previous word');
//         }
        
//         const prevWord = await prevResponse.json();
        
//         if (!prevWord.completed) {
//           setLastRegularIndex(prevWord.index);
//           saveLastRegularIndex(prevWord.index);
//           router.push(`/words?index=${prevWord.index}&category=${category}`);
//           return;
//         }
//       }
      
//       // ניווט רגיל למילה הקודמת
//       const prevResponse = await fetch(
//         `/words/navigation/api/wordNavigation?category=${category}&direction=prev&index=${index}`
//       );
      
//       if (!prevResponse.ok) {
//         throw new Error('Failed to get previous word');
//       }
      
//       const prevWord = await prevResponse.json();
      
//       if (prevWord.completed) {
//         setNavigationState({
//           showMessage: true,
//           message: 'הגעת לתחילת הרשימה הנוכחית',
//           status: 'LIST_START',
//           nextCategory: null
//         });
//         return;
//       }

//       // מעבר למילה הקודמת
//       setLastRegularIndex(null);
//       saveLastRegularIndex(null);
//       router.push(`/words?index=${prevWord.index}&category=${category}`);

//     } catch (error) {
//       console.error('Navigation error:', error);
//       setError('שגיאה במעבר למילה הקודמת');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [category, index, isEndOfList, lastRegularIndex, router, saveLastRegularIndex]);

//   const handleNextCategory = useCallback(() => {
//     if (navigationState.nextCategory) {
//       setNavigationState(prev => ({ ...prev, showMessage: false }));
//       const startingIndex = getStartingIndexForCategory(navigationState.nextCategory);
//       router.push(`/words?index=${startingIndex}&category=${navigationState.nextCategory}`);
//     }
//   }, [navigationState.nextCategory, router]);

//   const handleWordRating = useCallback(async (level) => {
//     if (!session?.user?.id) {
//         setError('יש להתחבר כדי לשמור את הדירוג');
//         return;
//     }

//     setIsLoading(true);
//     try {
//         const currentSequencePosition = parseInt(wordData.index);
        
//         await handleColorChange(level);

//         const response = await fetch('/words/navigation/api/userProgress/wordRating', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 word_id: wordData.index,
//                 level,
//                 currentSequencePosition,
//                 isEndOfList
//             }),
//         });

//         if (!response.ok) {
//             throw new Error(await response.text());
//         }

//         const data = await response.json();
        
//         if (data.shouldRedirectToPractice) {
//             localStorage.setItem('lastPosition', wordData.index);
//             localStorage.setItem('isEndOfList', isEndOfList);
//             router.push('/practiceSpace');
//             return;
//         }

//         navigateToNextWord();

//     } catch (error) {
//         console.error('Error in handleClick:', error);
//         setError(error.message);
//     } finally {
//         setIsLoading(false);
//     }
//   }, [wordData.index, session?.user?.id, handleColorChange, navigateToNextWord, router, isEndOfList]);

//   return {
//     error,
//     isLoading,
//     handleWordRating,
//     navigateToPrevWord,
//     isEndOfList,
//     navigationState,
//     handleNextCategory 
//   };
// }