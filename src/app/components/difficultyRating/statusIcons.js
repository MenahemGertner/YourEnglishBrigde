'use client'
import { CircleDot, Info } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { useContext, useState, useEffect } from 'react';
import { ColorContext } from './colorContext';
import { WordContext } from '../../(routes)/words/page';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const StatusIcons = () => {
  const router = useRouter();
  const { setSelectedColor } = useContext(ColorContext);
  const wordData = useContext(WordContext);
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRegularIndex, setLastRegularIndex] = useState(null);
  const [isEndOfList, setIsEndOfList] = useState(false);

  const category = wordData?.category || '500';
  const index = wordData?.index;

  const navigateToNextWord = async () => {
    try {
      setIsLoading(true);
      console.log('Starting navigation process...');
      console.log('Current index:', index);
      console.log('Last regular index:', lastRegularIndex);
      console.log('Is end of list:', isEndOfList);

      if (isEndOfList) {
        // טיפול במילים לחזרה בסוף הרשימה
        const reviewResponse = await fetch('/api/userWords/endOfListReview');
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

      // בדיקת מילים לחזרה במצב רגיל
      const reviewResponse = await fetch(
        `/api/userWords/nextReview?currentIndex=${lastRegularIndex || index}`
      );
      
      if (!reviewResponse.ok) {
        throw new Error('Failed to check review words');
      }
      
      const reviewWords = await reviewResponse.json();
      console.log('Review words received:', reviewWords);

      // אם יש מילים לחזרה
      if (reviewWords && reviewWords.length > 0 && reviewWords[0].word_id !== parseInt(index)) {
        console.log('Found review word, navigating to:', reviewWords[0].word_id);
        if (!lastRegularIndex) {
          setLastRegularIndex(index);
        }
        router.push(`/words?index=${reviewWords[0].word_id}&category=${category}`);
        return;
      }

      // אם אין מילים לחזרה, ממשיכים ברצף הרגיל מהנקודה האחרונה
      console.log('No review words, returning to sequence...');
      const nextIndex = lastRegularIndex || index;
      const nextResponse = await fetch(
        `/api/nextAndPrevious?category=${category}&direction=next&index=${nextIndex}`
      );
      
      if (!nextResponse.ok) {
        throw new Error('Failed to get next word');
      }
      
      const nextWord = await nextResponse.json();
      console.log('Next word received:', nextWord);
      
      // בדיקה אם הגענו לסוף הרשימה
      if (nextWord.completed) {
        setIsEndOfList(true);
        
        // בדיקה אם יש מילים לחזרה
        const endListReviewResponse = await fetch('/api/userWords/endOfListReview');
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

      // איפוס המיקום האחרון כשחוזרים לרצף הרגיל
      setLastRegularIndex(null);
      console.log('Navigating to next word:', nextWord.index);
      router.push(`/words?index=${nextWord.index}&category=${category}`);

    } catch (error) {
      console.error('Navigation error:', error);
      setError('שגיאה במעבר למילה הבאה');
    } finally {
      setIsLoading(false);
    }
  };

  // משחזר את המצב מה-URL
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

  const handleClick = async (color, level) => {
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
          currentSequencePosition
        }),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      setSelectedColor(color);
      // איפוס הצבע לפני המעבר למילה הבאה
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
  };

  const iconData = [
    { color: 'green', level: 1, content: ' המושג ברור לי היטב! \n אין צורך בחזרה נוספת! \n\n * חשוב לשים לב,\n שהמושג ברור בשימושים השונים שלו,\n ובהגיה נכונה!' },
    { color: 'yellow', level: 2, content: 'הבנתי את המושג, \nאך זקוק/ה לרענון או חידוד קל!' },
    { color: 'orange', level: 3, content: 'המושג הזה,\n לא ברור לי מספיק!' },
    { color: 'red', level: 4, content: 'אני ממש מתקשה \nלקלוט את המושג הזה!' },
  ];

  return (
    <div className="flex flex-col gap-2 border-t p-4">
      <div className="flex gap-4 justify-end">
        {iconData.map((icon) => (
          <div key={icon.level} className="flex flex-col items-center">
            <Tooltip content={icon.content}>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Info className="w-5 h-5 text-blue-900/80" />
              </button>
            </Tooltip>
            
            <button
              disabled={isLoading}
              onClick={() => handleClick(icon.color, icon.level)}
              className={`p-2 rounded hover:opacity-80 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >              
              <CircleDot
                className="w-14 h-14"
                style={{ color: icon.color }}
              />
            </button>
          </div>
        ))}
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2 text-right">
          {error}
        </div>
      )}
    </div>
  );
};

export default StatusIcons;