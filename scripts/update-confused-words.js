// src/scripts/update-confused-words.js
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config(); // אם אתה משתמש ב-dotenv

// הגדרות חיבור למונגו
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

// חיבור למונגו
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 5,
      minPoolSize: 1,
      socketTimeoutMS: 20000,
      waitQueueTimeoutMS: 5000
    });
    
    await client.connect();
    const db = client.db(MONGODB_DB);
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

// הכנס כאן את רשימת הזוגות שלך
const CONFUSED_PAIRS = `
521: 'wall' <-> 664: 'block'
`;

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

function parsePairs(pairsText) {
  const pairs = [];
  const lines = pairsText.split('\n').filter(line => line.trim() && !line.startsWith('//'));
  
  for (const line of lines) {
    const match = line.match(/(\d+):\s*'([^']+)'\s*<->\s*(\d+):\s*'([^']+)'/);
    if (match) {
      const [, index1, word1, index2, word2] = match;
      pairs.push({
        index1: parseInt(index1),
        word1: word1,
        index2: parseInt(index2),
        word2: word2
      });
    }
  }
  
  return pairs;
}

async function updateConfusedWords() {
  let client;
  
  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    const pairs = parsePairs(CONFUSED_PAIRS);
    
    console.log(`מעבד ${pairs.length} זוגות מילים...`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const pair of pairs) {
      try {
        const { index1, word1, index2, word2 } = pair;
        
        // יצירת ObjectIds
        const objectId1 = createCustomObjectId(index1);
        const objectId2 = createCustomObjectId(index2);
        
        // קבלת קטגוריות
        const category1 = getCategoryByIndex(index1);
        const category2 = getCategoryByIndex(index2);
        
        if (!category1 || !category2) {
          console.error(`❌ קטגוריה לא תקינה עבור ${index1} או ${index2}`);
          errorCount++;
          continue;
        }
        
        // חיבור לאוספים
        const collection1 = db.collection(category1);
        const collection2 = db.collection(category2);
        
        // בדיקה אם המילים קיימות
        const word1Doc = await collection1.findOne({ _id: new ObjectId(objectId1) });
        const word2Doc = await collection2.findOne({ _id: new ObjectId(objectId2) });
        
        if (!word1Doc) {
          console.error(`❌ מילה ${index1}: '${word1}' לא נמצאה`);
          errorCount++;
          continue;
        }
        
        if (!word2Doc) {
          console.error(`❌ מילה ${index2}: '${word2}' לא נמצאה`);
          errorCount++;
          continue;
        }
        
        // בדיקה אם הקשרים כבר קיימים
        const word1HasConnection = word1Doc.con && word1Doc.con.includes(objectId2);
        const word2HasConnection = word2Doc.con && word2Doc.con.includes(objectId1);
        
        let updated = false;
        
        // עדכון מילה 1
        if (!word1HasConnection) {
          await collection1.updateOne(
            { _id: new ObjectId(objectId1) },
            { $addToSet: { syn: objectId2 } }
          );
          console.log(`✅ הוסף ${objectId2} למילה ${index1}: '${word1}'`);
          updated = true;
        } else {
          console.log(`⏭️  הקשר כבר קיים במילה ${index1}: '${word1}'`);
        }
        
        // עדכון מילה 2
        if (!word2HasConnection) {
          await collection2.updateOne(
            { _id: new ObjectId(objectId2) }, // תיקון: צריך להיות objectId2 ולא objectId1
            { $addToSet: { syn: objectId1 } }
          );
          console.log(`✅ הוסף ${objectId1} למילה ${index2}: '${word2}'`);
          updated = true;
        } else {
          console.log(`⏭️  הקשר כבר קיים במילה ${index2}: '${word2}'`);
        }
        
        if (updated) {
          successCount++;
        } else {
          skipCount++;
        }
        
      } catch (error) {
        console.error(`❌ שגיאה בעיבוד זוג ${pair.index1}-${pair.index2}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 סיכום:');
    console.log(`✅ זוגות שעודכנו בהצלחה: ${successCount}`);
    console.log(`⏭️  זוגות שדולגו (כבר קיימים): ${skipCount}`);
    console.log(`❌ שגיאות: ${errorCount}`);
    console.log(`📝 סה"כ זוגות שעובדו: ${pairs.length}`);
    
  } catch (error) {
    console.error('💥 שגיאה כללית:', error);
    throw error;
  } finally {
    // סגירת החיבור
    if (client) {
      await client.close();
      console.log('🔐 חיבור למונגו נסגר');
    }
  }
}

// הרצת הסקריפט
updateConfusedWords()
  .then(() => {
    console.log('🎉 הסקריפט הושלם בהצלחה!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 שגיאה כללית:', error);
    process.exit(1);
  });