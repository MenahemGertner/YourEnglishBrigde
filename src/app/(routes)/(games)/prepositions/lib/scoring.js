// app/(routes)/(games)/prepositions/lib/scoring.js

/**
 * חישוב ניקוד עבור תשובה נכונה
 * מתחשב במהירות התשובה
 */
export const calculateScore = (basePoints, timeLeft, maxTime) => {
  // Base points from level config
  let score = basePoints;

  // Speed bonus: if answered quickly, add bonus
  const timePercentage = (timeLeft / maxTime) * 100;
  
  if (timePercentage > 80) {
    // Very fast - 50% bonus
    score = Math.floor(score * 1.5);
  } else if (timePercentage > 60) {
    // Fast - 30% bonus
    score = Math.floor(score * 1.3);
  } else if (timePercentage > 40) {
    // Normal speed - 10% bonus
    score = Math.floor(score * 1.1);
  }
  // Below 40% - no bonus

  return score;
};

/**
 * חישוב ניקוד סופי עם בונוסים
 */
export const calculateFinalScore = (correctAnswers, totalScore, livesLeft, totalLives, levelCompleted) => {
  let finalScore = totalScore;

  // ✅ תיקון: Lives bonus - only if level completed
  if (livesLeft > 0 && levelCompleted) {
    const livesBonus = livesLeft * 50;
    finalScore += livesBonus;
  }

  // Completion bonus
  if (levelCompleted) {
    finalScore += 200;
  }

  // ✅ תיקון: Perfect game bonus (no mistakes AND level completed)
  if (livesLeft === totalLives && levelCompleted) {
    finalScore += 300;
  }

  return {
    baseScore: totalScore,
    livesBonus: (livesLeft > 0 && levelCompleted) ? livesLeft * 50 : 0,
    completionBonus: levelCompleted ? 200 : 0,
    perfectBonus: (livesLeft === totalLives && levelCompleted) ? 300 : 0,
    finalScore
  };
};

/**
 * חישוב אחוז הצלחה
 */
export const calculateAccuracy = (correctAnswers, totalAttempts) => {
  if (totalAttempts === 0) return 0;
  return Math.round((correctAnswers / totalAttempts) * 100);
};

/**
 * קביעת דירוג לפי הניקוד
 */
export const getRating = (accuracy, livesLeft, totalLives) => {
  if (accuracy === 100 && livesLeft === totalLives) {
    return {
      title: "מושלם! 🌟",
      message: "ביצוע פנטסטי! לא עשית אף טעות!",
      stars: 3
    };
  } else if (accuracy >= 90) {
    return {
      title: "מעולה! ⭐⭐⭐",
      message: "עבודה נהדרת! כמעט מושלם!",
      stars: 3
    };
  } else if (accuracy >= 75) {
    return {
      title: "טוב מאוד! ⭐⭐",
      message: "התקדמות יפה! עוד קצת תרגול ותהיה שם!",
      stars: 2
    };
  } else if (accuracy >= 60) {
    return {
      title: "לא רע! ⭐",
      message: "יש התקדמות, המשך לתרגל!",
      stars: 1
    };
  } else {
    return {
      title: "נסה שוב 💪",
      message: "אל תוותר! התרגול עושה את ההבדל!",
      stars: 0
    };
  }
};

/**
 * בדיקה אם השחקן עבר לרמה הבאה
 */
export const shouldUnlockNextLevel = (accuracy, levelCompleted) => {
  // Need at least 60% accuracy and to complete the level
  return levelCompleted && accuracy >= 60;
};