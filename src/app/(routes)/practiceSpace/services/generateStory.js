// services/generateStory.js

export async function generateStoryFromWords(words, options = {}) {
  // Simple validation
  if (!words || !Array.isArray(words) || words.length === 0) {
    throw new Error('Valid words array is required');
  }

  // חילוץ רמת הקושי (ברירת מחדל: 3)
  const level = options.level || 3;
  
  // וולידציה של רמת הקושי
  if (typeof level !== 'number' || level < 1 || level > 5) {
    throw new Error('Level must be a number between 1 and 5');
  }

  const TIMEOUT_DURATION = 25000; // 25 seconds
  const MAX_RETRIES = 2;
  
  let lastError = null;
  
  // Simple retry loop
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
    
    try {
      const response = await fetch('/practiceSpace/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          words, 
          options: { level } // שליחת רמת הקושי בתוך אובייקט options
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      // Basic validation
      if (!data.story?.sentences || !Array.isArray(data.story.sentences)) {
        throw new Error('Invalid story format received');
      }
      
      // הוספת מידע על רמת הקושי לתשובה (אופציונלי)
      return {
        ...data.story,
        metadata: {
          level: level,
          levelDescription: getLevelDescription(level)
        }
      };
      
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      
      // Don't retry on timeout for last attempt
      if (attempt === MAX_RETRIES || error.name === 'AbortError') {
        break;
      }
      
      // Wait 1 second before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Retrying story generation, attempt ${attempt + 1}`);
    }
  }
  
  // Handle final error
  if (lastError?.name === 'AbortError') {
    throw new Error('Story generation timed out - please try again');
  }
  
  throw new Error(`Failed to generate story: ${lastError?.message || 'Unknown error'}`);
}

// פונקציה עזר לקבלת תיאור הרמה
function getLevelDescription(level) {
  const descriptions = {
    1: 'קל מאוד - משפטים קצרים ופשוטים',
    2: 'קל - משפטים בסיסיים',
    3: 'בינוני - משפטים מורכבים יותר',
    4: 'קשה - משפטים מתקדמים',
    5: 'קשה מאוד - משפטים מורכבים ומאתגרים'
  };
  return descriptions[level] || 'רמה לא מוגדרת';
}