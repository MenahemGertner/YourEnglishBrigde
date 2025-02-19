export const intervals = { 
      2: 15,
      3: 6, 
      4: 3 
    };
    
export const categories = ['500', '1000', '1500', '2000', '2500']
  
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

export const PRACTICE_THRESHOLD = 17;
