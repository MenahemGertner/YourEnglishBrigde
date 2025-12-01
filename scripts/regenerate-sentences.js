// ==========================================
// 🔄 Regenerate Sentences Script (Batch Mode - 10 words)
// ==========================================

require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// ====== הגדרות כלליות ======
const START_INDEX = 831; // מאיזה אינדקס להתחיל
const BATCH_SIZE = 1; // כמה מילים לעבד בריצה אחת
const COLLECTION_NAME = '900'; // שם הקולקציה

// ====== הגדרות MongoDB ======
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// ====== בחירת ספק AI ======
const USE_GPT = process.env.USE_GPT === 'false';

// ====== הגדרות GPT ======
let openai = null;
if (USE_GPT) {
  const OpenAI = require('openai');
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
}

// ====== הגדרות Claude ======
let axios = null;
let CLAUDE_API_KEY = null;
let API_URL = null;
if (!USE_GPT) {
  axios = require('axios');
  CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  API_URL = 'https://api.anthropic.com/v1/messages';
  if (!CLAUDE_API_KEY) throw new Error('Missing CLAUDE_API_KEY');
}

// ====== בדיקת סביבה ======
if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error('Missing MongoDB environment variables');
}

console.log(`\n🤖 מצב AI: ${USE_GPT ? '🟢 GPT-5' : '🟣 Claude Sonnet'}`);
console.log(`📦 גודל אצווה: ${BATCH_SIZE} מילים`);

// ====== פונקציות עזר ======
async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  return { client, db };
}

function createCustomObjectId(index) {
  return `f6dabc96ddf6dabc96dd${index.toString().padStart(4, '0')}`;
}

// ====== פרומפט (מעודכן עם תרגומים) ======
const allSentencesPrompt = ({ word, inflections }) => {
  const inflList = inflections.map((infl, idx) => {
    const count = infl.examples ? infl.examples.length : 1;
    const hebrewMeaning = infl.tr ? ` → Hebrew meaning: "${infl.tr}"` : '';
    return `${idx + 1}. "${infl.form}" (${infl.ps})${hebrewMeaning} - ${count} sentence${count > 1 ? 's' : ''}`;
  }).join('\n');

  const totalSentences = inflections.reduce(
    (sum, infl) => sum + (infl.examples ? infl.examples.length : 1),
    0
  );

  return `
You are creating ${totalSentences} English sentences for "${word}". This word appears in ${inflections.length} different grammatical functions.

INFLECTIONS WITH HEBREW MEANINGS:
${inflList}

⚠️ CRITICAL ERROR TO AVOID:
WRONG ❌: Using the same sentence for different grammatical functions
Example of what NOT to do:
- "have" (Present): "I have a dog!"
- "had" (Past): "I have a dog!"  ← WRONG! Same sentence!

CORRECT ✅: Each grammatical function needs a COMPLETELY DIFFERENT sentence
Example of what TO do:
- "have" (Present): "I have a dog named Max"
- "had" (Past): "We had so much fun yesterday!"
- "will have" (Future): "I'll have pizza for lunch!"

REQUIREMENTS:
1. LEVEL 2/5: 5-10 words
2. Write like a real person talks - natural, casual, everyday situations
3. Each sentence about something DIFFERENT and REAL from daily life
4. Make it sound like something you'd actually say to a friend
5. **MATCH THE HEBREW MEANING (tr)** - this is the specific context for the sentence!

Return ONLY a JSON array. Each object MUST have THREE fields:
- "form": the word form (e.g., "have", "had")  
- "sen": English sentence (matching the Hebrew meaning!)
- "trn": Hebrew translation (natural Hebrew)

IMPORTANT: The "trn" field must ALWAYS contain Hebrew text, NOT English!

Example format:
[
  {"form": "have", "sen": "I have a dog named Max", "trn": "יש לי כלב ששמו מקס"},
  {"form": "had", "sen": "We had so much fun yesterday!", "trn": "נהנינו כל כך אתמול!"}
]

For each form of "${word}", write ONE simple and conversational, but also smooth and natural! sentence that matches its Hebrew meaning - like you're texting a friend!
`;
};

// ====== יצירת משפטים (תומך גם GPT וגם Claude) ======
async function generateAllSentences(wordDoc) {
  const word = wordDoc.word;
  console.log(`\n🔄 מייצר משפטים עבור: ${word}`);

  const totalSentences = wordDoc.infl.reduce(
    (sum, infl) => sum + (infl.examples ? infl.examples.length : 1),
    0
  );
  console.log(`  ⏳ מבקש ${totalSentences} משפטים...`);

  // הצגת התרגומים לבדיקה
  console.log(`  📖 תרגומים עבריים:`);
  wordDoc.infl.forEach((infl, idx) => {
    console.log(`     ${idx + 1}. ${infl.form} → ${infl.tr || '(אין תרגום)'}`);
  });

  try {
    let content;

    if (USE_GPT) {
      // === GPT ===
      const completion = await openai.chat.completions.create({
        model: "gpt-5-chat-latest",
        messages: [{ role: "user", content: allSentencesPrompt({ word, inflections: wordDoc.infl }) }],
        max_tokens: 4000,
        temperature: 0.7
      });
      content = completion.choices[0].message.content;
    } else {
      // === CLAUDE ===
      const response = await axios.post(
        API_URL,
        {
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: allSentencesPrompt({ word, inflections: wordDoc.infl }) }]
        },
        {
          headers: {
            "x-api-key": CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
          }
        }
      );
      content = response.data.content[0].text;
    }

    // חילוץ JSON
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No valid JSON array found in response');

    const sentences = JSON.parse(jsonMatch[0]);
    console.log(`  ✅ קיבלתי ${sentences.length} משפטים`);

    // הדפסה לבדיקה
    sentences.forEach((s, idx) => {
      const hasHebrew = /[\u0590-\u05FF]/.test(s.trn || '');
      const warn = !hasHebrew ? ' ⚠️ אין עברית!' : '';
      console.log(`     ${idx + 1}. [${s.form}] ${s.sen}${warn}`);
      if (hasHebrew) console.log(`         → ${s.trn}`);
    });

    // סידור לפי הטיות
    const newInflections = [];
    let i = 0;
    for (const infl of wordDoc.infl) {
      const n = infl.examples ? infl.examples.length : 1;
      const examples = [];
      for (let j = 0; j < n && i < sentences.length; j++) {
        const s = sentences[i++];
        examples.push({ sen: s.sen, trn: s.trn });
      }
      newInflections.push({ ...infl, examples });
    }

    return newInflections;

  } catch (error) {
    console.error(`❌ Error calling ${USE_GPT ? 'OpenAI' : 'Claude'} API:`, error.message);
    if (error.response) console.error('Response data:', error.response.data);
    throw error;
  }
}

// ====== עדכון ב-DB ======
async function updateWordInDB(collection, wordId, newInflections) {
  await collection.updateOne({ _id: new ObjectId(wordId) }, { $set: { infl: newInflections } });
}

// ====== שמירת לוג ======
async function saveProcessingLog(results) {
  const logPath = path.join(__dirname, 'processing_log.json');
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    timestamp,
    results,
    summary: {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length
    }
  };

  let logs = [];
  if (fs.existsSync(logPath)) {
    const existing = await fs.promises.readFile(logPath, 'utf8');
    logs = JSON.parse(existing);
  }
  
  logs.push(logEntry);
  await fs.promises.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf8');
  console.log(`\n📝 לוג נשמר ב: ${logPath}`);
}

// ====== MAIN ======
async function main() {
  let client;
  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    const collection = db.collection(COLLECTION_NAME);
    
    // מציאת מילים לעיבוד
    const allWords = await collection.find({}).sort({ index: 1 }).toArray();
    const wordsToProcess = allWords
      .filter(w => w.index >= START_INDEX)
      .slice(0, BATCH_SIZE); // לוקח רק את ה-10 הראשונות
    
    console.log(`\n🚀 מתחיל לעבד ${wordsToProcess.length} מילים (אינדקסים ${START_INDEX}-${START_INDEX + wordsToProcess.length - 1})...`);

    const results = [];

    for (let i = 0; i < wordsToProcess.length; i++) {
      const wordDoc = wordsToProcess[i];
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📍 מילה ${i + 1}/${wordsToProcess.length}: ${wordDoc.word} (אינדקס ${wordDoc.index})`);
      console.log('='.repeat(70));

      try {
        const newInflections = await generateAllSentences(wordDoc);
        const wordId = createCustomObjectId(wordDoc.index);
        await updateWordInDB(collection, wordId, newInflections);
        
        console.log(`✅ ${wordDoc.word} עודכן בהצלחה במונגו!`);
        results.push({
          word: wordDoc.word,
          index: wordDoc.index,
          status: 'success',
          inflectionsCount: newInflections.length,
          sentencesCount: newInflections.reduce((sum, infl) => sum + infl.examples.length, 0)
        });

        // המתנה קצרה בין בקשות
        if (i < wordsToProcess.length - 1) {
          console.log('\n⏸️  ממתין 2 שניות...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (err) {
        console.error(`❌ שגיאה בעיבוד ${wordDoc.word}:`, err.message);
        results.push({
          word: wordDoc.word,
          index: wordDoc.index,
          status: 'failed',
          error: err.message
        });
      }
    }

    // סיכום
    console.log(`\n${'='.repeat(70)}`);
    console.log('📊 סיכום ריצה:');
    console.log('='.repeat(70));
    
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');
    
    console.log(`✅ הצליחו: ${successful.length}/${results.length}`);
    if (successful.length > 0) {
      successful.forEach(r => {
        console.log(`   • ${r.word} (${r.inflectionsCount} הטיות, ${r.sentencesCount} משפטים)`);
      });
    }
    
    if (failed.length > 0) {
      console.log(`\n❌ נכשלו: ${failed.length}/${results.length}`);
      failed.forEach(r => {
        console.log(`   • ${r.word}: ${r.error}`);
      });
    }

    // שמירת לוג
    await saveProcessingLog(results);

    // הנחיות להמשך
    if (successful.length > 0) {
      const nextIndex = START_INDEX + BATCH_SIZE;
      console.log(`\n💡 להמשך: שנה את START_INDEX ל-${nextIndex} והרץ שוב`);
    }

  } catch (e) {
    console.error('💥 שגיאה כללית:', e);
  } finally {
    if (client) await client.close();
    console.log('\n🔐 חיבור למונגו נסגר');
  }
}

// ====== הרצה ======
main()
  .then(() => {
    console.log('\n🎉 הסקריפט הושלם!');
    process.exit(0);
  })
  .catch(err => {
    console.error('💥 שגיאה:', err);
    process.exit(1);
  });