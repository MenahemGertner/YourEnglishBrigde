// lib/db/getWordByIndex.js - גרסה מהירה

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

// 🔥 פונקציה חדשה - קבל הרבה מילים בבת אחת!
export async function getWordsByIndices(indices) {
  const { db } = await connectToDatabase();
  
  // ארגן לפי קטגוריות
  const indicesByCategory = {
    '300': [],
    '600': [],
    '900': [],
    '1200': [],
    '1500': []
  };
  
  indices.forEach(index => {
    const category = getCategoryByIndex(index);
    if (category) {
      indicesByCategory[category].push(index);
    }
  });
  
  // קבל את כל המילים בשאילתה אחת לכל קטגוריה
  const allWords = [];
  
  for (const [category, categoryIndices] of Object.entries(indicesByCategory)) {
    if (categoryIndices.length === 0) continue;
    
    const objectIds = categoryIndices.map(idx => 
      new ObjectId(createCustomObjectId(idx))
    );
    
    const collection = db.collection(category);
    const words = await collection.find({ _id: { $in: objectIds } }).toArray();
    
    words.forEach(word => {
      word.category = category;
      word.wordForms = [word.word, ...(word.inf || [])];
    });
    
    allWords.push(...words);
  }
  
  // אסוף את כל ה-synonyms וה-confused IDs
  const allRelatedIds = new Set();
  allWords.forEach(word => {
    (word.syn || []).forEach(id => allRelatedIds.add(id));
    (word.con || []).forEach(id => allRelatedIds.add(id));
  });
  
  // טען את כל המילים הקשורות בשאילתה אחת
  const relatedWordsMap = {};
  
  if (allRelatedIds.size > 0) {
    const categories = ['300', '600', '900', '1200', '1500'];
    const relatedObjectIds = Array.from(allRelatedIds).map(id => new ObjectId(id));
    
    for (const cat of categories) {
      const relatedWords = await db.collection(cat).find({
        _id: { $in: relatedObjectIds }
      }).toArray();
      
      relatedWords.forEach(word => {
        relatedWordsMap[word._id.toString()] = {
          word: word.word,
          translation: word.tr,
          index: word.index
        };
      });
    }
  }
  
  // הוסף synonyms ו-confused לכל מילה
  allWords.forEach(word => {
    word.synonyms = (word.syn || [])
      .map(id => relatedWordsMap[id])
      .filter(Boolean);
    
    word.confused = (word.con || [])
      .map(id => relatedWordsMap[id])
      .filter(Boolean);
  });
  
  return allWords;
}

// הפונקציה המקורית - נשאר לתאימות לאחור
export async function getWordByIndex(index) {
  const words = await getWordsByIndices([index]);
  if (words.length === 0) throw new Error('Word not found');
  
  const wordData = words[0];
  const { db } = await connectToDatabase();
  const collection = db.collection(wordData.category);
  wordData.categorySize = await collection.countDocuments();
  
  return wordData;
}