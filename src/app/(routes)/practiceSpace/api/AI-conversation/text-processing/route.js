// /practiceSpace/api/AI-conversation/text-processing/route.js
require('dotenv').config();

export async function POST(request) {
  const { text, conversationContext, challengingWords, stage } = await request.json();

  // אפשר text ריק רק לשלבי פתיחה וסגירה
  if (stage !== 'opening' && stage !== 'closing' && (!text || text.trim() === '')) {
    return Response.json({ message: 'Text is required' }, { status: 400 });
  }

  // קביעת stage אוטומטית אם לא סופק
  const conversationStage = stage || determineStage(conversationContext);

  try {
    const processedText = await processTextWithGPT(text, conversationContext, challengingWords, conversationStage);
    return Response.json({ processedText });
  } catch (error) {
    console.error('Error processing text:', error);
    return Response.json(
      { message: 'Failed to process text', error: error.message },
      { status: 500 }
    );
  }
}

function determineStage(conversationContext) {
  if (!conversationContext || conversationContext.length === 0) {
    return 'opening';
  }
  
  // ספירת הודעות שלמות
  const completedMessages = conversationContext.filter(msg => 
    msg.role && msg.content && msg.content.trim() !== ''
  );
  
  // סיום אחרי 7 הודעות (כשהמשתמש אומר את משפט מספר 8)
  if (completedMessages.length >= 7) {
    return 'closing';
  }
  
  return 'middle';
}

// פונקציות פרומפט נפרדות
function getOpeningPrompt(challengingWords = []) {
  const wordsText = challengingWords.length > 0 
    ? `\n\nCHALLENGING WORDS TO INTRODUCE: ${challengingWords.join(', ')}`
    : '';

  return `You are starting an English practice conversation with a beginner student.

TASK: Create a warm opening message that naturally introduces challenging vocabulary.

STRUCTURE:
- Welcome the student (1 sentence)
- Naturally use 1-2 challenging words from the list below
- Ask an engaging question to start the conversation
- Keep everything else VERY simple

TONE: Warm, encouraging teacher

Keep total message to 2-3 sentences maximum.${wordsText}`;
}

function getMainPrompt(challengingWords = []) {
  const wordsText = challengingWords.length > 0 
    ? `\n\nCHALLENGING WORDS TO USE: ${challengingWords.join(', ')}\n- Use these words naturally when they fit the conversation context\n- These are the words the student is trying to learn\n- Help them learn by using these words in clear, natural sentences`
    : '';

  return `You are an English learning assistant in active conversation with a student.

CORE MISSION: Help them practice challenging vocabulary through natural conversation.

EVERY RESPONSE MUST:
- Use 1-2 challenging words naturally (if they fit the context)
- Gently correct any grammar mistakes using format: "Great! You could also say: [correct version]"
- Keep YOUR language simple except for the target words
- End with a follow-up question
- Stay encouraging and supportive

MESSAGE LENGTH: 1-3 sentences maximum

TONE: Supportive, friendly, like a kind English teacher.${wordsText}`;
}

function getClosingPrompt(challengingWords = []) {
  const wordsText = challengingWords.length > 0 
    ? `\n\nCHALLENGING WORDS PRACTICED: ${challengingWords.join(', ')}`
    : '';
  
  return `Time to end this English practice conversation positively.

TASK: Create an encouraging wrap-up message that:

STRUCTURE:
1. First, respond naturally to what the student just said (1 sentence)
2. Then transition to closing with praise for their effort
3. 3. IF the student personally used any challenging words in their own responses during the conversation, mention one of them specifically with praise
4. End with an encouraging goodbye

KEEP IT: Short, positive, simple language except for vocabulary words
Maximum 3-4 sentences total.${wordsText}`;
}

// הפונקציה הראשית שבוחרת את הפרומפט הנכון
function createSystemPrompt(challengingWords = [], stage = 'middle') {
  switch(stage) {
    case 'opening':
      return getOpeningPrompt(challengingWords);
    
    case 'closing':
      return getClosingPrompt(challengingWords);
    
    default: // 'middle'
      return getMainPrompt(challengingWords);
  }
}

async function processTextWithGPT(text, conversationContext = [], challengingWords = [], stage = 'middle', retryCount = 0) {
  const MAX_RETRIES = 2;
  const OPENAI_TIMEOUT = 20000; // 20 שניות

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT);

  try {
    // בניית ההודעות עם ההקשר השיחה
    const messages = [
      {
        role: 'system',
        content: createSystemPrompt(challengingWords, stage)
      }
    ];

    // הוספת הקשר היסטוריה רק אם זה לא פתיחה
    if (stage !== 'opening') {
      messages.push(...conversationContext);
    }
    
    // הוספת ההודעה החדשה של המשתמש רק אם יש טקסט
    if (text && text.trim() !== '') {
      messages.push({
        role: 'user',
        content: text
      });
    }

    console.log('Messages being sent to OpenAI:', {
      stage,
      messagesCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 50) + '...'
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-chat-latest',
        max_tokens: 600,
        temperature: 0.5,
        messages: messages
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const processedText = data.choices[0].message.content;

    return processedText.trim();

  } catch (error) {
    clearTimeout(timeoutId);

    if (retryCount < MAX_RETRIES && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      console.log(`Retrying text processing, attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return processTextWithGPT(text, conversationContext, challengingWords, stage, retryCount + 1);
    }

    throw error;
  }
}