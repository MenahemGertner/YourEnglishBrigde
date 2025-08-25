require('dotenv').config(); // טוען מפתח API מהסביבה

export async function POST(request) {
  const { sentence, difficultWords } = await request.json();

  if (!sentence || typeof sentence !== 'string' || sentence.trim().length === 0) {
    return Response.json({ message: 'Sentence is required' }, { status: 400 });
  }

  try {
    const feedback = await checkWritingWithGPT(sentence, difficultWords);
    return Response.json({ feedback });
  } catch (error) {
    console.error('Error checking writing:', error);
    return Response.json(
      { message: 'Failed to check writing', error: error.message },
      { status: 500 }
    );
  }
}

async function checkWritingWithGPT(sentence, difficultWords = [], retryCount = 0) {
  const MAX_RETRIES = 2;
  const OPENAI_TIMEOUT = 15000; // 15 שניות

  const prompt = createWritingCheckPrompt(sentence, difficultWords);
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
        model: 'gpt-5-chat-latest',
        max_tokens: 300,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: 'You are an English writing tutor who provides constructive feedback on student writing in Hebrew. Focus on grammar, vocabulary usage, and sentence structure.'
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
    const feedbackText = data.choices[0].message.content;

    return parseFeedbackResponse(feedbackText);

  } catch (error) {
    clearTimeout(timeoutId);

    if (retryCount < MAX_RETRIES && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      console.log(`Retrying GPT writing check, attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return checkWritingWithGPT(sentence, difficultWords, retryCount + 1);
    }

    throw error;
  }
}

function createWritingCheckPrompt(sentence, difficultWords) {
  const difficultWordsList = difficultWords && difficultWords.length > 0 
    ? difficultWords.join(', ') 
    : 'sophisticated vocabulary';

  return `Please check this English sentence written by a Hebrew-speaking student and provide feedback in Hebrew.

SENTENCE TO CHECK:
"${sentence}"

DIFFICULT WORDS TO LOOK FOR:
${difficultWordsList}

INSTRUCTIONS:
1. Check for grammar errors and suggest corrections
2. Evaluate vocabulary usage, especially difficult words
3. Assess sentence structure and clarity
4. Provide encouragement and specific suggestions for improvement
5. If the sentence uses difficult words correctly, praise that
6. If there are errors, explain them clearly but kindly
7. Respond in Hebrew with constructive feedback
8. Keep feedback concise but helpful (2-3 sentences)

Return ONLY valid JSON with your feedback in Hebrew:

{
  "feedback": "Your Hebrew feedback here",
  "score": "good/fair/needs_improvement",
  "hasErrors": true/false,
  "suggestions": "Optional specific suggestions in Hebrew"
}`;
}

function parseFeedbackResponse(responseText) {
  try {
    const parsed = JSON.parse(responseText.trim());

    if (parsed.feedback && typeof parsed.feedback === 'string') {
      return {
        feedback: parsed.feedback,
        score: parsed.score || 'fair',
        hasErrors: parsed.hasErrors || false,
        suggestions: parsed.suggestions || ''
      };
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

    if (!parsed.feedback || typeof parsed.feedback !== 'string') {
      throw new Error('Invalid feedback structure');
    }

    return {
      feedback: parsed.feedback,
      score: parsed.score || 'fair',
      hasErrors: parsed.hasErrors || false,
      suggestions: parsed.suggestions || ''
    };

  } catch (error) {
    console.error('Error parsing feedback response:', error.message);

    // fallback response
    return {
      feedback: "תודה על הכתיבה! המשפט שלך נראה טוב, אך יש מקום לשיפור בדקדוק ובמבנה. המשך להתאמן עם מילים קשות והקפד על שימוש נכון בזמנים.",
      score: 'fair',
      hasErrors: true,
      suggestions: "נסה לקרוא את המשפט בקול רם ובדוק אם הוא נשמע טבעי"
    };
  }
}