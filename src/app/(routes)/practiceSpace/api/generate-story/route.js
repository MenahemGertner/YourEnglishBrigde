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
    // נסה לחלץ JSON חוקי בלבד
    const startIndex = responseText.indexOf('{');
    const endIndex = responseText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error('No valid JSON boundaries found');
    }

    const jsonSubstring = responseText.substring(startIndex, endIndex + 1).trim();

    // בדוק האם זו מחרוזת JSON תקינה
    const parsed = JSON.parse(jsonSubstring);

    if (!parsed.sentences || !Array.isArray(parsed.sentences)) {
      throw new Error('Parsed object missing "sentences" array');
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing story response:', error.message, responseText);

    return {
      sentences: [
        {
          english: "This is a fallback story because the AI response could not be parsed.",
          hebrew: "זהו סיפור ברירת מחדל כי לא ניתן היה לפענח את תגובת ה-AI."
        },
        {
          english: "Try again with the same words or refresh the page.",
          hebrew: "נסה שוב עם אותן מילים או רענן את הדף."
        },
        {
          english: "The system might return a better response next time.",
          hebrew: "המערכת עשויה להחזיר תגובה טובה יותר בפעם הבאה."
        },
        {
          english: "Sorry for the inconvenience.",
          hebrew: "סליחה על חוסר הנוחות."
        },
        {
          english: "Thank you for your understanding.",
          hebrew: "תודה על ההבנה."
        }
      ]
    };
  }
}
