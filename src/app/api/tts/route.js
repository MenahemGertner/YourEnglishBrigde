// app/api/tts/route.js - גירסה מיועלת עם Connection Reuse
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

// שמירת החיבור בזיכרון (יחיה כל עוד השרת רץ)
let ttsClient = null;
let clientInitTime = null;

// פונקציה לקבלת Client מתוח או יצירת חדש
const getTtsClient = () => {
  // אם עבר יותר מ-30 דקות מאז יצירת החיבור, צור חדש
  const CLIENT_TIMEOUT = 30 * 60 * 1000; // 30 דקות
  const now = Date.now();
  
  if (!ttsClient || !clientInitTime || (now - clientInitTime) > CLIENT_TIMEOUT) {
    console.log('Creating new TTS client...');
    
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        ttsClient = new TextToSpeechClient({ 
          credentials,
          // אופטימיזציות לחיבור
          grpc: {
            'grpc.keepalive_time_ms': 30000,      // שלח keepalive כל 30 שניות
            'grpc.keepalive_timeout_ms': 5000,    // חכה 5 שניות לתגובה
            'grpc.keepalive_permit_without_calls': true, // אפשר keepalive גם בלי calls
            'grpc.http2.max_pings_without_data': 0,
            'grpc.http2.min_time_between_pings_ms': 10000,
            'grpc.http2.min_ping_interval_without_data_ms': 300000
          }
        });
      } else {
        // fallback למצב local development  
        ttsClient = new TextToSpeechClient();
      }
      
      clientInitTime = now;
      console.log(`TTS client created successfully at ${new Date(clientInitTime).toISOString()}`);
      
    } catch (error) {
      console.error('Error creating TTS client:', error);
      ttsClient = null;
      clientInitTime = null;
      throw error;
    }
  }
  
  return ttsClient;
};

export async function POST(request) {
  const startTime = Date.now();
  console.log('=== TTS API Called ===', new Date().toISOString());
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { 
      text, 
      speakingRate = 1.0,
      languageCode = 'en-US',
      voiceName = 'en-US-Neural2-F'
    } = body;
    
    if (!text) {
      console.log('No text provided');
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // קבל את ה-client (קיים או חדש)
    const client = getTtsClient();
    
    const ttsRequest = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: parseFloat(speakingRate)
      },
    };

    console.log('Calling Google TTS with existing client...');
    const ttsStartTime = Date.now();
    
    const [response] = await client.synthesizeSpeech(ttsRequest);
    
    const ttsEndTime = Date.now();
    console.log(`Google TTS response received in ${ttsEndTime - ttsStartTime}ms`);
    
    const audioContent = response.audioContent;
    
    if (!audioContent) {
      console.log('No audio content received');
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 });
    }

    const totalTime = Date.now() - startTime;
    console.log(`Total request processed in ${totalTime}ms`);
    
    return new NextResponse(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600', // Cache למשך שעה
        'X-Processing-Time': totalTime.toString()
      },
    });
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('=== TTS ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error occurred after:', totalTime + 'ms');
    
    // אם השגיאה קשורה לחיבור, אפס את ה-client
    if (error.message.includes('UNAVAILABLE') || 
        error.message.includes('DEADLINE_EXCEEDED') ||
        error.code === 14) {
      console.log('Connection error detected, resetting client...');
      ttsClient = null;
      clientInitTime = null;
    }
    
    return NextResponse.json({
      error: 'TTS service failed',
      details: error.message,
      processingTime: totalTime
    }, { status: 500 });
  }
}

// פונקציה לניקוי החיבור (אופציונלית)
export async function DELETE() {
  console.log('Manually closing TTS client...');
  
  if (ttsClient) {
    try {
      await ttsClient.close();
    } catch (error) {
      console.error('Error closing TTS client:', error);
    }
  }
  
  ttsClient = null;
  clientInitTime = null;
  
  return NextResponse.json({ message: 'TTS client closed' });
}