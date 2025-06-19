const CATEGORY_SIZE = 300;

export function getAdjacentIndex(currentIndex, direction) {
  const categoryNumber = Math.ceil(currentIndex / CATEGORY_SIZE);
  const categoryStart = (categoryNumber - 1) * CATEGORY_SIZE + 1;
  const categoryEnd = categoryStart + CATEGORY_SIZE;

  // אם הרשימות לא מלאות, ניתן להחליף לקוד הזה

// export function getAdjacentIndex(currentIndex, direction, categorySize) {
//     const categoryNumber = Math.ceil(currentIndex / 300);
//     const categoryStart = (categoryNumber - 1) * 300 + 1;
//     const categoryEnd = categoryStart + categorySize - 1;
  
    if (direction === 'next') {
      return currentIndex === categoryEnd ? null : currentIndex + 1;
    } else {
      return currentIndex === categoryStart ? null : currentIndex - 1;
    }
  }

