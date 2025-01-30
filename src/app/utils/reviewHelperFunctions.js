// utils/reviewHelperFunctions.js

export function calculateNextReview(currentPosition, level, isEndOfList, existingNextReview) {
    // No review for level 1 (new words)
    if (level === 1) return null;
    
    // Intervals for different learning levels
    const intervals = { 
      2: 10,  // First review after 10 steps
      3: 5,   // Second review after 5 steps
      4: 3    // Subsequent reviews after 3 steps
    };
    
    const interval = intervals[level] || 0;
    
    // If at end of list, increment from existing next review
    if (isEndOfList) {
      return existingNextReview + interval;
    }
    
    // Standard case: add interval to current position
    return currentPosition + interval;
  }
  
  export function prioritizeReviewWords(words, currentIndex) {
    return words
      .filter(word => 
        // Exclude current word
        word.word_id !== currentIndex &&
        // Check if word is due for review
        word.next_review <= currentIndex
      )
      .sort((a, b) => {
        // Primary sort: by learning level (higher level = higher priority)
        if (a.level !== b.level) {
          return b.level - a.level;
        }
        
        // Secondary sort: by next review time
        return a.next_review - b.next_review;
      });
  }
  
  export function isPartOfLearningSequence(currentIndex, learningSequencePointer) {
    return (
      parseInt(currentIndex) === learningSequencePointer ||
      parseInt(currentIndex) === learningSequencePointer - 1
    );
  }

  export function getCategoryForIndex(index) {
    if (index >= 0 && index <= 500) return '500';
    if (index > 500 && index <= 1000) return '1000';
    if (index > 1000 && index <= 1500) return '1500';
    if (index > 1500 && index <= 2000) return '2000';
    if (index > 2000 && index <= 2500) return '2500';
    return null;
  }
  
  export function getCategoryBounds(category) {
    const bounds = {
      '500': [1, 500],
      '1000': [501, 1000],
      '1500': [1001, 1500],
      '2000': [1501, 2000],
      '2500': [2001, 2500]
    };
    return bounds[category];
  }
  
  export function getStartingIndexForCategory(category) {
    const indexMap = {
      '500': 1,
      '1000': 501,
      '1500': 1001,
      '2000': 1501,
      '2500': 2001
    };
    return indexMap[category] || 1;
  }
  
  export function getNextCategory(currentCategory) {
    const categories = ['500', '1000', '1500', '2000', '2500'];
    const currentIndex = categories.indexOf(currentCategory);
    return currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;
  }

export const PRACTICE_THRESHOLD = 10;
