// src/scripts/list-words-1001-1500.js
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

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

async function listWords() {
  let client;
  
  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('מתחיל לסרוק מילים מאינדקס 1001 עד 1500...\n');
    
    const wordsList = [];
    const logLines = []; // שמירת כל השורות ללוג
    let foundCount = 0;
    let notFoundCount = 0;
    
    logLines.push('מתחיל לסרוק מילים מאינדקס 1001 עד 1500...\n');
    
    // עבור על כל אינדקס בטווח
    for (let index = 1001; index <= 1500; index++) {
      const objectId = createCustomObjectId(index);
      const category = getCategoryByIndex(index);
      
      if (!category) {
        const errorMsg = `❌ קטגוריה לא תקינה עבור אינדקס ${index}`;
        console.error(errorMsg);
        logLines.push(errorMsg);
        continue;
      }
      
      const collection = db.collection(category);
      
      // חיפוש המילה
      const wordDoc = await collection.findOne({ _id: new ObjectId(objectId) });
      
      if (wordDoc) {
        wordsList.push({
          index: index,
          word: wordDoc.word,
          tr: wordDoc.tr
        });
        foundCount++;
        const msg = "";
        // console.log(msg);
        // logLines.push(msg);
      } else {
        notFoundCount++;
        // אופציונלי: הצגת אינדקסים ריקים
        const msg = `${index}`;
        console.log(msg);
        logLines.push(msg);
      }
    }
    
    const separator = '='.repeat(50);
    const summary = [
      '',
      separator,
      '📊 סיכום:',
      `✅ מילים שנמצאו: ${foundCount}`,
      `⚪ אינדקסים ריקים: ${notFoundCount}`,
      `📝 סה"כ אינדקסים שנסרקו: ${1500 - 1001 + 1}`,
      separator
    ];
    
    summary.forEach(line => {
      console.log(line);
      logLines.push(line);
    });
    
    console.log('\n📋 רשימה מלאה של המילים:');
    console.log(JSON.stringify(wordsList, null, 2));
    
    logLines.push('');
    logLines.push('📋 רשימה מלאה של המילים:');
    logLines.push(JSON.stringify(wordsList, null, 2));
    
    // שמירה לקובץ
    const outputDir = path.join(__dirname, './output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const txtFileName = path.join(outputDir, `words-1001-1500-${timestamp}.txt`);
    const jsonFileName = path.join(outputDir, `words-1001-1500-${timestamp}.json`);
    
    // שמירת הלוג כטקסט
    fs.writeFileSync(txtFileName, logLines.join('\n'), 'utf8');
    console.log(`\n💾 הלוג נשמר ב: ${txtFileName}`);
    
    // שמירת הרשימה כ-JSON
    fs.writeFileSync(jsonFileName, JSON.stringify(wordsList, null, 2), 'utf8');
    console.log(`💾 רשימת המילים נשמרה ב: ${jsonFileName}`);
    
    return wordsList;
    
  } catch (error) {
    console.error('💥 שגיאה כללית:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔐 חיבור למונגו נסגר');
    }
  }
}

// הרצת הסקריפט
listWords()
  .then(() => {
    console.log('🎉 הסקריפט הושלם בהצלחה!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 שגיאה בהרצת הסקריפט:', error);
    process.exit(1);
  });