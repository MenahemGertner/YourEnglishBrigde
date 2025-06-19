import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

function getCategoryByIndex(index) {
  if (index <= 300) return '300';
  if (index <= 600) return '600';
  if (index <= 900) return '900';
  if (index <= 1200) return '1200';
  if (index <= 1500) return '1500';
  return null;
}

function createCustomObjectId(index) {
  return `f6dabc96ddf6dabc96dd${index.toString().padStart(4, '0')}`;
}

export async function getWordByIndex(index) {
  const { db } = await connectToDatabase();

  const category = getCategoryByIndex(index);
  if (!category) throw new Error('Invalid index');

  const customId = new ObjectId(createCustomObjectId(index));
  const collection = db.collection(category);

  const wordData = await collection.findOne({ _id: customId });
  if (!wordData) throw new Error('Word not found');

  const wordForms = [wordData.word, ...(wordData.inf || [])];
  wordData.wordForms = wordForms;

  const categories = ['300', '600', '900', '1200', '1500'];

  async function loadRelatedWords(ids) {
    const results = [];

    for (const id of ids || []) {
      for (const cat of categories) {
        const word = await db.collection(cat).findOne({ _id: new ObjectId(id) });
        if (word) {
          results.push({
            word: word.word,
            translation: word.tr,
            index: word.index,
          });
          break;
        }
      }
    }

    return results;
  }

  wordData.synonyms = await loadRelatedWords(wordData.syn);
  wordData.confused = await loadRelatedWords(wordData.con);
  wordData.category = category;
  wordData.categorySize = await collection.countDocuments();

  return wordData;
}
