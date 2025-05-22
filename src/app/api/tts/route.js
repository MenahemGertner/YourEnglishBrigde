// app/api/tts/route.js
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const memoryCache = new Map();

// יצירת client גלובלי - מונע cold start
let globalClient = null;
const getClient = () => {
  if (!globalClient) {
    globalClient = new TextToSpeechClient();
  }
  return globalClient;
};

export async function POST(request) {
  try {
    const { 
      text, 
      speakingRate = 1.0 
    } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const languageCode = 'en-US';
    const voiceName = 'en-US-Neural2-F';
    
    const cacheKey = crypto
      .createHash('md5')
      .update(`${text}-${speakingRate}`)
      .digest('hex');
    
    if (memoryCache.has(cacheKey)) {
      const cachedAudio = memoryCache.get(cacheKey);
      return new NextResponse(cachedAudio, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    const client = getClient();
    
    const ttsRequest = {
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: parseFloat(speakingRate),
        pitch: 0,
        volumeGainDb: 0,
        effectsProfileId: ['headphone-class-device'],
        // הגדרות דחיסה לקבצים קטנים יותר
        sampleRateHertz: 16000, // במקום 24000 - איכות טובה אבל קובץ קטן יותר
      },
    };

    const [response] = await client.synthesizeSpeech(ttsRequest);
    const audioContent = response.audioContent;
    
    // הגבלת גודל המטמון - מונע זליגת זיכרון
    if (memoryCache.size > 100) {
      const firstKey = memoryCache.keys().next().value;
      memoryCache.delete(firstKey);
    }
    
    memoryCache.set(cacheKey, audioContent);
    
    return new NextResponse(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error in TTS service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}