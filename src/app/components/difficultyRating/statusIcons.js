'use client'
import { CircleDot, Info } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { useContext, useState, useEffect } from 'react';
import { ColorContext } from './colorContext';
import { WordContext } from '../../(routes)/words/page';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      return null; // במקום לזרוק שגיאה, נחזיר null
    }
    const errorData = await response.json();
    throw new Error(errorData.error || 'An error occurred');
  }
  return response.json();
};

const StatusIcons = () => {
  const router = useRouter();
  const { setSelectedColor } = useContext(ColorContext);
  const wordData = useContext(WordContext);
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewSequence, setReviewSequence] = useState([]);
  const [isInReviewMode, setIsInReviewMode] = useState(false);

  const category = wordData?.category || '500';
  const index = wordData?.index;

  // שינוי ב-SWR - עכשיו לא זורק שגיאה ב-404
  const { data: nextWordData } = useSWR(
    index ? `/api/nextAndPrevious?category=${category}&direction=next&index=${index}` : null,
    fetcher
  );

  const { data: reviewWords, mutate: mutateReviewWords } = useSWR(
    session?.user && index ? `/api/userWords/nextReview?currentIndex=${index}` : null,
    fetcher
  );

  const findNextReviewWord = () => {
    if (!reviewWords?.length) return null;
    const currentIndex = reviewWords.findIndex(w => w.word_id === parseInt(index));
    if (currentIndex === -1) return reviewWords[0];
    return reviewWords[currentIndex + 1];
  };

  const navigateToNextWord = async () => {
    try {
      setIsLoading(true);
      
      if (isInReviewMode) {
        const nextReviewWord = findNextReviewWord();
        if (nextReviewWord) {
          router.push(`/words?index=${nextReviewWord.word_id}&category=${category}`);
          return;
        }
        // אם אין עוד מילים לחזרה, נצא ממצב חזרה
        setIsInReviewMode(false);
      }

      // במצב רגיל או אם אין עוד מילים לחזרה
      if (nextWordData) {
        router.push(`/words?index=${nextWordData.index}&category=${category}`);
      } else {
        // בדוק אם יש מילים חדשות לחזרה
        await mutateReviewWords();
        const newReviewWords = await fetcher(`/api/userWords/nextReview?currentIndex=${index}`);
        
        if (newReviewWords?.length) {
          setIsInReviewMode(true);
          router.push(`/words?index=${newReviewWords[0].word_id}&category=${category}`);
        } else {
          // אם אין מילים לחזרה וגם אין מילה רגילה הבאה, חזור להתחלה
          router.push(`/words?index=1&category=${category}`);
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setError('שגיאה במעבר למילה הבאה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async (color, level) => {
    if (!session?.user?.id) {
      setError('יש להתחבר כדי לשמור את הדירוג');
      return;
    }

    if (!wordData?.index) {
      setError('לא נמצאו נתונים עבור המילה');
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בעדכון סטטוס המילה');
      }

      setSelectedColor(color);

      if (level === 1) {
        // עדכן את רשימת המילים לחזרה לפני הניווט
        await mutateReviewWords();
      }
      
      await navigateToNextWord();

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

  if (status === "loading") {
    return <div className="text-right" dir="rtl">טוען...</div>;
  }

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