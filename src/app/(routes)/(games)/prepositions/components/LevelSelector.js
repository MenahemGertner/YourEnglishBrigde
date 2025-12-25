// app/(routes)/(games)/prepositions/components/LevelSelector.jsx

'use client';

import { useState, useEffect } from 'react';
import { getAllLevels } from '../lib/levels';
import { 
  isLevelUnlocked, 
  getLevelBestScore, 
  getLevelStars,
  getOverallStats,
  resetProgress,
} from '../lib/storage';

export default function LevelSelector({ onSelectLevel }) {
  const [progress, setProgress] = useState(null);
  const levels = getAllLevels();

  useEffect(() => {
    // Load progress on mount
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    const stats = getOverallStats();
    setProgress(stats);
  };

  const handleResetProgress = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות?')) {
      resetProgress();
      loadProgressData();
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'expert':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'קל';
      case 'medium':
        return 'בינוני';
      case 'hard':
        return 'קשה';
      case 'expert':
        return 'מומחה';
      default:
        return '';
    }
  };

  const renderStars = (stars) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3].map((star) => (
          <span key={star} className="text-2xl">
            {star <= stars ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 my-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Prepositions Game
          </h1>
          <p className="text-lg text-gray-500 mb-2">
  בחר את מילת היחס הנכונה שמתאימה לכל משפט
</p>
          <p className="text-xl text-gray-600 mb-6">
            בחר רמה והתחל ללמוד!
          </p>

          {/* Overall Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
              הסטטיסטיקות שלי
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center" title="מספר הרמות שסיימת בהצלחה (עם לפחות 60% דיוק)">
                <div className="text-3xl font-bold text-blue-600">
                  {progress.completedLevels}/8
                </div>
                <div className="text-sm text-gray-600">רמות הושלמו</div>
              </div>
              <div className="text-center" title="סכום הכוכבים שצברת בכל הרמות">
                <div className="text-3xl font-bold text-yellow-600">
                  {progress.totalStars}/{progress.maxStars}
                </div>
                <div className="text-sm text-gray-600">כוכבים</div>
              </div>
              <div className="text-center" title="סכום הציונים הטובים ביותר מכל רמה">
                <div className="text-3xl font-bold text-purple-600">
                  {progress.totalScore}
                </div>
                <div className="text-sm text-gray-600">סה״כ ניקוד</div>
              </div>
              <div className="text-center" title="מספר המשחקים שסיימת בהצלחה">
                <div className="text-3xl font-bold text-green-600">
                  {progress.gamesPlayed}
                </div>
                <div className="text-sm text-gray-600">משחקים שהושלמו</div>
              </div>
            </div>
            
            {/* Explanation */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                💡 <strong>רמה מושלמת</strong> = סיימת את כל המשפטים עם לפחות 60% דיוק
                <br />
                ⭐ <strong>כוכבים</strong>: 1⭐ = 60%+ | 2⭐ = 75%+ | 3⭐ = 90%+
              </p>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const bestScore = getLevelBestScore(level.id);
            const stars = getLevelStars(level.id);
            const isCompleted = stars > 0;

            return (
              <button
                key={level.id}
                onClick={() => unlocked && onSelectLevel(level.id)}
                disabled={!unlocked}
                className={`
                  bg-white rounded-2xl shadow-lg p-6 text-right border-2 
                  transition-all duration-200
                  ${
                    unlocked
                      ? 'hover:shadow-2xl hover:scale-105 border-transparent hover:border-blue-500 cursor-pointer'
                      : 'opacity-60 cursor-not-allowed border-gray-300'
                  }
                `}
              >
                {/* Level Number & Lock/Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {level.id}
                  </div>
                  
                  {!unlocked ? (
                    <div className="text-4xl">🔒</div>
                  ) : isCompleted ? (
                    renderStars(stars)
                  ) : (
                    <div className="text-green-600 font-bold text-sm">NEW!</div>
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {level.name}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                      level.difficulty
                    )}`}
                  >
                    {getDifficultyText(level.difficulty)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">{level.description}</p>

                {/* Stats */}
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>משפטים:</span>
                    <span className="font-semibold">{level.totalSentences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>זמן:</span>
                    <span className="font-semibold">{level.initialTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>חיים:</span>
                    <span className="font-semibold">{level.lives}</span>
                  </div>
                </div>

                {/* Best Score */}
                {unlocked && bestScore > 0 && (
                  <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-700 font-semibold">
                        הציון הטוב ביותר:
                      </span>
                      <span className="text-xl font-bold text-purple-600">
                        {bestScore}
                      </span>
                    </div>
                  </div>
                )}

                {/* Locked Message */}
                {!unlocked && (
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">
                      🔒 סיים רמה {level.id - 1} כדי לפתוח
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            איך לשחק? 🎮
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <span>תקבל משפט עם חלל ריק - בחר את ה-preposition הנכון</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <span>תשובה נכונה = ניקוד + זמן נוסף</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <span>תשובה שגויה = הסבר + איבוד זמן וחיים</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <span>השלם את כל המשפטים לפני שהזמן או החיים אוזלים!</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <span>צבור כוכבים לפי הדיוק שלך ופתח רמות חדשות!</span>
            </li>
          </ul>

          {/* Debug button */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleResetProgress}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all"
              >
                🔄 איפוס התקדמות
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}