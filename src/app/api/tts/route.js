// app/api/tts/route.js
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';
import 'dotenv/config';

export async function POST(request) {
  console.log('=== TTS API Called ===', new Date().toISOString());
  console.log('Environment check:', {
    hasCredentials: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    nodeEnv: process.env.NODE_ENV
  });

  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { text, speakingRate = 1.0 } = body;

    if (!text) {
      console.log('No text provided');
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    console.log('Creating TTS client...');

    // הגדרת credentials - תמיכה גם בקובץ וגם ב-JSON
    let client;
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const credValue = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
      
      // בדוק אם זה נתיב לקובץ (מתחיל ב-. או /)
      if (credValue.startsWith('./') || credValue.startsWith('/')) {
        // זה נתיב לקובץ - השתמש ב-keyFilename
        client = new TextToSpeechClient({
          keyFilename: credValue
        });
        console.log('Using credentials file:', credValue);
      } else {
        // זה JSON ישיר - parse אותו
        const credentials = JSON.parse(credValue);
        client = new TextToSpeechClient({ credentials });
        console.log('Using JSON credentials from environment');
      }
    } else {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON not found');
    }

    const ttsRequest = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Neural2-F'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: parseFloat(speakingRate)
      },
    };

    console.log('Calling Google TTS...');
    const [response] = await client.synthesizeSpeech(ttsRequest);
    console.log('Google TTS response received');

    const audioContent = response.audioContent;

    if (!audioContent) {
      console.log('No audio content received');
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 });
    }

    console.log('Returning audio response...');
    return new NextResponse(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg'
      },
    });

  } catch (error) {
    console.error('=== TTS ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    return NextResponse.json({
      error: 'TTS service failed',
      details: error.message
    }, { status: 500 });
  }
}