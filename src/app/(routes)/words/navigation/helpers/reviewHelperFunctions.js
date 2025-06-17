export const intervals = { 
      2: 40,
      3: 15, 
      4: 7 
    };
    
export const categories = ['300', '600', '900', '1200', '1500']
  
export function getStartingIndexForCategory(category) {
    const indexMap = {
      '300': 1,
      '600': 301,
      '900': 601,
      '1200': 901,
      '1500': 1201
    };
    return indexMap[category] || 1;
  }

export const PRACTICE_THRESHOLD = 17;
