// src/scripts/update-confused-words.js
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config(); // אם אתה משתמש ב-dotenv

// הגדרות חיבור למונגו
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://meni1547:zcbm13579_@wordlist.pswqs.mongodb.net/EnglishProject";
const MONGODB_DB = process.env.MONGODB_DB || "EnglishProject";

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
561: 'manner' <->  665: 'style'
282: 'build' <-> 1322: 'manufacture'
1263: 'useful' <-> 1338: 'utilize'
334: 'mind' <-> 1179: 'soul'
1016: 'ingredient' <-> 1067: 'substance'
1012: 'sweet' <-> 1241: 'cute'
1172: 'convert' <-> 1201: 'replace'
1258: 'delicate' <-> 1259: 'sensitive'
363: 'personal' <->  596: 'private'
1220: 'flawless' <-> 1227: 'fantastic'
1257: 'fragile' <-> 1258: 'delicate'
133: 'high' <-> 455: 'above'
194: 'problem' <-> 639: 'challenge'
996: 'stuff' <-> 1066: 'item'
135: 'kind' <-> 1355: 'polite'
321: 'low' <-> 1285: 'decrease'
380: 'figure' <-> 550: 'shape'
1397: 'desire' <-> 1443: 'enthusiasm'
120: 'mean' <-> 1427: 'interpret'
179: 'point' <-> 732: 'spot'
1228: 'terrific' <-> 1237: 'stunning'
241: 'case' <-> 464: 'situation'
78: 'think' <-> 227: 'consider'
212: 'morning' <-> 1155: 'dawn'
1095: 'plus' <-> 1414: 'addition'
101: 'thing' <-> 345: 'matter'
211: 'turn' <-> 1139: 'twist'
428: 'act' <-> 606: 'perform'
492: 'space' <-> 711: 'territory'
1435: 'educate' <-> 1496: 'instruct'
154: 'group' <-> 694: 'club'
295: 'send' <-> 695: 'ship'
1112: 'circumstance' <-> 1449: 'incident'
282: 'build' <-> 1321: 'construct'
1003: 'flour' <-> 1127: 'powder'
711: 'territory' <-> 1371: 'domain'
131: 'place' <-> 731: 'site'
126: 'right' <-> 1216: 'accurate'
131: 'place' <-> 711: 'territory'
342: 'drop' <-> 1199: 'reduce'
588: 'thin' <-> 1136: 'flat'
650: 'fail' <-> 1038: 'loss'
470: 'provide' <-> 576: 'supply'
508: 'cup' <-> 563: 'glass'
791: 'chairman' <-> 1060: 'manager'
1067: 'substance' <-> 1074: 'particle'
1187: 'burden' <-> 1190: 'load'
339: 'rate' <-> 1088: 'ratio'
771: 'guard' <-> 1269: 'secure'
1243: 'gentle' <-> 1244: 'tender'
500: 'photograph' <-> 1367: 'capture'
617: 'object' <-> 1460: 'component'
41: 'up' <-> 422: 'top'
1383: 'disaster' <-> 1449: 'incident'
791: 'chairman' <-> 1417: 'boss'
163: 'important' <-> 1467: 'priority'
64: 'good' <-> 1247: 'pleasant'
489: 'beauty' <-> 1238: 'elegant'
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