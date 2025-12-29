// app/(routes)/(games)/prepositions/components/ResultsSummary.jsx

import { useEffect, useState, useRef } from 'react';
import { getRating, calculateFinalScore, shouldUnlockNextLevel } from '../lib/scoring';
import { saveLevelResults, unlockNextLevel, getNextLevel } from '../lib/storage';

export default function ResultsSummary({ results, onPlayAgain, onNextLevel, onBackToMenu }) {
  const [saveData, setSaveData] = useState(null);
  const [levelUnlocked, setLevelUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasSavedRef = useRef(false);

  const rating = getRating(results.accuracy, results.livesLeft, results.maxLives);
  const finalScoreData = calculateFinalScore(
    results.correctAnswers,
    results.score,
    results.livesLeft,
    results.maxLives,
    results.levelCompleted
  );
  const canUnlockNext = shouldUnlockNextLevel(results.accuracy, results.levelCompleted);
  const nextLevelExists = getNextLevel(results.levelId) !== null;

  useEffect(() => {
    if (hasSavedRef.current) return; // ⛔️ חשוב
    hasSavedRef.current = true;

    const saved = saveLevelResults(results.levelId, {
      score: finalScoreData.finalScore,
      accuracy: results.accuracy,
      levelCompleted: results.levelCompleted,
    });

    setSaveData(saved);

    if (canUnlockNext && nextLevelExists) {
      const unlocked = unlockNextLevel(results.levelId);
      setLevelUnlocked(unlocked);
    }

    setIsLoading(false);
  }, []); // ⬅️ ריק בכוונה

  // Show loading while saving
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-2xl text-gray-600">שומר תוצאות...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
      {/* New Best Score Banner */}
      {saveData?.isNewBestScore && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 mb-6 text-center animate-pulse">
          <div className="text-3xl mb-2">🎉</div>
          <div className="font-bold text-xl">שיא חדש!</div>
          <div className="text-sm">
            שיפרת את הציון מ-{saveData.previousBestScore} ל-{finalScoreData.finalScore}!
          </div>
        </div>
      )}

      {/* ✅ תיקון: Level Unlocked Banner - רק אם המשחק הושלם */}
      {levelUnlocked && results.levelCompleted && (
        <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl mb-2">🔓</div>
          <div className="font-bold text-xl">רמה חדשה נפתחה!</div>
          <div className="text-sm">רמה {results.levelId + 1} זמינה עכשיו!</div>
        </div>
      )}

      {/* ✅ הוספה: Timeout Message - אם הזמן אזל */}
      {!results.levelCompleted && results.incompleteSentences > 0 && (
        <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="font-bold text-xl">הזמן אזל!</div>
          <div className="text-sm">
            לא הספקת לענות על {results.incompleteSentences} משפטים
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">
          {rating.stars >= 3 ? '🌟' : rating.stars >= 2 ? '⭐' : '💪'}
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">{rating.title}</h2>
        <p className="text-xl text-gray-600">{rating.message}</p>
        
        {/* Stars Display */}
        {saveData && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-gray-600">כוכבים:</span>
            <div className="flex gap-1 text-3xl">
              {[1, 2, 3].map((star) => (
                <span key={star}>
                  {star <= saveData.newStars ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Accuracy */}
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {results.accuracy}%
          </div>
          <div className="text-sm text-gray-600">דיוק</div>
        </div>

        {/* Correct Answers */}
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {results.correctAnswers}/{results.totalAttempts}
          </div>
          <div className="text-sm text-gray-600">תשובות נכונות</div>
        </div>

        {/* Lives Left */}
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">
            {results.livesLeft}/{results.maxLives}
          </div>
          <div className="text-sm text-gray-600">חיים שנותרו</div>
        </div>

        {/* Final Score */}
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {finalScoreData.finalScore}
          </div>
          <div className="text-sm text-gray-600">ניקוד סופי</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-4">פירוט ניקוד:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">ניקוד בסיסי:</span>
            <span className="font-semibold">{finalScoreData.baseScore}</span>
          </div>
          {finalScoreData.livesBonus > 0 && (
            <div className="flex justify-between text-green-600">
              <span>בונוס חיים:</span>
              <span className="font-semibold">+{finalScoreData.livesBonus}</span>
            </div>
          )}
          {finalScoreData.completionBonus > 0 && (
            <div className="flex justify-between text-blue-600">
              <span>בונוס השלמה:</span>
              <span className="font-semibold">+{finalScoreData.completionBonus}</span>
            </div>
          )}
          {finalScoreData.perfectBonus > 0 && (
            <div className="flex justify-between text-purple-600">
              <span>בונוס מושלם:</span>
              <span className="font-semibold">+{finalScoreData.perfectBonus}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>סה"כ:</span>
            <span className="text-purple-600">{finalScoreData.finalScore}</span>
          </div>
        </div>

        {/* Previous Best Score */}
        {saveData && saveData.previousBestScore > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">השיא הקודם שלך:</span>
              <span className="font-semibold text-gray-800">{saveData.previousBestScore}</span>
            </div>
            {!saveData.isNewBestScore && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                לא שברת את השיא הפעם - נסה שוב! 💪
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs space-y-1">
            <div><strong>Debug Info:</strong></div>
            <div>canUnlockNext: {canUnlockNext ? 'true' : 'false'}</div>
            <div>nextLevelExists: {nextLevelExists ? 'true' : 'false'}</div>
            <div>levelUnlocked: {levelUnlocked ? 'true' : 'false'}</div>
            <div>results.levelCompleted: {results.levelCompleted ? 'true' : 'false'}</div>
            <div>results.accuracy: {results.accuracy}</div>
            <div>results.score (base): {results.score}</div>
            <div>finalScore (with bonuses): {finalScoreData.finalScore}</div>
            <div>results.incompleteSentences: {results.incompleteSentences || 0}</div>
            {saveData && (
              <>
                <div>---</div>
                <div>previousBestScore: {saveData.previousBestScore}</div>
                <div>isNewBestScore: {saveData.isNewBestScore ? 'true' : 'false'}</div>
              </>
            )}
          </div>
        )}

        {canUnlockNext && nextLevelExists && onNextLevel && results.levelCompleted && (
          <button
            onClick={onNextLevel}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            🚀 רמה הבאה - רמה {results.levelId + 1}
          </button>
        )}
        
        <button
          onClick={onPlayAgain}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          🔄 שחק שוב ברמה {results.levelId}
        </button>

        <button
          onClick={onBackToMenu}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          ← חזור לתפריט
        </button>
      </div>
    </div>
  );
}