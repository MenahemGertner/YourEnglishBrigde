export async function generateStoryFromWords(words) {
  // יצירת AbortController עבור timeout ארוך יותר
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 שניות

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.story;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request took too long - please try again');
    }
    
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story');
  }
}