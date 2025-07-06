export async function generateStoryFromWords(words) {
  // timeout מותאם לסביבת הייצור של Vercel
  const TIMEOUT_DURATION = 25000; // 25 שניות - פחות מה-30 של Vercel Pro
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
  
  try {
    const response = await fetch('/practiceSpace/api/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // טיפול משופר בשגיאות HTTP
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // וידוא שהמבנה תקין
    if (!data.story || !data.story.sentences) {
      throw new Error('Invalid story format received');
    }
    
    return data.story;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Story generation timed out - please try again');
    }
    
    // לוג מפורט יותר לדיבוג
    console.error('Error generating story:', {
      message: error.message,
      stack: error.stack,
      words: words.length
    });
    
    throw new Error(`Failed to generate story: ${error.message}`);
  }
}