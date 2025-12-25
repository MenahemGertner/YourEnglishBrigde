// app/(routes)/(games)/prepositions/hooks/useGameState.js

import { useReducer, useCallback } from 'react';
import {
  initializeGame,
  startGame,
  handleAnswer,
  nextSentence,
  updateTimer,
  togglePause,
  resetGame,
  getFinalResults
} from '../lib/gameEngine';

// Action types
const ACTIONS = {
  START_GAME: 'START_GAME',
  SELECT_ANSWER: 'SELECT_ANSWER',
  NEXT_SENTENCE: 'NEXT_SENTENCE',
  UPDATE_TIMER: 'UPDATE_TIMER',
  TOGGLE_PAUSE: 'TOGGLE_PAUSE',
  RESET_GAME: 'RESET_GAME',
  CLOSE_FEEDBACK: 'CLOSE_FEEDBACK',
};

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_GAME:
      return startGame(state);

    case ACTIONS.SELECT_ANSWER:
      return handleAnswer(state, action.payload.answer);

    case ACTIONS.NEXT_SENTENCE:
      return nextSentence(state);

    case ACTIONS.UPDATE_TIMER:
      return updateTimer(state, action.payload.deltaTime);

    case ACTIONS.TOGGLE_PAUSE:
      return togglePause(state);

    case ACTIONS.RESET_GAME:
      return startGame(initializeGame(action.payload.levelId));

    case ACTIONS.CLOSE_FEEDBACK:
      return {
        ...state,
        showFeedback: false,
        currentFeedback: null,
      };

    default:
      return state;
  }
};

/**
 * Custom hook לניהול כל state של המשחק
 */
export const useGameState = (levelId) => {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    levelId,
    initializeGame
  );

  // Action creators
  const startGameAction = useCallback(() => {
    dispatch({ type: ACTIONS.START_GAME });
  }, []);

  const selectAnswer = useCallback((answer) => {
    dispatch({ type: ACTIONS.SELECT_ANSWER, payload: { answer } });
  }, []);

  const goToNextSentence = useCallback(() => {
    dispatch({ type: ACTIONS.NEXT_SENTENCE });
  }, []);

  const updateTimerAction = useCallback((deltaTime) => {
    dispatch({ type: ACTIONS.UPDATE_TIMER, payload: { deltaTime } });
  }, []);

  const togglePauseAction = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_PAUSE });
  }, []);

  const resetGameAction = useCallback((newLevelId) => {
    dispatch({ type: ACTIONS.RESET_GAME, payload: { levelId: newLevelId || levelId } });
  }, [levelId]);

  const closeFeedback = useCallback(() => {
    dispatch({ type: ACTIONS.CLOSE_FEEDBACK });
  }, []);

  // Get final results
  const finalResults = gameState.isGameOver ? getFinalResults(gameState) : null;

  return {
    // State
    gameState,
    finalResults,

    // Actions
    startGame: startGameAction,
    selectAnswer,
    nextSentence: goToNextSentence,
    updateTimer: updateTimerAction,
    togglePause: togglePauseAction,
    resetGame: resetGameAction,
    closeFeedback,
  };
};