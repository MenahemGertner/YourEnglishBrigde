// app/api/tts/route.js
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';
import 'dotenv/config';

// יצירת client גלובלי - ייווצר רק פעם אחת לכל serverless instance
let ttsClient = null;

// פונקציה ליצירת/קבלת client
function getTTSClient() {
  if (!ttsClient) {
    console.log('Creating new TTS client...');
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const credValue = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
      
      if (credValue.startsWith('./') || credValue.startsWith('/')) {
        ttsClient = new TextToSpeechClient({
          keyFilename: credValue
        });
        console.log('Using credentials file:', credValue);
      } else {
        const credentials = JSON.parse(credValue);
        ttsClient = new TextToSpeechClient({ credentials });
        console.log('Using JSON credentials from environment');
      }
    } else {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON not found');
    }
  }
  
  return ttsClient;
}

export async function POST(request) {
  console.log('=== TTS API Called ===', new Date().toISOString());
  
  try {
    const body = await request.json();
    const { text, speakingRate = 1.0 } = body;

    if (!text) {
      console.log('No text provided');
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    console.log('Processing text:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    console.log('Speaking rate:', speakingRate);

    // קבלת client (לא יוצר חדש בכל פעם)
    const client = getTTSClient();

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
    const startTime = Date.now();
    const [response] = await client.synthesizeSpeech(ttsRequest);
    const endTime = Date.now();
    
    console.log(`Google TTS completed in ${endTime - startTime}ms`);

    const audioContent = response.audioContent;

    if (!audioContent) {
      console.log('No audio content received');
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 });
    }

    console.log(`Audio generated successfully (${audioContent.length} bytes)`);
    
    return new NextResponse(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600', // cache בבראוזר לשעה
        'Content-Length': audioContent.length.toString()
      },
    });

  } catch (error) {
    console.error('=== TTS ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // אם זה שגיאת authentication, תן פרטים יותר טובים
    if (error.message.includes('authentication') || error.message.includes('credentials')) {
      console.error('Authentication issue - check your Google Cloud credentials');
    }

    return NextResponse.json({
      error: 'TTS service failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}