import React, { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';
import IconData from '../difficultyRating/ColorMap';

const ChallengingWords = () => {
  const [words, setWords] = useState({
    level2: [],
    level3: [],
    level4: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('/api/embedding/wordAndInflections');
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }
        const data = await response.json();
        setWords({
          level2: data.words.level2 || [],
          level3: data.words.level3 || [],
          level4: data.words.level4 || []
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