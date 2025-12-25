// app/(routes)/(games)/prepositions/lib/storage.js

const STORAGE_KEY = 'prepositions_game_progress';

/**
 * מבנה ברירת המחדל של נתוני השחקן
 */
const DEFAULT_PROGRESS = {
  highestUnlockedLevel: 1,
  levelScores: {}, // {1: {bestScore: 500, stars: 3, attempts: 5, lastPlayed: timestamp}}
  totalScore: 0,
  gamesPlayed: 0,
};

/**
 * קורא את התקדמות השחקן מ-localStorage
 */
export const loadProgress = () => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROGRESS;
    
    const progress = JSON.parse(saved);
    return { ...DEFAULT_PROGRESS, ...progress };
  } catch (error) {
    console.error('Error loading progress:', error);
    return DEFAULT_PROGRESS;
  }
};

/**
 * שומר את התקדמות השחקן ל-localStorage
 */
export const saveProgress = (progress) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

/**
 * בודק אם רמה מסוימת פתוחה
 */
export const isLevelUnlocked = (levelId) => {
  const progress = loadProgress();
  return levelId <= progress.highestUnlockedLevel;
};

/**
 * פותח רמה חדשה (אם היא הבאה בתור)
 */
export const unlockNextLevel = (currentLevel) => {
  const progress = loadProgress();
  const nextLevel = currentLevel + 1;
  
  if (nextLevel > progress.highestUnlockedLevel && nextLevel <= 8) {
    progress.highestUnlockedLevel = nextLevel;
    saveProgress(progress);
    return true;
  }
  
  return false;
};

/**
 * מחזיר את מספר הרמה הבאה (או null אם אין)
 */
export const getNextLevel = (currentLevel) => {
  const nextLevel = currentLevel + 1;
  return nextLevel <= 8 ? nextLevel : null;
};

/**
 * שומר תוצאות של רמה
 */
export const saveLevelResults = (levelId, results) => {
  const progress = loadProgress();
  
  console.log('Saving results:', { levelId, results }); // Debug
  
  // Get existing level data or create new
  const existingLevel = progress.levelScores[levelId] || {
    bestScore: 0,
    stars: 0,
    attempts: 0,
    completed: 0, // Number of successful completions
  };

  // Store previous values BEFORE updating
  const previousBestScore = existingLevel.bestScore;
  const previousStars = existingLevel.stars;
  const isNewBestScore = results.score > previousBestScore;

  // Calculate stars based on accuracy (only if level was completed)
  let stars = 0;
  if (results.levelCompleted) {
    if (results.accuracy >= 90) stars = 3;
    else if (results.accuracy >= 75) stars = 2;
    else if (results.accuracy >= 60) stars = 1;
  }

  console.log('Calculated stars:', stars); // Debug

  // Update level data
  const newLevelData = {
    bestScore: Math.max(existingLevel.bestScore, results.score),
    stars: Math.max(existingLevel.stars, stars),
    attempts: existingLevel.attempts + 1,
    completed: results.levelCompleted ? existingLevel.completed + 1 : existingLevel.completed,
    lastPlayed: Date.now(),
    lastAccuracy: results.accuracy,
    lastCompleted: results.levelCompleted,
  };

  progress.levelScores[levelId] = newLevelData;
  
  // Only count as "game played" if the level was completed
  if (results.levelCompleted) {
    progress.gamesPlayed += 1;
  }
  
  // Recalculate total score (sum of best scores)
  progress.totalScore = Object.values(progress.levelScores).reduce(
    (sum, level) => sum + level.bestScore,
    0
  );

  console.log('Saving progress:', progress); // Debug
  saveProgress(progress);
  
  return {
    isNewBestScore,
    previousBestScore,
    newStars: stars,
    previousStars,
  };
};

/**
 * מחזיר את הציון הטוב ביותר של רמה
 */
export const getLevelBestScore = (levelId) => {
  const progress = loadProgress();
  return progress.levelScores[levelId]?.bestScore || 0;
};

/**
 * מחזיר את מספר הכוכבים של רמה
 */
export const getLevelStars = (levelId) => {
  const progress = loadProgress();
  return progress.levelScores[levelId]?.stars || 0;
};

/**
 * מחזיר את כל נתוני הרמה
 */
export const getLevelData = (levelId) => {
  const progress = loadProgress();
  return progress.levelScores[levelId] || null;
};

/**
 * מחזיר סטטיסטיקות כלליות
 */
export const getOverallStats = () => {
  const progress = loadProgress();
  
  // Count levels that were actually completed successfully (with at least 1 star)
  const completedLevels = Object.values(progress.levelScores).filter(
    level => level.stars > 0 && level.completed > 0
  ).length;
  
  // Sum of all stars earned
  const totalStars = Object.values(progress.levelScores).reduce(
    (sum, level) => sum + level.stars,
    0
  );
  
  // Maximum possible stars (8 levels × 3 stars each)
  const maxPossibleStars = 24;
  
  return {
    highestUnlockedLevel: progress.highestUnlockedLevel,
    completedLevels, // Levels completed successfully
    totalScore: progress.totalScore, // Sum of best scores
    totalStars, // Stars earned
    maxStars: maxPossibleStars, // Maximum possible
    gamesPlayed: progress.gamesPlayed, // Only completed games
  };
};

/**
 * מאפס את כל ההתקדמות (לצורכי debug/testing)
 */
export const resetProgress = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * ייצוא התקדמות כ-JSON (לגיבוי)
 */
export const exportProgress = () => {
  const progress = loadProgress();
  return JSON.stringify(progress, null, 2);
};

/**
 * ייבוא התקדמות מ-JSON (משחזור גיבוי)
 */
export const importProgress = (jsonString) => {
  try {
    const progress = JSON.parse(jsonString);
    saveProgress(progress);
    return true;
  } catch (error) {
    console.error('Error importing progress:', error);
    return false;
  }
};