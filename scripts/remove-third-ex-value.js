// src/scripts/remove-third-ex-value.js
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// הגדרות חיבור למונגו
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

// *** הגדרת טווח לבדיקה ***
// אם תרצה לבדוק טווח מסוים, הגדר כאן:
const TEST_RANGE = {
  enabled: true,     // שנה ל-false כדי לרוץ על כל האוסף
  startIndex: 601,     // אינדקס התחלה
  endIndex: 1500       // אינדקס סיום
};

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

// קבלת קטגוריה לפי אינדקס
function getCategoryByIndex(index) {
  if (index <= 300) return '300';
  if (index <= 600) return '600';
  if (index <= 900) return '900';
  if (index <= 1200) return '1200';
  if (index <= 1500) return '1500';
  return null;
}

// הסרת הערך השלישי מהשדה ex
function removeThirdExValue(exObject) {
  if (!exObject || typeof exObject !== 'object') {
    return { modified: false, exObject };
  }

  const keys = Object.keys(exObject);
  if (keys.length <= 2) {
    // אם יש 2 ערכים או פחות, לא צריך לעשות כלום
    return { modified: false, exObject };
  }

  // מחיקת הערך השלישי (האחרון)
  const thirdKey = keys[2];
  delete exObject[thirdKey];
  
  return { modified: true, exObject, deletedKey: thirdKey };
}

// בדיקת מספר הערכים בשדה ex
function countExValues(exObject) {
  if (!exObject || typeof exObject !== 'object') {
    return 0;
  }
  return Object.keys(exObject).length;
}

// עדכון מסמכי המילים
async function removeThirdExValues() {
  let client;
  
  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('🚀 מתחיל עדכון שדה ex...');
    
    if (TEST_RANGE.enabled) {
      console.log(`🔍 מצב בדיקה: טווח ${TEST_RANGE.startIndex}-${TEST_RANGE.endIndex}`);
    } else {
      console.log('📊 מצב מלא: עבור על כל האוסף (1-1500)');
    }
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    let totalProcessed = 0;
    
    // קביעת הטווח
    const startIndex = TEST_RANGE.enabled ? TEST_RANGE.startIndex : 1;
    const endIndex = TEST_RANGE.enabled ? TEST_RANGE.endIndex : 1500;
    
    console.log(`\n📈 מעבד מילים מאינדקס ${startIndex} עד ${endIndex}...\n`);
    
    for (let index = startIndex; index <= endIndex; index++) {
      try {
        totalProcessed++;
        
        // קבלת קטגוריה
        const category = getCategoryByIndex(index);
        if (!category) {
          console.error(`❌ קטגוריה לא תקינה עבור אינדקס ${index}`);
          errorCount++;
          continue;
        }
        
        // יצירת ObjectId
        const objectId = `f6dabc96ddf6dabc96dd${index.toString().padStart(4, '0')}`;
        
        // חיבור לאוסף
        const collection = db.collection(category);
        
        // קבלת המסמך
        const document = await collection.findOne({ _id: new ObjectId(objectId) });
        
        if (!document) {
          console.error(`❌ מסמך לא נמצא עבור אינדקס ${index}`);
          errorCount++;
          continue;
        }
        
        // בדיקת מספר הערכים בשדה ex
        const currentExCount = countExValues(document.ex);
        
        if (currentExCount <= 2) {
          console.log(`⏭️  מילה ${index} (${document.word}): יש כבר ${currentExCount} ערכים בלבד`);
          skipCount++;
          continue;
        }
        
        // שמירת מצב לפני השינוי
        const originalKeys = Object.keys(document.ex);
        
        // הסרת הערך השלישי
        const result = removeThirdExValue(document.ex);
        
        if (!result.modified) {
          console.log(`⏭️  מילה ${index} (${document.word}): לא נדרש שינוי`);
          skipCount++;
          continue;
        }
        
        // עדכון המסמך
        await collection.updateOne(
          { _id: new ObjectId(objectId) },
          { $set: { ex: result.exObject } }
        );
        
        console.log(`✅ מילה ${index} (${document.word}): נמחק הערך "${result.deletedKey}"`);
        console.log(`   לפני: ${JSON.stringify(originalKeys)}`);
        console.log(`   אחרי: ${JSON.stringify(Object.keys(result.exObject))}`);
        
        successCount++;
        
      } catch (error) {
        console.error(`❌ שגיאה בעיבוד מילה ${index}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 סיכום:');
    console.log(`✅ מילים שעודכנו בהצלחה: ${successCount}`);
    console.log(`⏭️  מילים שדולגו (כבר היו 2 ערכים או פחות): ${skipCount}`);
    console.log(`❌ שגיאות: ${errorCount}`);
    console.log(`📝 סה"כ מילים שעובדו: ${totalProcessed}`);
    
    if (TEST_RANGE.enabled) {
      console.log('\n🔍 זה היה מצב בדיקה. כדי לרוץ על כל האוסף:');
      console.log('   שנה את TEST_RANGE.enabled ל-false');
    }
    
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
removeThirdExValues()
  .then(() => {
    console.log('🎉 הסקריפט הושלם בהצלחה!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 שגיאה כללית:', error);
    process.exit(1);
  });