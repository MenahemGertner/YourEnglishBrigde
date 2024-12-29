import { connectToDatabase } from '../../../app/utils/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
   try {
     const { searchParams } = new URL(request.url);
     const index = searchParams.get('index');

     console.log('Received ID:', index);

     if (!index) {
       return NextResponse.json(
         { error: 'No ID provided' },
         { status: 400 }
       );
     }

     const { db } = await connectToDatabase();
     const categories = ['500', '1000', '1500'];

     let wordData = null;
     for (const category of categories) {
       const collection = db.collection(category);
       wordData = await collection.findOne({ index: parseInt(index) });

       console.log(`Searching in ${category} collection:`, wordData);

       if (wordData) break;
     }

     if (!wordData) {
       console.log('Word not found in any category');
       return NextResponse.json(
         { error: 'Word not found' },
         { status: 404 }
       );
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
     console.error('Full error details:', error);
     return NextResponse.json(
       { error: 'Failed to connect to database', details: error.message },
       { status: 500 }
     );
   }
}