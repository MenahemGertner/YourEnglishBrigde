// app/api/tts/route.js - גירסה פשוטה לVercel
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

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
    
    // הגדרת credentials מ-environment variable
    let client;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      client = new TextToSpeechClient({ credentials });
    } else {
      // fallback למצב local development
      client = new TextToSpeechClient();
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
    console.error('Error details:', error);
    
    return NextResponse.json({ 
      error: 'TTS service failed',
      details: error.message
    }, { status: 500 });
  }
}