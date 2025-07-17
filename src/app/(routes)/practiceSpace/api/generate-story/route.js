require('dotenv').config(); // טוען את מפתח ה-API מהסביבה

export async function POST(request) {
  const { words } = await request.json();

  if (!words || !Array.isArray(words) || words.length === 0) {
    return Response.json({ message: 'Words array is required' }, { status: 400 });
  }

  try {
    const story = await generateStoryWithGPT(words);
    return Response.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return Response.json(
      { message: 'Failed to generate story', error: error.message },
      { status: 500 }
    );
  }
}

async function generateStoryWithGPT(words, retryCount = 0) {
  const MAX_RETRIES = 2;
  const OPENAI_TIMEOUT = 20000; // 20 שניות

  const prompt = createStoryPrompt(words);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 600,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that generates short stories in strict JSON format.'
          },
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
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const storyText = data.choices[0].message.content;

    return parseStoryResponse(storyText);

  } catch (error) {
    clearTimeout(timeoutId);

    if (retryCount < MAX_RETRIES && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      console.log(`Retrying GPT story generation, attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateStoryWithGPT(words, retryCount + 1);
    }

    throw error;
  }
}

function createStoryPrompt(words) {
  const wordsList = words.join(', ');

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
  try {
    const parsed = JSON.parse(responseText.trim());

    if (parsed.sentences && Array.isArray(parsed.sentences) && parsed.sentences.length === 5) {
      return parsed;
    }
  } catch (error) {
    console.log('Direct JSON parse failed, trying fallback parsing...');
  }

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

    if (parsed.sentences.length !== 5) {
      console.warn(`Expected 5 sentences, got ${parsed.sentences.length}`);
    }

    return parsed;

  } catch (error) {
    console.error('Error parsing story response:', error.message);

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
