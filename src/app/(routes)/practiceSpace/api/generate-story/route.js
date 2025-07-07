export async function POST(request) {
  const { words } = await request.json();
  
  if (!words || !Array.isArray(words) || words.length === 0) {
    return Response.json({ message: 'Words array is required' }, { status: 400 });
  }
  
  try {
    const story = await generateStoryWithClaude(words);
    return Response.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return Response.json(
      { message: 'Failed to generate story', error: error.message },
      { status: 500 }
    );
  }
}

async function generateStoryWithClaude(words, retryCount = 0) {
  const MAX_RETRIES = 2;
  const CLAUDE_TIMEOUT = 20000; // 20 שניות
  
  const prompt = createStoryPrompt(words);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLAUDE_TIMEOUT);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600, // מופחת מ-800 להאצה
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const storyText = data.content[0].text;
    
    return parseStoryResponse(storyText);
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // retry logic
    if (retryCount < MAX_RETRIES && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      console.log(`Retrying story generation, attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // המתנה של שנייה
      return generateStoryWithClaude(words, retryCount + 1);
    }
    
    throw error;
  }
}

function createStoryPrompt(words) {
  const wordsList = words.join(', ');
  
  // prompt מקוצר ומיועל למהירות
  return `Create a coherent 5-sentence story using these English words: ${wordsList}

INSTRUCTIONS:
1. Story must flow naturally as one connected narrative
2. Use every word from the list (any form: original, plural, -ing, -ed, comparative, etc)
3. Hebrew translations should be natural and contextually appropriate
4. Return ONLY valid JSON, no additional text
{
  "sentences": [
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"}
  ]
}`;
}

function parseStoryResponse(responseText) {
  // נסיון ראשון: JSON נקי ישירות
  try {
    const parsed = JSON.parse(responseText.trim());
    
    if (parsed.sentences && Array.isArray(parsed.sentences) && parsed.sentences.length === 5) {
      return parsed;
    }
  } catch (error) {
    console.log('Direct JSON parse failed, trying fallback parsing...');
  }
  
  // fallback: פרסינג מורכב במקרה של כשלון
  try {
    const startIndex = responseText.indexOf('{');
    const endIndex = responseText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error('No valid JSON boundaries found');
    }
    
    const jsonSubstring = responseText.substring(startIndex, endIndex + 1).trim();
    const parsed = JSON.parse(jsonSubstring);
    
    if (!parsed.sentences || !Array.isArray(parsed.sentences)) {
      throw new Error('Parsed object missing "sentences" array');
    }
    
    // וידוא שיש בדיוק 5 משפטים
    if (parsed.sentences.length !== 5) {
      console.warn(`Expected 5 sentences, got ${parsed.sentences.length}`);
    }
    
    return parsed;
    
  } catch (error) {
    console.error('Error parsing story response:', error.message);
    
    // fallback story איכותי
    return {
      sentences: [
        {
          english: "The system encountered a temporary issue while creating your personalized story.",
          hebrew: "המערכת נתקלה בבעיה זמנית בעת יצירת הסיפור המותאם אישית שלך."
        },
        {
          english: "Please try generating a new story using the refresh button above.",
          hebrew: "אנא נסה ליצור סיפור חדש באמצעות כפתור הרענון למעלה."
        },
        {
          english: "Your vocabulary words are still being processed and will be included in the next attempt.",
          hebrew: "מילות האוצר שלך עדיין מעובדות ויכללו בניסיון הבא."
        },
        {
          english: "Thank you for your patience as we work to improve the experience.",
          hebrew: "תודה על הסבלנות שלך בעודנו עובדים לשיפור החוויה."
        },
        {
          english: "The story generation feature will be back to normal shortly.",
          hebrew: "תכונת יצירת הסיפורים תחזור לפעול כרגיל בקרוב."
        }
      ]
    };
  }
}


