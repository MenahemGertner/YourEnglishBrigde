// src/scripts/validate-ps-field.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const readline = require('readline');

// ====== הגדרות ריצה ======
const START_INDEX = 801; // מאיזה אינדקס להתחיל
const END_INDEX = 900; // עד איזה אינדקס (כולל)

// ====== הגדרות MongoDB ======
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// ====== הגדרות Claude ======
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error('Missing MongoDB environment variables');
}

if (!CLAUDE_API_KEY) {
  throw new Error('Missing CLAUDE_API_KEY');
}

// ====== חיבור למונגו ======
async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  return { client, db };
}

function createCustomObjectId(index) {
  return `f6dabc96ddf6dabc96dd${index.toString().padStart(4, '0')}`;
}

function getCategoryByIndex(index) {
  if (index <= 300) return '300';
  if (index <= 600) return '600';
  if (index <= 900) return '900';
  if (index <= 1200) return '1200';
  if (index <= 1500) return '1500';
  return null;
}

// ====== פרומפט ל-AI ======
function createValidationPrompt(word, inflections) {
  const inflList = inflections.map((infl, idx) => {
    return `${idx + 1}. form: "${infl.form}" | tr: "${infl.tr}" | ps: ${infl.ps}`;
  }).join('\n');

  return `
You are a Hebrew-English translation expert. Your task is to review ONLY the Hebrew translations (tr field with nikud) for English word inflections and identify translations that are unnatural, awkward, or incorrect in Hebrew.

WORD: "${word}"

INFLECTIONS:
${inflList}

⚠️ CRITICAL: You are reviewing ONLY the "tr" field (Hebrew translation). The "form" and "ps" fields are provided ONLY for context - DO NOT suggest any changes to them. Focus exclusively on whether the Hebrew translation is natural and correct.

COMMON ISSUES TO LOOK FOR IN THE "tr" FIELD:
1. **Overly literal translations** that don't sound natural in Hebrew (e.g., "מְדַגְמֵן" for "digitize" instead of "מְמַחְשֵׁב")
2. **Redundant "הָיָה" constructions** (e.g., "הָיָה מָשַׁךְ" instead of just "מָשַׁךְ" for Past Perfect)
3. **Non-existent Hebrew verbs** or forms that Hebrew speakers wouldn't use
4. **Inconsistent nikud** or incorrect vocalization
5. **Unnatural phrasing** that doesn't match how Hebrew speakers actually talk

YOUR TASK:
1. Analyze ALL Hebrew translations (tr fields) in context of the main word
2. Identify ONLY translations (tr) that are truly problematic (not just alternative styles)
3. For each problematic translation, suggest a natural Hebrew alternative with proper nikud
4. **DO NOT suggest changes to "ps" or "form" fields** - only fix the "tr" field

RETURN FORMAT:
If you find problems IN THE "tr" FIELD, return ONLY a JSON array like this:
[
  {
    "form": "digitize",
    "oldTr": "מְדַגְמֵן",
    "newTr": "מְמַחְשֵׁב",
    "reason": "The verb דיגמן is not commonly used; ממחשב is more natural"
  },
  {
    "form": "had pulled",
    "oldTr": "הָיָה מָשַׁךְ",
    "newTr": "מָשַׁךְ",
    "reason": "Past Perfect in Hebrew doesn't need היה; just מָשַׁךְ is correct"
  }
]

If ALL translations (tr fields) are good and natural, return:
{"status": "all_good"}

IMPORTANT: 
- Be strict - only flag translations that are genuinely unnatural or wrong in Hebrew
- Don't suggest changes for stylistic preferences
- NEVER suggest changes to fix the "ps" field - only the "tr" field
- The "ps" field is correct as is - you're only checking if the Hebrew translation matches
`;
}

// ====== קריאה ל-Claude ======
async function analyzeTranslations(word, inflections) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          { 
            role: "user", 
            content: createValidationPrompt(word, inflections) 
          }
        ]
      },
      {
        headers: {
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        }
      }
    );

    const content = response.data.content[0].text;
    
    // חילוץ JSON - מחפש את ה-JSON הראשון שמתחיל ב-{ או [
    let jsonMatch = content.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      jsonMatch = content.match(/\{[\s\S]*?\}/);
    }
    
    if (!jsonMatch) {
      console.log('⚠️  לא נמצאה תשובה תקינה מה-AI');
      console.log('תשובת AI:', content);
      return null;
    }

    let jsonStr = jsonMatch[0];
    
    // ניקוי markdown backticks אם יש
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(jsonStr);
    
    if (result.status === 'all_good') {
      return null; // אין בעיות
    }
    
    // אם זה אובייקט בודד, נהפוך אותו למערך
    if (!Array.isArray(result)) {
      return null;
    }
    
    // סינון: רק תיקונים שבהם oldTr שונה מ-newTr
    const realCorrections = result.filter(corr => corr.oldTr !== corr.newTr);
    
    if (realCorrections.length === 0) {
      return null; // אין תיקונים אמיתיים
    }
    
    return realCorrections; // מערך של תיקונים מוצעים

  } catch (error) {
    console.error('❌ שגיאה בקריאה ל-Claude:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    throw error;
  }
}

// ====== אינטראקציה עם משתמש ======
function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ====== עדכון במונגו ======
async function updateWordTranslations(collection, wordId, inflections, corrections) {
  const updatedInflections = inflections.map(infl => {
    const correction = corrections.find(c => c.form === infl.form);
    if (correction) {
      return { ...infl, tr: correction.newTr };
    }
    return infl;
  });

  await collection.updateOne(
    { _id: new ObjectId(wordId) },
    { $set: { infl: updatedInflections } }
  );
}

// ====== שמירת לוג ======
async function saveUpdatedIndices(indices) {
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const logPath = path.join(outputDir, 'updated-translations-log.json');
  const txtPath = path.join(outputDir, 'updated-translations-indices.txt');

  // JSON מפורט
  const logData = {
    timestamp: new Date().toISOString(),
    totalUpdated: indices.length,
    indices: indices
  };
  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2), 'utf8');

  // TXT פשוט
  const txtData = indices.map(item => item.index).join('\n');
  fs.writeFileSync(txtPath, txtData, 'utf8');

  console.log(`\n📁 לוג נשמר ב: ${logPath}`);
  console.log(`📁 אינדקסים נשמרו ב: ${txtPath}`);
}

// ====== MAIN ======
async function main() {
  let client;
  const updatedIndices = [];

  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;

    console.log(`\n🚀 מתחיל בדיקת תרגומים מאינדקס ${START_INDEX} עד ${END_INDEX}...\n`);

    for (let index = START_INDEX; index <= END_INDEX; index++) {
      const category = getCategoryByIndex(index);
      if (!category) {
        console.log(`⚠️  אינדקס ${index} מחוץ לטווח`);
        continue;
      }

      const collection = db.collection(category);
      const objectId = createCustomObjectId(index);
      const wordDoc = await collection.findOne({ _id: new ObjectId(objectId) });

      if (!wordDoc) {
        console.log(`⚠️  אינדקס ${index} לא נמצא`);
        continue;
      }

      if (!wordDoc.infl || !Array.isArray(wordDoc.infl)) {
        console.log(`⚠️  אינדקס ${index} (${wordDoc.word}) - אין שדה infl תקין`);
        continue;
      }

      console.log(`\n${'='.repeat(70)}`);
      console.log(`📖 בודק אינדקס ${index}: "${wordDoc.word}"`);
      console.log('='.repeat(70));

      let keepTrying = true;
      let corrections = null;

      while (keepTrying) {
        // שליחה ל-AI
        console.log('🤖 שולח ל-Claude לבדיקה...');
        corrections = await analyzeTranslations(wordDoc.word, wordDoc.infl);

        if (!corrections) {
          console.log('✅ כל התרגומים תקינים!\n');
          keepTrying = false;
          break;
        }

        // הצגת התיקונים המוצעים
        console.log('\n⚠️  נמצאו תרגומים בעייתיים:\n');
        corrections.forEach((corr, idx) => {
          console.log(`${idx + 1}. Form: "${corr.form}"`);
          console.log(`   ישן: ${corr.oldTr}`);
          console.log(`   חדש: ${corr.newTr}`);
          console.log(`   סיבה: ${corr.reason}\n`);
        });

        // שאלת משתמש
        const answer = await askUser(
          '👉 פעולה? (y=אשר, r=נסה שוב, s=דלג): '
        );

        if (answer === 'y') {
          // עדכון במונגו
          await updateWordTranslations(collection, objectId, wordDoc.infl, corrections);
          console.log(`✅ עודכן בהצלחה במונגו!`);
          
          updatedIndices.push({
            index: wordDoc.index,
            word: wordDoc.word,
            correctionsCount: corrections.length,
            corrections: corrections.map(c => ({ form: c.form, oldTr: c.oldTr, newTr: c.newTr }))
          });
          
          keepTrying = false;
        } else if (answer === 'r') {
          console.log('🔄 מבקש מה-AI להציע אלטרנטיבה...\n');
          // הלולאה תימשך ותשלח שוב
        } else if (answer === 's') {
          console.log('⏭️  מדלג על מילה זו\n');
          keepTrying = false;
        } else {
          console.log('❓ תשובה לא מזוהה, מדלג...\n');
          keepTrying = false;
        }
      }

      // המתנה קצרה בין מילים
      if (index < END_INDEX) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // סיכום
    console.log(`\n${'='.repeat(70)}`);
    console.log('📊 סיכום:');
    console.log('='.repeat(70));
    console.log(`✅ סה"כ מילים שעודכנו: ${updatedIndices.length}`);
    
    if (updatedIndices.length > 0) {
      console.log('\n📝 מילים שעודכנו:');
      updatedIndices.forEach(item => {
        console.log(`   • אינדקס ${item.index}: ${item.word} (${item.correctionsCount} תיקונים)`);
      });
      
      await saveUpdatedIndices(updatedIndices);
    }

  } catch (error) {
    console.error('💥 שגיאה כללית:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔐 חיבור למונגו נסגר');
    }
  }
}

// ====== הרצה ======
main()
  .then(() => {
    console.log('\n🎉 הסקריפט הושלם!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 שגיאה:', error);
    process.exit(1);
  });