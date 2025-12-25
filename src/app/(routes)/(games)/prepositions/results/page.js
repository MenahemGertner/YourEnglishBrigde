// app/(routes)/(games)/prepositions/results/page.js

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ResultsSummary from '../components/ResultsSummary';
import MistakesReview from '../components/MistakesReview';
import { getNextLevel } from '../lib/levels';

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse results from URL
  const results = {
    levelId: parseInt(searchParams.get('level') || '1'),
    score: parseInt(searchParams.get('score') || '0'),
    accuracy: parseInt(searchParams.get('accuracy') || '0'),
    correctAnswers: parseInt(searchParams.get('correct') || '0'),
    totalAttempts: parseInt(searchParams.get('total') || '0'),
    livesLeft: parseInt(searchParams.get('lives') || '0'),
    maxLives: parseInt(searchParams.get('maxLives') || '0'),
    levelCompleted: searchParams.get('completed') === 'true',
    mistakes: JSON.parse(searchParams.get('mistakes') || '[]'),
  };

  console.log('Results received:', results); // Debug log

  const handlePlayAgain = () => {
    router.push(`/prepositions/play?level=${results.levelId}`);
  };

  const handleNextLevel = () => {
    const nextLevel = getNextLevel(results.levelId);
    if (nextLevel) {
      router.push(`/prepositions/play?level=${nextLevel.id}`);
    }
  };

  const handleBackToMenu = () => {
    router.push('/prepositions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 my-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Results Summary */}
        <ResultsSummary
          results={results}
          onPlayAgain={handlePlayAgain}
          onNextLevel={getNextLevel(results.levelId) ? handleNextLevel : null}
          onBackToMenu={handleBackToMenu}
        />

        {/* Mistakes Review */}
        <MistakesReview mistakes={results.mistakes} />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-600">טוען תוצאות...</div>
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}