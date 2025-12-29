// app/(routes)/(games)/prepositions/lib/gameEngine.js

import { getLevelById } from './levels';
import { getNextSentence, checkAnswer, getAnswerFeedback } from './sentenceGenerator';
import { calculateScore, calculateAccuracy } from './scoring';
import { getWrongAnswerExplanation } from './explanations';

/**
 * יצירת מצב התחלתי של המשחק
 */
export const initializeGame = (levelId) => {
  const level = getLevelById(levelId);
  
  return {
    // Level info
    levelId,
    levelConfig: level,
    
    // Game state
    isPlaying: false,
    isGameOver: false,
    isPaused: false,
    
    // Current sentence
    currentSentence: null,
    sentenceIndex: 0,
    currentBlankIndex: 0, // For multiple blanks
    selectedAnswers: [], // Array to store answers for multiple blanks
    
    // Progress
    completedSentences: 0,
    totalSentences: level.totalSentences,
    
    // Score & Lives
    score: 0,
    lives: level.lives,
    maxLives: level.lives,
    
    // Stats
    correctAnswers: 0,
    wrongAnswers: 0,
    totalAttempts: 0,
    incompleteSentences: 0, // ✅ שדה חדש - משפטים שלא הושלמו בגלל timeout
    
    // Timer
    timeRemaining: level.initialTime,
    maxTime: level.initialTime,
    
    // History
    usedSentenceIds: [],
    mistakes: [], // Array of {sentence, wrongAnswer, correctAnswer, explanation}
    
    // Feedback
    showFeedback: false,
    currentFeedback: null,
  };
};

/**
 * מתחיל משחק חדש
 */
export const startGame = (gameState) => {
  const firstSentence = getNextSentence(gameState.levelId, []);
  
  return {
    ...gameState,
    isPlaying: true,
    isGameOver: false,
    currentSentence: firstSentence,
    usedSentenceIds: [firstSentence.id],
  };
};

/**
 * מטפל בבחירת תשובה
 */
export const handleAnswer = (gameState, selectedAnswer) => {
  const { currentSentence, levelConfig, currentBlankIndex, selectedAnswers } = gameState;
  
  if (!currentSentence) return gameState;

  // Check if this is a multiple blank sentence
  const isMultipleBlank = currentSentence.hasMultipleBlanks && currentSentence.blanks;
  
  if (isMultipleBlank) {
    const totalBlanks = currentSentence.blanks.length;
    const newSelectedAnswers = [...selectedAnswers, selectedAnswer];
    const newBlankIndex = currentBlankIndex + 1;

    // If not all blanks are filled yet
    if (newBlankIndex < totalBlanks) {
      return {
        ...gameState,
        currentBlankIndex: newBlankIndex,
        selectedAnswers: newSelectedAnswers,
      };
    }

    // All blanks filled - check answer
    const isCorrect = checkAnswer(currentSentence, newSelectedAnswers);
    const feedback = getAnswerFeedback(currentSentence, newSelectedAnswers, isCorrect);
    
    return processAnswerResult(gameState, isCorrect, feedback, levelConfig, newSelectedAnswers);
  }

  // Single blank
  const isCorrect = checkAnswer(currentSentence, selectedAnswer);
  const feedback = getAnswerFeedback(currentSentence, selectedAnswer, isCorrect);
  
  return processAnswerResult(gameState, isCorrect, feedback, levelConfig, [selectedAnswer]);
};

/**
 * מעבד את תוצאת התשובה (נכונה/שגויה)
 */
const processAnswerResult = (gameState, isCorrect, feedback, levelConfig, answers) => {
  const { currentSentence } = gameState;
  
  let newState = {
    ...gameState,
    totalAttempts: gameState.totalAttempts + 1,
  };

  if (isCorrect) {
    // Correct answer
    const earnedPoints = calculateScore(
      levelConfig.pointsPerCorrect,
      gameState.timeRemaining,
      gameState.maxTime
    );

    newState = {
      ...newState,
      correctAnswers: gameState.correctAnswers + 1,
      completedSentences: gameState.completedSentences + 1,
      score: gameState.score + earnedPoints,
      timeRemaining: Math.min(
        gameState.timeRemaining + levelConfig.timeBonus,
        gameState.maxTime
      ),
    };
  } else {
    // Wrong answer
    let detailedExplanation = feedback.explanation;
    
    // For single blank, get detailed explanation
    if (!currentSentence.hasMultipleBlanks) {
      detailedExplanation = getWrongAnswerExplanation(
        currentSentence.correctAnswer,
        answers[0],
        currentSentence.category
      );
    }

    newState = {
      ...newState,
      wrongAnswers: gameState.wrongAnswers + 1,
      lives: gameState.lives - 1,
      timeRemaining: Math.max(0, gameState.timeRemaining - levelConfig.timePenalty),
      mistakes: [
        ...gameState.mistakes,
        {
          sentence: currentSentence.sentence,
          wrongAnswer: currentSentence.hasMultipleBlanks ? answers : answers[0],
          correctAnswer: currentSentence.hasMultipleBlanks 
            ? currentSentence.blanks.map(b => b.correctAnswer)
            : currentSentence.correctAnswer,
          explanation: detailedExplanation,
          category: currentSentence.category || 'general',
        }
      ],
    };
  }

  // Show feedback
  newState = {
    ...newState,
    showFeedback: true,
    currentFeedback: {
      ...feedback,
      isCorrect,
      earnedPoints: isCorrect ? calculateScore(
        levelConfig.pointsPerCorrect,
        gameState.timeRemaining,
        gameState.maxTime
      ) : 0,
    },
  };

  return newState;
};

/**
 * מעבר למשפט הבא
 */
export const nextSentence = (gameState) => {
  // Check if game should end
  if (gameState.completedSentences >= gameState.totalSentences) {
    return {
      ...gameState,
      isPlaying: false,
      isGameOver: true,
      showFeedback: false,
      currentFeedback: null,
    };
  }

  if (gameState.lives <= 0) {
    return {
      ...gameState,
      isPlaying: false,
      isGameOver: true,
      showFeedback: false,
      currentFeedback: null,
    };
  }

  // Get next sentence
  const nextSent = getNextSentence(gameState.levelId, gameState.usedSentenceIds);

  return {
    ...gameState,
    currentSentence: nextSent,
    sentenceIndex: gameState.sentenceIndex + 1,
    usedSentenceIds: [...gameState.usedSentenceIds, nextSent.id],
    showFeedback: false,
    currentFeedback: null,
    currentBlankIndex: 0, // Reset for next sentence
    selectedAnswers: [], // Reset for next sentence
  };
};

/**
 * עדכון טיימר
 */
export const updateTimer = (gameState, deltaTime) => {
  if (!gameState.isPlaying || gameState.isPaused || gameState.showFeedback) {
    return gameState;
  }

  const newTime = Math.max(0, gameState.timeRemaining - deltaTime);

  // ✅ תיקון: Check if time ran out
  if (newTime <= 0) {
    // חשב כמה משפטים נותרו
    const remainingSentences = gameState.totalSentences - gameState.completedSentences;
    
    return {
      ...gameState,
      timeRemaining: 0,
      isPlaying: false,
      isGameOver: true,
      // ✅ עדכן totalAttempts לצורך חישוב דיוק נכון
      // אבל לא wrongAnswers (כי המשתמש לא טעה, פשוט לא הספיק)
      totalAttempts: gameState.totalAttempts + remainingSentences,
      incompleteSentences: remainingSentences,
    };
  }

  return {
    ...gameState,
    timeRemaining: newTime,
  };
};

/**
 * השהיה/המשך משחק
 */
export const togglePause = (gameState) => {
  return {
    ...gameState,
    isPaused: !gameState.isPaused,
  };
};

/**
 * איפוס המשחק
 */
export const resetGame = (levelId) => {
  return initializeGame(levelId);
};

/**
 * חישוב תוצאות סופיות
 */
export const getFinalResults = (gameState) => {
  const accuracy = calculateAccuracy(gameState.correctAnswers, gameState.totalAttempts);
  const levelCompleted = gameState.completedSentences >= gameState.totalSentences;

  console.log('Final results:', {
    completedSentences: gameState.completedSentences,
    totalSentences: gameState.totalSentences,
    levelCompleted,
    lives: gameState.lives,
    totalAttempts: gameState.totalAttempts,
    correctAnswers: gameState.correctAnswers,
    accuracy: accuracy + '%',
    incompleteSentences: gameState.incompleteSentences,
  }); // Debug

  return {
    levelId: gameState.levelId,
    levelCompleted,
    score: gameState.score,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    totalAttempts: gameState.totalAttempts,
    accuracy,
    livesLeft: gameState.lives,
    maxLives: gameState.maxLives,
    mistakes: gameState.mistakes,
    timeUsed: gameState.maxTime - gameState.timeRemaining,
    incompleteSentences: gameState.incompleteSentences, // ✅ מידע נוסף
  };
};