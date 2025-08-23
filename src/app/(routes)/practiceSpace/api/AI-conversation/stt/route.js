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

    // קבלת FormData מה-request
    const formData = await request.formData();
    const audioFile = formData.get('audioFile');
    const model = formData.get('model') || 'whisper-1';
    const language = formData.get('language') || 'en';
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // יצירת FormData עבור OpenAI
    const openAIFormData = new FormData();
    openAIFormData.append('file', new File([audioFile], 'recording.wav', { type: 'audio/wav' }));
    openAIFormData.append('model', model);
    openAIFormData.append('language', language);

    // קריאה ל-OpenAI API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openAIFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { 
          error: 'OpenAI API error',
          details: error 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // החזרת התמלול
    return NextResponse.json({
      success: true,
      transcription: data.text,
      language: language
    });

  } catch (error) {
    console.error('STT API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}