import React from 'react';
import { Circle } from 'lucide-react';
import { useWords } from '../providers/wordsProvider';
import IconData from '@/lib/data/ColorMap';
import Tooltip from '@/components/features/Tooltip';

const ChallengingWords = () => {
  const { wordsData, isLoading, error } = useWords();

  if (error) {
    return <div className="text-red-500 text-sm">שגיאה בטעינת המילים: {error}</div>;
  }

  if (isLoading) {
    return (
      <div className={`
        bg-gray-50 rounded p-10 shadow-lg w-64 border-b-2 border-r-2 border-purple-700
        lg:fixed lg:bottom-4 lg:right-4 lg:p-3 lg:w-48
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
        words: wordsData.challengingWords[`level${level}`]
      };
    })
    .filter(column => column.words && column.words.length > 0);

  return (
    <div className={`
      bg-gray-50 rounded p-10 shadow-lg w-64 border-b-2 border-r-2 border-purple-700
      lg:fixed lg:bottom-4 lg:right-4 lg:p-3 lg:w-48
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
    <span key={index} className="inline">
      <Tooltip content={wordsData.wordTranslations[word] || 'אין תרגום זמין'}>
        <span className="inline">{word}</span>
      </Tooltip>
      {index < words.length - 1 && <span>, </span>}
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