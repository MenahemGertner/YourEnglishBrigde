export function calculateNextReview(level, currentIndex) {
    // ודא שה-currentIndex הוא מספר
    currentIndex = parseInt(currentIndex);
  
    if (level === 1) return null;
    if (isNaN(currentIndex)) return null;
  
    const intervals = {
      2: 10,
      3: 5,
      4: 3
    };
  
    // ודא שה-level הוא מספר תקין
    const interval = intervals[level];
    if (!interval) return null;
  
    return currentIndex + interval;
  }