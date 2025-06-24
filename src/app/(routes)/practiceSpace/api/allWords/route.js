// app/practiceSpace/api/allWords/route.js
import { NextResponse } from 'next/server';
import { getUserWordsData } from '../../services/wordsService';

export async function GET(request) {
  try {
    const wordsData = await getUserWordsData();
    return NextResponse.json(wordsData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('להתחבר') ? 401 : 500 }
    );
  }
}