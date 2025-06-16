import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// פונקציה לקביעת קטגוריה לפי אינדקס
function getCategoryByIndex(index) {
  if (index <= 500) return '500';
  if (index <= 1000) return '1000';
  if (index <= 1500) return '1500';
  if (index <= 2000) return '2000';
  if (index <= 2500) return '2500';
  return null; // אינדקס לא חוקי
}

// פונקציה ליצירת ObjectId מותאם
function createCustomObjectId(index) {
  return `f6dabc96ddf6dabc96dd${index.toString().padStart(4, '0')}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index'));
    
    // בדיקת תקינות האינדקס
    if (!index || index < 1 || index > 2500) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    // קביעת קטגוריה לפי אינדקס
    const currentCategory = getCategoryByIndex(index);
    if (!currentCategory) {
      return NextResponse.json({ error: 'Index out of range' }, { status: 400 });
    }

    // יצירת ObjectId מותאם
    const customObjectId = createCustomObjectId(index);
    
    // התחברות למסד הנתונים
    const { db } = await connectToDatabase();
    const collection = db.collection(currentCategory);
    
    // חיפוש המילה לפי ObjectId מותאם
    const wordData = await collection.findOne({ _id: new ObjectId(customObjectId) });
    
    if (!wordData) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    // שמירת גודל הקטגוריה
    const categorySize = await collection.countDocuments();

    // Create word_forms array from the word and its inflections
    const wordForms = [wordData.word, ...(wordData.inf || [])];
    wordData.wordForms = wordForms;

    // Populate synonyms
    if (wordData.syn && wordData.syn.length > 0) {
      const categories = ['500', '1000', '1500', '2000', '2500'];
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
      const categories = ['500', '1000', '1500', '2000', '2500'];
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

    // החזרת הנתונים עם מידע על הקטגוריה וגודלה
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