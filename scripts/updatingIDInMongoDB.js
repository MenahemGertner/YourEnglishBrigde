/**
 * סקריפט לעדכון מסד נתונים - המרת מזהים קיימים למזהים מותאמים לפי אינדקס
 */
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' }); // טעינת משתני סביבה מ-.env.local

// פרטי החיבור למסד הנתונים - מגיעים מקובץ .env.local
const DB_CONNECTION_STRING = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
// הערה: שמות האוספים הם ישירות '500', '1000', '1500' ללא תחילית

/**
 * יוצר MongoDB ObjectID מותאם אישית עם אינדקס מוגדר
 */
function createCustomObjectId(index) {
  // חלק 1: חותמת זמן (4 בתים, 8 תווים הקסדצימליים)
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  
  // חלק 2: מזהה מכונה + מזהה תהליך (5 בתים, 10 תווים הקסדצימליים)
  const machineAndProcess = 'f6dabc96dd'; // לקוח מהדוגמה המקורית למען עקביות
  
  // חלק 3: מונה (3 בתים, 6 תווים הקסדצימליים)
  const counter = index.toString().padStart(6, '0');
  
  return timestamp + machineAndProcess + counter;
}

/**
 * עדכון מסד הנתונים MongoDB
 */
async function updateMongoDB(options = {}) {
  let client;
  
  // אפשרויות ברירת מחדל
  const defaultOptions = {
    subcollections: ['500', '1000', '1500'], // רשומות ברירת מחדל
    startIndex: 0,                           // אינדקס התחלתי
    endIndex: Infinity,                      // אינדקס סופי (ללא הגבלה כברירת מחדל)
  };
  
  // מיזוג אפשרויות שהתקבלו עם ברירות המחדל
  const { subcollections, startIndex, endIndex } = { ...defaultOptions, ...options };
  
  try {
    console.log('מתחיל בעדכון מסד נתונים MongoDB...');
    
    // בדיקת פרטי חיבור
    if (!DB_CONNECTION_STRING || !DB_NAME) {
      throw new Error('פרטי חיבור למסד נתונים חסרים ב-.env.local');
    }
    
    // התחברות למסד הנתונים
    client = new MongoClient(DB_CONNECTION_STRING);
    await client.connect();
    console.log('מחובר למונגו DB');
    
    const db = client.db(DB_NAME);
    
    // לולאה עבור כל רשומה (500, 1000, 1500)
    for (const subcollection of subcollections) {
      console.log(`\nמעבד רשומה: ${subcollection}`);
      
      // גישה לאוסף הספציפי - שינוי כאן! אוסף ישירות לפי שמו, ללא תחילית
      const collection = db.collection(subcollection);
      
      // בניית פילטר עבור הטווח המבוקש
      const filter = {};
      if (startIndex > 0 || endIndex < Infinity) {
        if (startIndex > 0 && endIndex < Infinity) {
          filter.index = { $gte: parseInt(startIndex), $lte: parseInt(endIndex) };
        } else if (startIndex > 0) {
          filter.index = { $gte: parseInt(startIndex) };
        } else {
          filter.index = { $lte: parseInt(endIndex) };
        }
      }
      
      // שליפת המסמכים בטווח המבוקש
      const documents = await collection.find(filter).toArray();
      console.log(`נמצאו ${documents.length} מסמכים לעדכון בטווח אינדקסים: ${startIndex} עד ${endIndex === Infinity ? 'סוף' : endIndex}`);
      
      // הדפסת דוגמה של מסמך ראשון אם קיים (לצורכי אבחון)
      if (documents.length > 0) {
        console.log('דוגמה למסמך ראשון:', JSON.stringify(documents[0]._id), 
                   'אינדקס:', documents[0].index);
      }
      
      if (documents.length === 0) {
        console.log('אין מסמכים לעדכון ברשומה זו בטווח המבוקש, ממשיך לרשומה הבאה');
        continue;
      }
      
      // יצירת מיפוי מזהים
      const idMappings = [];
      const updatedDocuments = [];
      
      // עדכון המזהים בכל המסמכים
      for (const doc of documents) {
        if (doc.index === undefined) {
          console.warn(`מסמך עם _id ${doc._id} חסר שדה index, מדלג`);
          continue;
        }
        
        // שמירת המזהה המקורי לגיבוי
        const originalId = doc._id.toString();
        
        // יצירת מזהה חדש המבוסס על האינדקס
        const newCustomId = createCustomObjectId(doc.index);
        
        // עריכת העתק של המסמך עם המזהה החדש
        const updatedDoc = { ...doc };
        delete updatedDoc._id; // מחיקת המזהה הישן
        
        // שמירת מיפוי מזהים לרישום
        idMappings.push({ 
          index: doc.index, 
          word: doc.word || doc.name || 'unknown',
          originalId,
          newId: newCustomId
        });
        
        updatedDocuments.push({
          ...updatedDoc,
          _id: new ObjectId(newCustomId)
        });
      }
      
      // גיבוי המסמכים הספציפיים שהולכים להשתנות
      const backupCollectionName = `${subcollection}_backup_${Date.now()}`;
      if (documents.length > 0) {
        await db.collection(backupCollectionName).insertMany(documents);
        console.log(`גיבוי נוצר באוסף: ${backupCollectionName}`);
      }
      
      // מחיקת המסמכים שהולכים להתעדכן (רק אלה שבטווח)
      const deleteResult = await collection.deleteMany(filter);
      console.log(`נמחקו ${deleteResult.deletedCount} מסמכים מהאוסף (בטווח המבוקש)`);
      
      // הוספת כל המסמכים המעודכנים
      if (updatedDocuments.length > 0) {
        const result = await collection.insertMany(updatedDocuments);
        console.log(`הוכנסו ${result.insertedCount} מסמכים מעודכנים למסד הנתונים`);
      }
      
      // שמירת מיפוי המזהים לקובץ לוג (אופציונלי)
      const fs = require('fs').promises;
      await fs.writeFile(
        `id_mappings_${subcollection}_${Date.now()}.json`, 
        JSON.stringify(idMappings, null, 2)
      );
      
      console.log(`סיום עדכון רשומה: ${subcollection}`);
    }
    
    console.log('\nעדכון מונגו DB הושלם בהצלחה');
    
  } catch (error) {
    console.error('שגיאה בעדכון מסד נתונים MongoDB:', error);
    // הדפס את השגיאה המלאה לצורכי אבחון מעמיק יותר
    console.error('פרטי שגיאה:', error.stack);
  } finally {
    if (client) {
      await client.close();
      console.log('החיבור למונגו DB נסגר');
    }
  }
}

/**
 * הפונקציה הראשית לעדכון כל המזהים
 */
async function updateAllIds() {
  try {
    console.log('==== תחילת עדכון מזהים במונגו DB ====');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const askQuestion = (question) => {
      return new Promise((resolve) => {
        readline.question(question, (answer) => {
          resolve(answer);
        });
      });
    };
    
    // בחירת רשומות לעדכון
    console.log('\nבחירת רשומות לעדכון:');
    console.log('1. כל הרשומות (500, 1000, 1500)');
    console.log('2. רשומה ספציפית');
    console.log('3. רשומות מותאמות אישית');
    
    const collectionChoice = await askQuestion('בחר אפשרות (1-3): ');
    
    let subcollections = ['500', '1000', '1500']; // ברירת מחדל - כל הרשומות
    
    if (collectionChoice === '2') {
      const specificCollection = await askQuestion('הזן את שם הרשומה הספציפית (500/1000/1500): ');
      if (['500', '1000', '1500'].includes(specificCollection)) {
        subcollections = [specificCollection];
      } else {
        console.log('שם רשומה לא חוקי, משתמש בכל הרשומות');
      }
    } else if (collectionChoice === '3') {
      const customCollections = await askQuestion('הזן רשימת רשומות מופרדות בפסיקים (לדוגמה: 500,1000): ');
      const customCollectionsArray = customCollections.split(',').map(c => c.trim());
      const validCollections = customCollectionsArray.filter(c => ['500', '1000', '1500'].includes(c));
      
      if (validCollections.length > 0) {
        subcollections = validCollections;
      } else {
        console.log('לא נמצאו רשומות חוקיות, משתמש בכל הרשומות');
      }
    }
    
    console.log(`נבחרו הרשומות: ${subcollections.join(', ')}`);
    
    // בחירת טווח אינדקסים
    console.log('\nבחירת טווח אינדקסים:');
    console.log('1. כל האינדקסים');
    console.log('2. טווח מותאם אישית');
    
    const rangeChoice = await askQuestion('בחר אפשרות (1-2): ');
    
    let startIndex = 0;
    let endIndex = Infinity;
    
    if (rangeChoice === '2') {
      const startIndexInput = await askQuestion('הזן אינדקס התחלתי: ');
      startIndex = startIndexInput ? parseInt(startIndexInput, 10) : 0;
      
      const endIndexInput = await askQuestion('הזן אינדקס סופי (או השאר ריק לכל האינדקסים): ');
      endIndex = endIndexInput ? parseInt(endIndexInput, 10) : Infinity;
      
      if (isNaN(startIndex)) startIndex = 0;
      if (isNaN(endIndex)) endIndex = Infinity;
    }
    
    console.log(`נבחר טווח אינדקסים: ${startIndex} עד ${endIndex === Infinity ? 'סוף' : endIndex}`);
    
    // אישור סופי לפני עדכון
    const confirmUpdate = await askQuestion('\nהאם לעדכן את מסד נתונים MongoDB עם ההגדרות שנבחרו? (כן/לא): ');
    
    if (confirmUpdate.toLowerCase() === 'כן' || confirmUpdate.toLowerCase() === 'yes' || confirmUpdate.toLowerCase() === 'y') {
      readline.close();
      
      // הוספת בדיקת שימוש באוספים טרם העדכון
      console.log('\n==== בדיקת טווח אינדקסים במסד הנתונים ====');
      const testClient = new MongoClient(DB_CONNECTION_STRING);
      await testClient.connect();
      const testDb = testClient.db(DB_NAME);
      
      for (const subcollection of subcollections) {
        const collection = testDb.collection(subcollection);
        
        // בדיקת מספר המסמכים הכולל
        const totalCount = await collection.countDocuments();
        
        // בדיקת מספר המסמכים בטווח
        const rangeFilter = {};
        if (startIndex > 0 || endIndex < Infinity) {
          if (startIndex > 0 && endIndex < Infinity) {
            rangeFilter.index = { $gte: parseInt(startIndex), $lte: parseInt(endIndex) };
          } else if (startIndex > 0) {
            rangeFilter.index = { $gte: parseInt(startIndex) };
          } else {
            rangeFilter.index = { $lte: parseInt(endIndex) };
          }
        }
        
        const rangeCount = await collection.countDocuments(rangeFilter);
        
        console.log(`אוסף ${subcollection}: סה"כ ${totalCount} מסמכים, ${rangeCount} מסמכים בטווח האינדקסים המבוקש`);
        
        // אם יש מסמכים בטווח המבוקש, הצג דוגמה
        if (rangeCount > 0) {
          const sampleDoc = await collection.findOne(rangeFilter);
          console.log(`דוגמה למסמך באוסף ${subcollection}:`);
          console.log(`- _id: ${sampleDoc._id}`);
          console.log(`- index: ${sampleDoc.index}`);
          console.log(`- שדות: ${Object.keys(sampleDoc).join(', ')}`);
        }
      }
      
      await testClient.close();
      console.log('==== סיום בדיקת טווח אינדקסים ====\n');
      
      await updateMongoDB({
        subcollections,
        startIndex,
        endIndex
      });
      
      console.log('==== סיום עדכון מזהים ====');
    } else {
      console.log('פעולת העדכון בוטלה');
      readline.close();
    }
    
  } catch (error) {
    console.error('שגיאה בתהליך העדכון:', error);
  }
}

// הרצת הסקריפט
updateAllIds().catch(console.error);