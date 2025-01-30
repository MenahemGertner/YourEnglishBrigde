// app/api/chat/route.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // בדיקת תקינות המפתח
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key format' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await request.json();
    const { message } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return new Response(
      JSON.stringify({ 
        message: completion.choices[0].message.content 
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    // שליחת הודעת שגיאה יותר ספציפית
    const errorMessage = error.response?.data?.error?.message || error.message;
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}