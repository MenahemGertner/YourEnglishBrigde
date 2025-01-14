'use client'
import { CircleDot, Info } from 'lucide-react';
import Tooltip from '../common/Tooltip';
import { useContext, useState } from 'react';
import { ColorContext } from './colorContext';
import { WordContext } from '../../(routes)/words/page';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

const StatusIcons = () => {
  const router = useRouter();
  const { setSelectedColor } = useContext(ColorContext);
  const wordData = useContext(WordContext);
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const category = wordData?.category || '500';
  const index = wordData?.index;

  // Get next word data and review words in parallel
  const { data: nextWordData, mutate: mutateNextWord } = useSWR(
    index ? `/api/nextAndPrevious?category=${category}&direction=next&index=${index}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: reviewWords, mutate: mutateReviewWords } = useSWR(
    session?.user && index ? `/api/userWords/nextReview?currentIndex=${index}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const navigateToNextWord = async () => {
    try {
      setIsLoading(true);

      // Refresh both data sources
      await Promise.all([
        mutateNextWord(),
        session?.user && mutateReviewWords()
      ]);

      // Check for review words first
      if (reviewWords?.length > 0) {
        const nextReviewWord = reviewWords[0];
        router.push(`/words?index=${nextReviewWord.word_id}&category=${category}`);
        return;
      }

      // If no review words, use regular next word
      if (nextWordData) {
        router.push(`/words?index=${nextWordData.index}&category=${category}`);
        return;
      }

      // If no next word, return to start
      router.push(`/words?index=1&category=${category}`);
      
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
      // If setting to level 1, handle deletion first
      if (level === 1) {
        const response = await fetch('/api/userWords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word_id: wordData.index,
            level: 1,
            currentSequencePosition: parseInt(wordData.index)
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update word level');
        }

        // Important: Force refresh reviewWords before navigation
        await mutateReviewWords();
        
        // Navigate to next regular word directly
        const nextResponse = await fetch(
          `/api/nextAndPrevious?category=${category}&direction=next&index=${wordData.index}`
        );
        
        if (!nextResponse.ok) {
          throw new Error('Failed to get next word');
        }
        
        const nextWord = await nextResponse.json();
        setSelectedColor(color);
        router.push(`/words?index=${nextWord.index}&category=${category}`);
        return;
      }

      // For other levels, proceed with regular update
      const response = await fetch('/api/userWords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word_id: wordData.index,
          level,
          currentSequencePosition: parseInt(wordData.index)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בעדכון סטטוס המילה');
      }

      setSelectedColor(color);
      
      // Update data before navigation
      await Promise.all([
        mutateNextWord(),
        mutateReviewWords()
      ]);

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