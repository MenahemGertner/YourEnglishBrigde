'use client'
import { Cat } from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

const StoppingPoint = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lastPosition, setLastPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSequential, setIsSequential] = useState(true);
  const [isReviewWord, setIsReviewWord] = useState(false);

  const { data: serverPosition, mutate } = useSWR(
    session?.user ? '/api/userWords/userPosition' : null,
    fetcher
  );

  useEffect(() => {
    if (session?.user && pathname.includes('/words')) {
      const currentIndex = searchParams.get('index');
      const currentCategory = searchParams.get('category') || '500';

      if (currentIndex) {
        setIsLoading(true);
        const position = {
          index: currentIndex,
          category: currentCategory,
        };

        setLastPosition({
          ...position,
          current_sequence_position: serverPosition?.current_sequence_position,
          learning_sequence_pointer: serverPosition?.learning_sequence_pointer,
        });

        fetch('/api/userWords/userPosition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(position),
        })
          .then(response => response.json())
          .then(data => {
            setIsSequential(data.isSequential);
            setIsReviewWord(data.isReviewWord);
            return mutate();
          })
          .catch((error) => {
            console.error('Error updating user position:', error);
          })
          .finally(() => setIsLoading(false));
      }
    }
  }, [pathname, searchParams, session, mutate, serverPosition]);

  useEffect(() => {
    if (serverPosition) {
      setLastPosition(serverPosition);
      setIsLoading(false);
    }
  }, [serverPosition]);

  const navigationIndex = lastPosition?.learning_sequence_pointer || 1;

  const FloatingCat = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
      const tooltipInterval = setInterval(() => {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
        }, 2000);
      }, 4000);

      return () => clearInterval(tooltipInterval);
    }, []);

    const currentIndex = parseInt(searchParams.get('index'));
    const learningPointer = lastPosition?.learning_sequence_pointer;
    
    // עדכון הלוגיקה של isInSequence
    const isInSequence = 
      currentIndex === (learningPointer - 1) ||
      currentIndex === learningPointer ||
      isReviewWord; // מילת חזרה תקינה

    if (!session || !serverPosition || isInSequence) {
      return null;
    }

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Link href={`/words?index=${navigationIndex -1}&category=${lastPosition?.category || '500'}`}>
          <div className="relative">
            <div className="animate-bounce">
              <Cat 
                className="h-14 w-14 transition-colors duration-200 text-blue-900 hover:text-blue-700"
              />
            </div>
            
            <div className={`absolute bg-white border border-gray-200 rounded-md p-2 shadow-lg -right-2 bottom-full mb-1 text-sm text-gray-700 whitespace-nowrap transition-opacity duration-300 ${
              showTooltip ? 'opacity-100' : 'opacity-0'
            }`}>
              {`חזרה לרצף הלמידה - מילה ${navigationIndex - 1}`}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div>
      <FloatingCat />
    </div>
  );
};

export default StoppingPoint;