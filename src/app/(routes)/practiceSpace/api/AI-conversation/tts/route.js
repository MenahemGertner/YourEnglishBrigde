import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // בדיקה שה API key קיים
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // קבלת הנתונים מה-request
    const { text, model = 'tts-1', voice = 'alloy', speed = 1.0 } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // קריאה ל-OpenAI API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: voice,
        speed: speed
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { 
          error: 'OpenAI API error',
          details: error 
        },
        { status: response.status }
      );
    }

    // קבלת הנתונים כ-ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    
    // החזרת קובץ האודיו
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}