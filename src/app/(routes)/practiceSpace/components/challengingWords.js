'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // ✅ נוסיף
import { Circle } from 'lucide-react';
import IconData from '@/lib/data/ColorMap';
import { getChallengingWords } from '../actions/getChallengingWords';

const ChallengingWords = () => {
  const { data: session, status } = useSession(); // ✅ נקבל session
  const [words, setWords] = useState({ level2: [], level3: [], level4: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      setIsLoading(false);
      return;
    }

    const fetchWords = async () => {
      try {
        const result = await getChallengingWords(session.user.id); // ✅ שולחים userId
        setWords(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, [session, status]);

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded p-10 shadow-lg w-64 border-b-2 border-r-2 border-purple-700 md:fixed md:bottom-4 md:right-4 md:p-3 md:w-48 mx-auto mt-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600 text-sm">טוען מילים...</p>
        </div>
      </div>
    );
  }

  const columns = [4, 3, 2]
    .map(level => {
      const iconData = IconData.find(icon => icon.level === level);
      return {
        level,
        color: iconData.color,
        title: level === 4 ? "מילים מאתגרות" : level === 3 ? "מילים בינוניות" : "מילים קלות",
        words: words[`level${level}`]
      };
    })
    .filter(column => column.words.length > 0);

  return (
    <div className="bg-gray-50 rounded p-10 shadow-lg w-64 border-b-2 border-r-2 border-purple-700 md:fixed md:bottom-4 md:right-4 md:p-3 md:w-48 mx-auto mt-4">
      <div className="space-y-2">
        {columns.map(({ level, color, title, words }) => (
          <div key={level} className="text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Circle className="w-3 h-3" style={{ color: color, fill: color }} />
              <span className="font-medium">{title}</span>
            </div>
            <div className="mr-5 mt-1 text-gray-600">
              {words.map((word, index) => (
                <span key={index}>
                  {word}{index < words.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengingWords;
