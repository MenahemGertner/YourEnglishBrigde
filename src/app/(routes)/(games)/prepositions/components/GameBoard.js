// app/(routes)/(games)/prepositions/components/GameBoard.jsx

'use client';

import { useEffect, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useTimer } from '../hooks/useTimer';
import Timer from './Timer';
import LivesDisplay from './LivesDisplay';
import ScoreDisplay from './ScoreDisplay';
import SentenceDisplay from './SentenceDisplay';
import AnswerOptions from './AnswerOptions';
import FeedbackModal from './FeedbackModal';

export default function GameBoard({ levelId, onGameEnd }) {
  const {
    gameState,
    finalResults,
    startGame,
    selectAnswer,
    nextSentence,
    updateTimer,
    closeFeedback,
  } = useGameState(levelId);

  // Timer hook - only active when game is playing and not showing feedback
  const isTimerActive = gameState.isPlaying && !gameState.isPaused && !gameState.showFeedback;
  
  const handleTimerTick = useCallback((deltaTime) => {
    updateTimer(deltaTime);
  }, [updateTimer]);

  useTimer(isTimerActive, handleTimerTick, 100);

  // Start game on mount
  useEffect(() => {
    startGame();
  }, [startGame]);

  // Handle game end
  useEffect(() => {
    if (gameState.isGameOver && onGameEnd) {
      onGameEnd(finalResults);
    }
  }, [gameState.isGameOver, onGameEnd]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (gameState.showFeedback) return;
    selectAnswer(answer);
  };

  // Handle continue after feedback
  const handleContinue = () => {
    closeFeedback();
    // Small delay before showing next sentence
    setTimeout(() => {
      nextSentence();
    }, 100);
  };

  if (!gameState.isPlaying && !gameState.isGameOver) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-gray-600">טוען...</div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return null; // Results will be shown by parent
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 my-8">
      <div className="max-w-5xl mx-auto">
        {/* Header - Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Lives */}
            <LivesDisplay 
              lives={gameState.lives} 
              maxLives={gameState.maxLives} 
            />

            {/* Center: Score & Progress */}
            <ScoreDisplay
              score={gameState.score}
              completedSentences={gameState.completedSentences}
              totalSentences={gameState.totalSentences}
            />

            {/* Right: Level info */}
            <div className="text-sm font-medium text-gray-700">
              רמה {gameState.levelId}
            </div>
          </div>

          {/* Timer */}
          <div className="mt-4">
            <Timer
              timeRemaining={gameState.timeRemaining}
              maxTime={gameState.maxTime}
            />
          </div>
        </div>

        {/* Main Game Area */}
        <div className="space-y-6" dir='ltr'>
          {/* Sentence */}
          <SentenceDisplay 
            sentence={gameState.currentSentence?.sentence}
            currentBlankIndex={gameState.currentBlankIndex}
            selectedAnswers={gameState.selectedAnswers}
          />

          {/* Answer Options */}
          <AnswerOptions
            options={gameState.currentSentence?.options || []}
            onSelect={handleAnswerSelect}
            disabled={gameState.showFeedback}
          />
        </div>

        {/* Feedback Modal */}
        {gameState.showFeedback && gameState.currentFeedback && (
          <FeedbackModal
            feedback={gameState.currentFeedback}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}