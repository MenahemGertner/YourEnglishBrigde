// src/scripts/update-word-indexes.js
const { MongoClient, ObjectId } = require('mongodb');
const readline = require('readline');
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

// יצירת ממשק לקבלת קלט מהמשתמש
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// פונקציה לשאול שאלה ולקבל תשובה
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

// מיפוי המרות האינדקסים (אינדקס ישן -> אינדקס חדש)
const INDEX_MAPPING = {
  1070: 1097, 1073: 1100, 1238: 1012, 1351: 1130, 1353: 1174,
  1359: 1257, 1377: 1190, 1391: 1327, 1396: 1086, 1400: 1087
};

// חיבור למונגו
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 30000,
      waitQueueTimeoutMS: 10000
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
  // אינדקסים זמניים - טווח 5000-6500
  if (index >= 5000 && index <= 5300) return '300';
  if (index >= 5000 && index <= 5600) return '600';
  if (index >= 5000 && index <= 5900) return '900';
  if (index >= 5000 && index <= 6200) return '1200';
  if (index >= 5000 && index <= 6500) return '1500';
  return null;
}

// יצירת ObjectId מאינדקס
function createCustomObjectId(index) {
  return `f6dabc96ddf6dabc96dd${index.toString().padStart(4, '0')}`;
}

function createObjectId(index) {
  const hexString = createCustomObjectId(index);
  return new ObjectId(hexString);
}

// שלב 1: העברה לאינדקסים זמניים
async function moveToTemporaryIndexes(db, mappings) {
  console.log('\n🔄 שלב 1: העברה לאינדקסים זמניים (5000+)');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const [oldIndexStr, newIndexStr] of mappings) {
    const oldIndex = parseInt(oldIndexStr);
    const tempIndex = 5000 + oldIndex;  // אינדקס זמני (5000-6500)
    
    try {
      const oldCategory = getCategoryByIndex(oldIndex);
      const tempCategory = getCategoryByIndex(tempIndex);
      
      if (!oldCategory || !tempCategory) {
        const error = `קטגוריה לא תקינה: ${oldIndex} -> ${tempIndex}`;
        console.error(`❌ ${error}`);
        errors.push({ index: oldIndex, error });
        errorCount++;
        continue;
      }
      
      const oldCollection = db.collection(oldCategory);
      const tempCollection = db.collection(tempCategory);
      
      // קבלת המסמך הישן
      const oldId = createObjectId(oldIndex);
      const document = await oldCollection.findOne({ _id: oldId });
      
      if (!document) {
        const error = `מסמך לא נמצא: ${oldIndex}`;
        console.error(`❌ ${error}`);
        errors.push({ index: oldIndex, error });
        errorCount++;
        continue;
      }
      
      // בדיקה שהאינדקס הזמני פנוי
      const tempId = createObjectId(tempIndex);
      const existingTemp = await tempCollection.findOne({ _id: tempId });
      
      if (existingTemp) {
        const error = `אינדקס זמני כבר תפוס: ${tempIndex}`;
        console.error(`❌ ${error}`);
        errors.push({ index: oldIndex, error });
        errorCount++;
        continue;
      }
      
      // יצירת מסמך חדש עם אינדקס זמני
      const newDocument = {
        ...document,
        _id: tempId,
        index: tempIndex,
        _originalIndex: oldIndex,  // שמירת האינדקס המקורי
        _targetIndex: parseInt(newIndexStr)  // שמירת האינדקס היעד
      };
      
      // הכנסת המסמך החדש
      await tempCollection.insertOne(newDocument);
      
      // מחיקת המסמך הישן
      await oldCollection.deleteOne({ _id: oldId });
      
      console.log(`✅ ${oldIndex} (${document.word}) -> זמני ${tempIndex}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ שגיאה בהעברת ${oldIndex}:`, error.message);
      errors.push({ index: oldIndex, error: error.message });
      errorCount++;
    }
  }
  
  console.log(`\n📊 סיכום שלב 1: ✅ ${successCount} | ❌ ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  שגיאות שנמצאו:');
    errors.forEach(e => console.log(`   - ${e.index}: ${e.error}`));
  }
  
  return { successCount, errorCount, errors };
}

// שלב 2: העברה לאינדקסים סופיים
async function moveToFinalIndexes(db, mappings) {
  console.log('\n🎯 שלב 2: העברה לאינדקסים סופיים');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const [oldIndexStr, newIndexStr] of mappings) {
    const oldIndex = parseInt(oldIndexStr);
    const newIndex = parseInt(newIndexStr);
    const tempIndex = 5000 + oldIndex;
    
    try {
      const tempCategory = getCategoryByIndex(tempIndex);
      const newCategory = getCategoryByIndex(newIndex);
      
      if (!tempCategory || !newCategory) {
        const error = `קטגוריה לא תקינה: זמני ${tempIndex} -> ${newIndex}`;
        console.error(`❌ ${error}`);
        errors.push({ index: oldIndex, error });
        errorCount++;
        continue;
      }
      
      const tempCollection = db.collection(tempCategory);
      const newCollection = db.collection(newCategory);
      
      // קבלת המסמך הזמני
      const tempId = createObjectId(tempIndex);
      const document = await tempCollection.findOne({ _id: tempId });
      
      if (!document) {
        const error = `מסמך זמני לא נמצא: ${tempIndex}`;
        console.error(`❌ ${error}`);
        errors.push({ index: oldIndex, error });
        errorCount++;
        continue;
      }
      
      // בדיקה שהאינדקס החדש פנוי
      const newId = createObjectId(newIndex);
      const existingNew = await newCollection.findOne({ _id: newId });
      
      if (existingNew) {
        const error = `אינדקס חדש כבר תפוס: ${newIndex}`;
        console.error(`❌ ${error}`);
        errors.push({ index: oldIndex, error });
        errorCount++;
        continue;
      }
      
      // יצירת מסמך סופי
      const finalDocument = {
        ...document,
        _id: newId,
        index: newIndex
      };
      
      // הסרת השדות הזמניים
      delete finalDocument._originalIndex;
      delete finalDocument._targetIndex;
      
      // הכנסת המסמך החדש
      await newCollection.insertOne(finalDocument);
      
      // מחיקת המסמך הזמני
      await tempCollection.deleteOne({ _id: tempId });
      
      console.log(`✅ זמני ${tempIndex} -> ${newIndex} (${document.word})`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ שגיאה בהעברת ${tempIndex} -> ${newIndex}:`, error.message);
      errors.push({ index: oldIndex, error: error.message });
      errorCount++;
    }
  }
  
  console.log(`\n📊 סיכום שלב 2: ✅ ${successCount} | ❌ ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  שגיאות שנמצאו:');
    errors.forEach(e => console.log(`   - ${e.index}: ${e.error}`));
  }
  
  return { successCount, errorCount, errors };
}

// שלב 3: עדכון כל ההפניות (syn ו-con)
async function updateAllReferences(db, mappings) {
  console.log('\n🔗 שלב 3: עדכון הפניות (syn ו-con)');
  console.log('='.repeat(60));
  
  // יצירת מיפוי הפוך: ObjectId ישן -> ObjectId חדש
  const idMapping = {};
  for (const [oldIndexStr, newIndexStr] of mappings) {
    const oldIndex = parseInt(oldIndexStr);
    const newIndex = parseInt(newIndexStr);
    const oldId = createObjectId(oldIndex).toString();
    const newId = createObjectId(newIndex).toString();
    idMapping[oldId] = newId;
  }
  
  let totalUpdated = 0;
  let totalScanned = 0;
  
  // סריקת כל האוספים
  const collections = ['300', '600', '900', '1200', '1500'];
  
  for (const collectionName of collections) {
    console.log(`\n📂 סורק אוסף ${collectionName}...`);
    const collection = db.collection(collectionName);
    
    // מציאת כל המסמכים שיש להם syn או con
    const documents = await collection.find({
      $or: [
        { syn: { $exists: true, $ne: [] } },
        { con: { $exists: true, $ne: [] } }
      ]
    }).toArray();
    
    console.log(`   נמצאו ${documents.length} מסמכים עם הפניות`);
    
    for (const doc of documents) {
      totalScanned++;
      let updated = false;
      const updates = {};
      
      // עדכון syn
      if (doc.syn && doc.syn.length > 0) {
        const newSyn = doc.syn.map(id => {
          const idStr = id.toString();
          if (idMapping[idStr]) {
            updated = true;
            return idMapping[idStr];
          }
          return id;
        });
        
        if (updated) {
          updates.syn = newSyn;
        }
      }
      
      // עדכון con (reset updated flag)
      let conUpdated = false;
      if (doc.con && doc.con.length > 0) {
        const newCon = doc.con.map(id => {
          const idStr = id.toString();
          if (idMapping[idStr]) {
            conUpdated = true;
            return idMapping[idStr];
          }
          return id;
        });
        
        if (conUpdated) {
          updates.con = newCon;
          updated = true;
        }
      }
      
      // ביצוע העדכון
      if (updated) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: updates }
        );
        
        console.log(`   ✅ עודכן: ${doc.word} (${doc.index})`);
        totalUpdated++;
      }
    }
  }
  
  console.log(`\n📊 סיכום שלב 3:`);
  console.log(`   סה"כ מסמכים שנסרקו: ${totalScanned}`);
  console.log(`   סה"כ מסמכים שעודכנו: ${totalUpdated}`);
  
  return { totalScanned, totalUpdated };
}

// פונקציה ראשית
async function updateWordIndexes() {
  let client;
  
  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('\n🚀 מתחיל עדכון אינדקסים');
    console.log('='.repeat(60));
    
    const mappings = Object.entries(INDEX_MAPPING);
    console.log(`📊 סה"כ ${mappings.length} המרות`);
    
    console.log('\n📋 דוגמאות להמרות:');
    mappings.slice(0, 5).forEach(([old, newIdx], i) => {
      console.log(`   ${i + 1}. ${old} -> ${newIdx}`);
    });
    console.log(`   ...ועוד ${mappings.length - 5} המרות`);
    
    // שלב 1: העברה לזמניים
    console.log('\n⏳ מתחיל שלב 1 בעוד 3 שניות...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const stage1 = await moveToTemporaryIndexes(db, mappings);
    
    if (stage1.errorCount > 0) {
      console.log('\n⚠️  ⚠️  ⚠️  יש שגיאות בשלב 1! ⚠️  ⚠️  ⚠️');
    }
    
    // בקשת אישור להמשך לשלב 2
    console.log('\n' + '='.repeat(60));
    const answer1 = await askQuestion('❓ האם להמשיך לשלב 2? (yes/no): ');
    
    if (answer1 !== 'yes' && answer1 !== 'y') {
      console.log('🛑 התהליך נעצר על ידי המשתמש אחרי שלב 1');
      return;
    }
    
    // שלב 2: העברה לסופיים
    const stage2 = await moveToFinalIndexes(db, mappings);
    
    if (stage2.errorCount > 0) {
      console.log('\n⚠️  ⚠️  ⚠️  יש שגיאות בשלב 2! ⚠️  ⚠️  ⚠️');
    }
    
    // בקשת אישור להמשך לשלב 3
    console.log('\n' + '='.repeat(60));
    const answer2 = await askQuestion('❓ האם להמשיך לשלב 3 (עדכון הפניות)? (yes/no): ');
    
    if (answer2 !== 'yes' && answer2 !== 'y') {
      console.log('🛑 התהליך נעצר על ידי המשתמש אחרי שלב 2');
      return;
    }
    
    // שלב 3: עדכון הפניות
    const stage3 = await updateAllReferences(db, mappings);
    
    // סיכום כללי
    console.log('\n' + '='.repeat(60));
    console.log('🎉 סיכום כללי');
    console.log('='.repeat(60));
    console.log(`✅ שלב 1 - הועברו לזמניים: ${stage1.successCount}`);
    console.log(`✅ שלב 2 - הועברו לסופיים: ${stage2.successCount}`);
    console.log(`✅ שלב 3 - הפניות עודכנו: ${stage3.totalUpdated}`);
    console.log(`❌ סה"כ שגיאות: ${stage1.errorCount + stage2.errorCount}`);
    
  } catch (error) {
    console.error('💥 שגיאה כללית:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔐 חיבור למונגו נסגר');
    }
    rl.close();
  }
}

// הרצת הסקריפט
updateWordIndexes()
  .then(() => {
    console.log('✨ הסקריפט הושלם!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 הסקריפט נכשל:', error);
    process.exit(1);
  });