import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    
    // Get word from MongoDB
    const { db } = await connectToDatabase();
    const categories = ['500', '1000', '1500', '2000', '2500'];
    
    let wordData = null;
    let categorySize = 0;
    let currentCategory = '';

    // מציאת הקטגוריה המתאימה והמילה
    for (const category of categories) {
      const collection = db.collection(category);
      wordData = await collection.findOne({ index: parseInt(index) });
      
      if (wordData) {
        // שמירת גודל הקטגוריה
        categorySize = await collection.countDocuments();
        currentCategory = category;
        break;
      }
    }
    
    if (!wordData) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    // Create word_forms array from the word and its inflections
    const wordForms = [wordData.word, ...(wordData.inf || [])];
    wordData.wordForms = wordForms;

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

    // הוספת המידע על הקטגוריה וגודלה
    return NextResponse.json({
      ...wordData,
      category: currentCategory,
      categorySize: categorySize
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word data', details: error.message },
      { status: 500 }
    );
  }
}