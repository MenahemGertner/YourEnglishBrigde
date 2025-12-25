// app/(routes)/(games)/prepositions/lib/sentenceGenerator.js

import { getSentencesForLevel } from './sentences';

/**
 * מערבב אופציות תשובה
 */
const shuffleOptions = (options) => {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * מחזיר משפט רנדומלי מרמה, עם אופציות מעורבבות
 */
export const getNextSentence = (levelId, usedSentenceIds = []) => {
  const sentences = getSentencesForLevel(levelId);
  
  if (!sentences || sentences.length === 0) {
    return null;
  }

  // Filter out used sentences
  let availableSentences = sentences.filter(s => !usedSentenceIds.includes(s.id));
  
  // If all sentences were used, reset and use all
  if (availableSentences.length === 0) {
    availableSentences = [...sentences];
  }

  // Pick random sentence
  const randomIndex = Math.floor(Math.random() * availableSentences.length);
  const sentence = availableSentences[randomIndex];

  // Shuffle options
  const shuffledOptions = shuffleOptions(sentence.options);

  return {
    ...sentence,
    options: shuffledOptions
  };
};

/**
 * יוצר מערך של משפטים מעורבבים לכל הרמה
 * שימושי אם רוצים לתת למשתמש את אותם המשפטים בסדר מעורבב
 */
export const generateLevelSentences = (levelId, count) => {
  const sentences = getSentencesForLevel(levelId);
  
  if (!sentences || sentences.length === 0) {
    return [];
  }

  // Create shuffled copy
  const shuffled = [...sentences].sort(() => Math.random() - 0.5);
  
  // Take only the requested count, or all if count is larger
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  // If we need more sentences than available, cycle through again
  if (count > shuffled.length) {
    const remaining = count - shuffled.length;
    const additional = shuffled.slice(0, remaining);
    selected.push(...additional);
  }

  // Shuffle options for each sentence
  return selected.map(sentence => ({
    ...sentence,
    options: shuffleOptions(sentence.options)
  }));
};

/**
 * בודק אם התשובה נכונה
 * תומך גם במשפטים עם בלנק אחד וגם במספר בלנקים
 */
export const checkAnswer = (sentence, selectedAnswers) => {
  // If sentence has multiple blanks
  if (sentence.hasMultipleBlanks && sentence.blanks) {
    // Check if all answers are provided
    if (!Array.isArray(selectedAnswers) || selectedAnswers.length !== sentence.blanks.length) {
      return false;
    }
    
    // Check if all answers are correct
    return selectedAnswers.every((answer, index) => {
      return answer === sentence.blanks[index].correctAnswer;
    });
  }
  
  // Single blank - backward compatibility
  const answer = Array.isArray(selectedAnswers) ? selectedAnswers[0] : selectedAnswers;
  return sentence.correctAnswer === answer;
};

/**
 * מחזיר הסבר מדוע התשובה שגויה (אם רלוונטי)
 */
export const getAnswerFeedback = (sentence, selectedAnswers, isCorrect) => {
  if (isCorrect) {
    return {
      isCorrect: true,
      message: "נכון! 🎉",
      explanation: null
    };
  }

  // Wrong answer - handle multiple blanks
  if (sentence.hasMultipleBlanks && sentence.blanks) {
    const answers = Array.isArray(selectedAnswers) ? selectedAnswers : [selectedAnswers];
    
    // Find which blank was wrong
    const wrongBlanks = sentence.blanks
      .map((blank, index) => ({
        ...blank,
        index,
        selectedAnswer: answers[index],
        isWrong: answers[index] !== blank.correctAnswer
      }))
      .filter(blank => blank.isWrong);

    if (wrongBlanks.length > 0) {
      const firstWrong = wrongBlanks[0];
      return {
        isCorrect: false,
        message: `התשובה הנכונה לחלל ${firstWrong.index + 1} היא: "${firstWrong.correctAnswer}"`,
        explanation: firstWrong.explanation,
        correctAnswer: sentence.blanks.map(b => b.correctAnswer),
        wrongAnswer: answers,
        wrongBlankIndex: firstWrong.index
      };
    }
  }

  // Single blank
  const answer = Array.isArray(selectedAnswers) ? selectedAnswers[0] : selectedAnswers;
  return {
    isCorrect: false,
    message: `התשובה הנכונה היא: "${sentence.correctAnswer}"`,
    explanation: sentence.explanation,
    correctAnswer: sentence.correctAnswer,
    wrongAnswer: answer
  };
};