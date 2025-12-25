// app/(routes)/(games)/prepositions/play/page.js

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import GameBoard from '../components/GameBoard';
import { isLevelUnlocked } from '../lib/storage';

function PlayPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelId = parseInt(searchParams.get('level') || '1');
  const [canPlay, setCanPlay] = useState(null);

  useEffect(() => {
    // Check if level is unlocked
    const unlocked = isLevelUnlocked(levelId);
    setCanPlay(unlocked);

    if (!unlocked) {
      // Redirect to menu if level is locked
      setTimeout(() => {
        router.push('/prepositions');
      }, 2000);
    }
  }, [levelId, router]);

  const handleGameEnd = (results) => {
    console.log('Game ended with results:', results); // Debug
    
    // Navigate to results page with data
    const queryString = new URLSearchParams({
      level: levelId.toString(),
      score: results.score.toString(),
      accuracy: results.accuracy.toString(),
      correct: results.correctAnswers.toString(),
      total: results.totalAttempts.toString(),
      lives: results.livesLeft.toString(),
      maxLives: results.maxLives.toString(),
      completed: results.levelCompleted ? 'true' : 'false',
      mistakes: JSON.stringify(results.mistakes),
    }).toString();

    router.push(`/prepositions/results?${queryString}`);
  };

  if (canPlay === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-2xl font-bold text-gray-600">בודק רמה...</div>
      </div>
    );
  }

  if (!canPlay) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            רמה {levelId} נעולה
          </h2>
          <p className="text-gray-600 mb-6">
            עליך להשלים את רמה {levelId - 1} כדי לפתוח רמה זו.
          </p>
          <p className="text-sm text-gray-500">
            מועבר חזרה לתפריט...
          </p>
        </div>
      </div>
    );
  }

  return <GameBoard levelId={levelId} onGameEnd={handleGameEnd} />;
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-600">טוען משחק...</div>
        </div>
      }
    >
      <PlayPageContent />
    </Suspense>
  );
}