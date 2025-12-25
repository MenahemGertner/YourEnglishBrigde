// app/(routes)/(games)/prepositions/lib/sentences/index.js

import { level1Sentences } from './level1';
import { level2Sentences } from './level2';
import { level3Sentences } from './level3';
import { level4Sentences } from './level4';
import { level5Sentences } from './level5';
import { level6Sentences } from './level6';
import { level7Sentences } from './level7';
import { level8Sentences } from './level8';

export const SENTENCES_BY_LEVEL = {
  1: level1Sentences,
  2: level2Sentences,
  3: level3Sentences,
  4: level4Sentences,
  5: level5Sentences,
  6: level6Sentences,
  7: level7Sentences,
  8: level8Sentences,
};

/**
 * מחזיר את כל המשפטים עבור רמה מסוימת
 */
export const getSentencesForLevel = (levelId) => {
  return SENTENCES_BY_LEVEL[levelId] || [];
};

/**
 * מחזיר משפט רנדומלי מרמה מסוימת
 */
export const getRandomSentence = (levelId, excludeIds = []) => {
  const sentences = getSentencesForLevel(levelId);
  
  if (sentences.length === 0) return null;

  // Filter out already used sentences
  const availableSentences = sentences.filter(s => !excludeIds.includes(s.id));
  
  if (availableSentences.length === 0) {
    // If all sentences were used, start over
    return sentences[Math.floor(Math.random() * sentences.length)];
  }

  const randomIndex = Math.floor(Math.random() * availableSentences.length);
  return availableSentences[randomIndex];
};

/**
 * מערבב מערך (Fisher-Yates shuffle)
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * מחזיר את המשפטים של רמה בסדר מעורבב
 */
export const getShuffledSentences = (levelId) => {
  const sentences = getSentencesForLevel(levelId);
  return shuffleArray(sentences);
};