// כאשר הרשימות מלאות, ניתן להחליף בקוד הזה, כדי למנוע קריאת API מיותרת לגודל הרשימה.
// const CATEGORY_SIZE = 500;

// export function getAdjacentIndex(currentIndex, direction) {
//   const categoryNumber = Math.ceil(currentIndex / CATEGORY_SIZE);
//   const categoryStart = (categoryNumber - 1) * CATEGORY_SIZE + 1;
//   const categoryEnd = categoryStart + CATEGORY_SIZE;

export function getAdjacentIndex(currentIndex, direction, categorySize) {
    const categoryNumber = Math.ceil(currentIndex / 500);
    const categoryStart = (categoryNumber - 1) * 500 + 1;
    const categoryEnd = categoryStart + categorySize - 1;
  
    if (direction === 'next') {
      return currentIndex === categoryEnd ? null : currentIndex + 1;
    } else {
      return currentIndex === categoryStart ? null : currentIndex - 1;
    }
  }

