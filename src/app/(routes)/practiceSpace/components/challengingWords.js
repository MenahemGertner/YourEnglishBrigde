import React, { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';
import IconData from '@/lib/data/ColorMap';

const ChallengingWords = () => {
  const [words, setWords] = useState({
    level2: [],
    level3: [],
    level4: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // פונקציה לשליפת מילה אחת ממונגו לפי אינדקס
  const fetchWordByIndex = async (index) => {
    try {
      const response = await fetch(`/api/words?index=${index}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch word with index ${index}`);
      }
      const wordData = await response.json();
      return wordData;
    } catch (error) {
      console.error(`Error fetching word ${index}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        // שליפת האינדקסים מ-Supabase
        const response = await fetch('practiceSpace/api/wordAndInflections');
        if (!response.ok) {
          throw new Error('Failed to fetch word indices');
        }
        const data = await response.json();
        
        // שליפת המילים לכל רמה בנפרד
        const fetchWordsForLevel = async (indices) => {
          const wordPromises = indices.map(index => fetchWordByIndex(index));
          const wordResults = await Promise.all(wordPromises);
          
          // החזרת רק המילים הבסיסיות (בלי הטיות) שנשלפו בהצלחה
          return wordResults
            .filter(wordData => wordData !== null && wordData.word)
            .map(wordData => wordData.word);
        };

        // שליפת מילים לכל רמה
        const [level2Words, level3Words, level4Words] = await Promise.all([
          fetchWordsForLevel(data.wordIndices.level2 || []),
          fetchWordsForLevel(data.wordIndices.level3 || []),
          fetchWordsForLevel(data.wordIndices.level4 || [])
        ]);

        setWords({
          level2: level2Words,
          level3: level3Words,
          level4: level4Words
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className={`
        bg-gray-50 rounded p-10 shadow-lg w-64 border-b-2 border-r-2 border-purple-700
        md:fixed md:bottom-4 md:right-4 md:p-3 md:w-48
        mx-auto mt-4
      `}>
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
        title: level === 4 ? "מילים מאתגרות" :
               level === 3 ? "מילים בינוניות" :
                            "מילים קלות",
        words: words[`level${level}`]
      };
    })
    .filter(column => column.words.length > 0);

  return (
    <div className={`
      bg-gray-50 rounded p-10 shadow-lg w-64 border-b-2 border-r-2 border-purple-700
      md:fixed md:bottom-4 md:right-4 md:p-3 md:w-48
      mx-auto mt-4
    `}>
      <div className="space-y-2">
        {columns.map(({ level, color, title, words }) => (
          <div key={level} className="text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Circle 
                className="w-3 h-3"
                style={{ color: color, fill: color }}
              />
              <span className="font-medium">{title}</span>
            </div>
            <div className="mr-5 mt-1">
              <div className="text-gray-600">
                {words.map((word, index) => (
                  <span key={index}>
                    {word}{index < words.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengingWords;