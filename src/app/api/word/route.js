import { connectToDatabase } from '../../../app/utils/mongodb';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    
    // קבל את המילה ממונגו
    const { db } = await connectToDatabase();
    const categories = ['500', '1000', '1500', '2000', '2500'];
    
    let wordData = null;
    for (const category of categories) {
      const collection = db.collection(category);
      wordData = await collection.findOne({ index: parseInt(index) });
      if (wordData) break;
    }

    if (!wordData) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    // אם המשתמש מחובר, הוסף את נתוני הלמידה שלו
    if (session?.user) {
      const { data: userWord } = await supabase
        .from('user_words')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('word_id', parseInt(index))
        .single();

      if (userWord) {
        wordData.learningStatus = {
          level: userWord.level,
          lastSeen: userWord.last_seen,
          nextReview: userWord.next_review
        };
      }
    }

     // Populate synonyms
     if (wordData.syn && wordData.syn.length > 0) {
       const synonymWords = await Promise.all(
         wordData.syn.map(async (synId) => {
           for (const category of categories) {
             const collection = db.collection(category);
             const synonymWord = await collection.findOne({ 
               _id: new ObjectId(synId) 
             });
             if (synonymWord) return synonymWord;
           }
         })
       );
       wordData.synonyms = synonymWords
         .filter(Boolean)
         .map(word => ({
           word: word.word,
           translation: word.tr,
           index: word.index
         }));
     } else {
       wordData.synonyms = [];
     }

     // Populate confused words
     if (wordData.con && wordData.con.length > 0) {
       const confusedWords = await Promise.all(
         wordData.con.map(async (conId) => {
           for (const category of categories) {
             const collection = db.collection(category);
             const confusedWord = await collection.findOne({ 
               _id: new ObjectId(conId) 
             });
             if (confusedWord) return confusedWord;
           }
         })
       );
       wordData.confused = confusedWords
         .filter(Boolean)
         .map(word => ({
           word: word.word,
           translation: word.tr,
           index: word.index
         }));
     } else {
       wordData.confused = [];
     }

     return NextResponse.json(wordData);
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch word data', details: error.message },
        { status: 500 }
      );
    }
  }