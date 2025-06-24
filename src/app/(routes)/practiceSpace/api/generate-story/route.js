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
async function generateStoryWithClaude(words) {
  const prompt = createStoryPrompt(words);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const storyText = data.content[0].text;
  
  return parseStoryResponse(storyText);
}

function createStoryPrompt(words) {
  const wordsList = words.join(', ');
  
  return `Create a coherent 5-sentence story using these English words: ${wordsList}

INSTRUCTIONS:
1. Story must flow naturally as one connected narrative
2. Adapt sentence complexity to word difficulty level - simple sentences for basic words, complex for advanced words
3. Every word from the list must appear at least once in the story - YOU CAN USE ANY FORM: original word, plural, past tense, -ing form, -ed form, comparative, superlative, etc.
4. Hebrew translations should be natural and contextually appropriate, not literal word-for-word translations
5. Return JSON format:
{
  "sentences": [
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"},
    {"english": "sentence", "hebrew": "תרגום"}
  ]
}`;}

function parseStoryResponse(responseText) {
  try {
    // נסה לחלץ JSON מהתשובה
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // אם לא נמצא JSON, נסה לפרסר את התשובה באופן ידני
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Error parsing story response:', error);
    // החזר סיפור ברירת מחדל במקרה של שגיאה
    return {
      sentences: [
        {
          english: "This is a sample story created when the AI response couldn't be parsed.",
          hebrew: "זהו סיפור לדוגמה שנוצר כאשר תגובת הAI לא יכלה להיות מפוענחת."
        },
        {
          english: "Please try again with your word list.",
          hebrew: "אנא נסה שוב עם רשימת המילים שלך."
        },
        {
          english: "The system will generate a new story for you.",
          hebrew: "המערכת תיצור עבורך סיפור חדש."
        },
        {
          english: "Each story is unique and personalized.",
          hebrew: "כל סיפור הוא ייחודי ומותאם אישית."
        },
        {
          english: "Thank you for your patience with the learning process.",
          hebrew: "תודה על הסבלנות שלך עם תהליך הלמידה."
        }
      ]
    };
  }
}