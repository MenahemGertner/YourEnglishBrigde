require('dotenv').config(); // טוען מפתח API מהסביבה

export async function POST(request) {
  const { sentences } = await request.json();

  if (!sentences || !Array.isArray(sentences) || sentences.length === 0) {
    return Response.json({ message: 'Sentences array is required' }, { status: 400 });
  }

  try {
    const question = await generateQuestionWithGPT(sentences);
    return Response.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    return Response.json(
      { message: 'Failed to generate question', error: error.message },
      { status: 500 }
    );
  }
}

async function generateQuestionWithGPT(sentences, retryCount = 0) {
  const MAX_RETRIES = 2;
  const OPENAI_TIMEOUT = 15000; // 15 שניות

  const prompt = createQuestionPrompt(sentences);
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
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'You are a teaching assistant who writes multiple choice reading comprehension questions in strict JSON.'
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
    const questionText = data.choices[0].message.content;

    return parseQuestionResponse(questionText);

  } catch (error) {
    clearTimeout(timeoutId);

    if (retryCount < MAX_RETRIES && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      console.log(`Retrying GPT question generation, attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateQuestionWithGPT(sentences, retryCount + 1);
    }

    throw error;
  }
}

function createQuestionPrompt(sentences) {
  const storyText = sentences.join(' ');

  return `Based on this English story, create ONE multiple choice reading comprehension question with 4 options.

STORY:
${storyText}

INSTRUCTIONS:
1. Create a question that tests understanding of the story content
2. Question should be about main ideas, details, or logical conclusions
3. Provide 4 answer options - don't worry about order, they will be shuffled
4. Only ONE option should be correct
5. Make incorrect options plausible but clearly wrong
6. Return ONLY valid JSON, no additional text

{
  "question": "Your question here?",
  "options": [
    "Option 1",
    "Option 2", 
    "Option 3",
    "Option 4"
  ],
  "correctAnswer": "The correct option text exactly as it appears in options"
}`;
}

function parseQuestionResponse(responseText) {
  try {
    const parsed = JSON.parse(responseText.trim());

    if (parsed.question && parsed.options && Array.isArray(parsed.options) &&
        parsed.options.length === 4 && parsed.correctAnswer) {

      if (parsed.options.includes(parsed.correctAnswer)) {
        return parsed;
      }
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

    if (!parsed.question || !parsed.options || !Array.isArray(parsed.options) ||
        parsed.options.length !== 4 || !parsed.correctAnswer) {
      throw new Error('Invalid question structure');
    }

    if (!parsed.options.includes(parsed.correctAnswer)) {
      throw new Error('Correct answer not found in options');
    }

    return parsed;

  } catch (error) {
    console.error('Error parsing question response:', error.message);

    return {
      question: "What is the main theme of the story?",
      options: [
        "Adventure and exploration",
        "Friendship and cooperation", 
        "Learning and growth",
        "Mystery and discovery"
      ],
      correctAnswer: "Learning and growth"
    };
  }
}
