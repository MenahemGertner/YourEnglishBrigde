// function calculateNextReview(currentPosition, level) {
//     if (level === 1) return null;
//     if (isNaN(currentPosition)) return null;
    
//     const intervals = {
//       2: 10,
//       3: 5,
//       4: 3
//     };
    
//     const interval = intervals[level];
//     if (!interval) return null;
    
//     // נחשב את המרווח הבא מהמיקום הנוכחי ברצף
//     return currentPosition + interval;
//   }