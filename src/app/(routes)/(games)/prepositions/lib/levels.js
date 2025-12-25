// app/(routes)/(games)/prepositions/lib/levels.js

export const LEVELS = {
  1: {
    id: 1,
    name: "רמה 1 - יסודות",
    description: "in, on, at למקום וזמן",
    totalSentences: 15,
    initialTime: 120, // 2 דקות
    lives: 5,
    timeBonus: 5, // שניות שמתווספות על תשובה נכונה
    timePenalty: 8, // שניות שמופחתות על תשובה שגויה
    pointsPerCorrect: 10,
    difficulty: "easy",
    prepositionsPool: ["in", "on", "at"],
    numberOfOptions: 3,
  },
  2: {
    id: 2,
    name: "רמה 2 - התקדמות",
    description: "in, on, at + to, from",
    totalSentences: 18,
    initialTime: 120,
    lives: 5,
    timeBonus: 5,
    timePenalty: 10,
    pointsPerCorrect: 15,
    difficulty: "easy",
    prepositionsPool: ["in", "on", "at", "to", "from"],
    numberOfOptions: 4,
  },
  3: {
    id: 3,
    name: "רמה 3 - אתגר ראשון",
    description: "כל ה-prepositions של מקום וזמן",
    totalSentences: 20,
    initialTime: 110,
    lives: 4,
    timeBonus: 4,
    timePenalty: 10,
    pointsPerCorrect: 20,
    difficulty: "medium",
    prepositionsPool: ["in", "on", "at", "to", "from", "by"],
    numberOfOptions: 4,
  },
  4: {
    id: 4,
    name: "רמה 4 - משך זמן",
    description: "for, since, during, while",
    totalSentences: 18,
    initialTime: 110,
    lives: 4,
    timeBonus: 4,
    timePenalty: 12,
    pointsPerCorrect: 25,
    difficulty: "medium",
    prepositionsPool: ["for", "since", "during", "while"],
    numberOfOptions: 4,
  },
  5: {
    id: 5,
    name: "רמה 5 - שילוב",
    description: "שילוב של מקום, זמן ומשך",
    totalSentences: 22,
    initialTime: 100,
    lives: 4,
    timeBonus: 3,
    timePenalty: 12,
    pointsPerCorrect: 30,
    difficulty: "medium",
    prepositionsPool: ["in", "on", "at", "for", "since", "during"],
    numberOfOptions: 4,
  },
  6: {
    id: 6,
    name: "רמה 6 - כלים ואמצעים",
    description: "by, with, through, via",
    totalSentences: 20,
    initialTime: 100,
    lives: 3,
    timeBonus: 3,
    timePenalty: 15,
    pointsPerCorrect: 35,
    difficulty: "hard",
    prepositionsPool: ["by", "with", "through", "via"],
    numberOfOptions: 4,
  },
  7: {
    id: 7,
    name: "רמה 7 - משפטים מורכבים",
    description: "משפטים ארוכים יותר",
    totalSentences: 25,
    initialTime: 90,
    lives: 3,
    timeBonus: 2,
    timePenalty: 15,
    pointsPerCorrect: 40,
    difficulty: "hard",
    prepositionsPool: ["in", "on", "at", "for", "since", "during", "by", "with"],
    numberOfOptions: 4,
    allowMultipleBlanks: true, // משפטים עם 2 חללים ריקים
  },
  8: {
    id: 8,
    name: "רמה 8 - מאסטר",
    description: "כל ה-prepositions ביחד",
    totalSentences: 30,
    initialTime: 90,
    lives: 3,
    timeBonus: 2,
    timePenalty: 18,
    pointsPerCorrect: 50,
    difficulty: "expert",
    prepositionsPool: ["in", "on", "at", "to", "from", "by", "for", "since", "during", "while", "with", "through", "via"],
    numberOfOptions: 4,
    allowMultipleBlanks: true,
  },
};

export const getLevelById = (levelId) => {
  return LEVELS[levelId] || LEVELS[1];
};

export const getAllLevels = () => {
  return Object.values(LEVELS);
};

export const getNextLevel = (currentLevelId) => {
  const nextId = currentLevelId + 1;
  return LEVELS[nextId] || null;
};