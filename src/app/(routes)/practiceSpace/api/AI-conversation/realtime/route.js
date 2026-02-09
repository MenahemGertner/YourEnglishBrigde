export async function POST(request) {
  try {
    const { sdp, challengingWords } = await request.json();

    if (!sdp) {
      return Response.json({ error: 'SDP is required' }, { status: 400 });
    }

    const wordsText = challengingWords?.length > 0 
      ? challengingWords.join(', ')
      : 'various English words';

    // ✅ פרומפט משופר המבוסס על הגישה הישנה שלך
    const instructions = `You are an encouraging English practice teacher having a natural conversation with a beginner student.

## YOUR MISSION
Help the student practice these challenging words: ${wordsText}

## CONVERSATION STRUCTURE (INTERNAL - DON'T MENTION)
This is a 5-message conversation:

MESSAGE 1 (Opening):
- Welcome warmly (1 sentence)
- Naturally use 1-2 challenging words from the list (or inflected forms like "running" from "run")
- Ask an engaging question
- Keep it 2-3 sentences maximum

MESSAGES 2-4 (Main conversation):
- Respond naturally to what the student said
- Use 1-2 challenging words naturally when they fit the context
- Gently correct grammar mistakes conversationally (vary your style: "You mean...", "Just so you know...", "Great! Also you can say...")
- Keep YOUR language simple except for target words
- End with a follow-up question
- Stay encouraging and supportive
- 1-3 sentences maximum

MESSAGE 5 (Closing):
- First, respond naturally to what the student just said (1 sentence)
- Praise their effort and specific strengths you noticed (thoughtful questions, clear communication, creative insights)
- End with encouraging goodbye
- 3-4 sentences maximum
- DO NOT ask questions or suggest "next time"

## CORE RULES
✅ DO:
- Use challenging words naturally (when context fits)
- Keep YOUR language SIMPLE except target vocabulary
- Correct mistakes gently and conversationally
- Vary your correction style (don't repeat "You mean..." every time)
- End with follow-up questions (except message 5)
- Stay warm and encouraging

❌ DON'T:
- Use complex grammar or vocabulary (except target words)
- Be robotic or repetitive
- Over-explain
- Ask multiple questions at once
- Force challenging words awkwardly
- Continue conversation in message 5

## LANGUAGE
- Speak ONLY in English
- Even if student uses another language, respond in simple English

## TONE
Warm, patient, encouraging - like a friendly teacher who genuinely cares about the student's progress`;

    const sessionConfig = {
      session: {
        type: 'realtime',
        model: 'gpt-realtime',
        instructions: instructions,
        audio: {
          input: {
            turn_detection: null,  // ✅ ממשיך עם "לחץ והחזק"
            transcription: {
              model: 'whisper-1',
              language: 'en',
              prompt: `
Transcribe only clear human speech.
Ignore silence, breathing, and background noise.
Do not guess words when speech has not started.
`

            }
          },
          output: { 
            voice: 'alloy'
          }
        }
      }
    };

    const keyResponse = await fetch(
      'https://api.openai.com/v1/realtime/client_secrets',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionConfig),
      }
    );

    if (!keyResponse.ok) {
      const errorText = await keyResponse.text();
      console.error('❌ Failed to get ephemeral key:', errorText);
      return Response.json(
        { error: `Failed to get ephemeral key: ${errorText}` }, 
        { status: keyResponse.status }
      );
    }

    const { value: ephemeralKey } = await keyResponse.json();
    console.log('✅ Got ephemeral key');

    const sdpResponse = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ephemeralKey}`,
        'Content-Type': 'application/sdp',
      },
      body: sdp,
    });

    if (!sdpResponse.ok) {
      const errorText = await sdpResponse.text();
      console.error('❌ OpenAI SDP Error:', errorText);
      return Response.json(
        { error: `OpenAI API Error: ${errorText}` }, 
        { status: sdpResponse.status }
      );
    }

    const answerSdp = await sdpResponse.text();
    
    const location = sdpResponse.headers.get('Location');
    const callId = location?.split('/').pop();
    
    console.log('✅ Session created, Call ID:', callId);

    return new Response(answerSdp, {
      headers: { 
        'Content-Type': 'application/sdp',
        'X-Call-ID': callId || ''
      }
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}