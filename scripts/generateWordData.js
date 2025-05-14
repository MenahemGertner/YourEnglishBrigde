require('dotenv').config({ path: '.env.local' });
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// הגדרה להתחלת האינדקס
const START_INDEX = 661;

// הגדרות API
const API_KEY = process.env.CLAUDE_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

// נתיבים - מתוקנים עם התייחסות נכונה למיקום הסקריפט
const WORD_LIST_PATH = path.join(__dirname, '../public/data/wordList.txt');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const FAILED_DIR = path.join(OUTPUT_DIR, 'failed');
const FINAL_OUTPUT = path.join(OUTPUT_DIR, 'wordDatabase.json');

// ביטוי רגולרי לזיהוי ניקוד בעברית
const hebrewDiacriticsRegex = /[\u0591-\u05C7]/;

// פונקציה לטעינת רשימת המילים מקובץ
async function loadWordList(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data.split('\n').map(line => line.trim()).filter(word => word.length > 0);
  } catch (error) {
    console.error('שגיאה בטעינת רשימת המילים:', error);
    return [];
  }
}

// פונקציה להמתנה
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ההנחיה המפורטת
const promptTemplate = (word) => `
אני צריך ליצור אובייקט JSON מפורט למילה באנגלית "${word}" באיכות גבוהה במיוחד.
האובייקט חייב לעקוב אחר המבנה המדויק הבא, עם הקפדה על דיוק ועושר לשוני:

1. מזהה ייחודי (_id.$oid)
2. אינדקס סידורי (index) - תיצור החל מ ${START_INDEX} והלאה
3. המילה באנגלית ("word")
4. תרגום מדויק לעברית ("tr")
5. חלק דיבר ("ps"): N=שם עצם, V=פועל, A=תואר, D=תואר הפועל, F=מילת פונקציה
6. רשימת צורות נטייה ("inf") - כל ההטיות של המילה, 'רק הטיות' (כולל הטיות בין חלקי הדיבור) אבל לא כולל נגזרות ולא כולל המילה עצמה
7. פירוט נטיות דקדוקיות ("infl") - הטיות שעוזרות למשתמש להבין את צורות השימוש. (לדוגמה, כאשר לשם עצם יש יחיד ורבים, אז מה שמסביר את ההטיה הוא הגדרת יחיד ורבים. במקרה שאין רבים לשם העצם, אז שם עצם יחיד לא מגדיר היטב את ההטיה ונחפש הגדרה מתאימה יותר שתגרום למשתמש להבין את מהות ההטיה. את העיקרון הזה יש ליישם בבחירת כל הטיה)
כל נטייה חייבת לכלול:
   - צורת המילה ("form")
   - 'תרגום לעברית עם 'ניקוד מלא ("tr")
   - מונח דקדוקי ("ps") - השתמש במונחים רלוונטיים 'אך ורק' מתוך הרשימה הבאה (אם לא מצאת את המונח, תחפש את ההגדרה הקרובה ביותר למונח):
        ['Singular',
            'Plural',
            'Process-Result Noun',
            'Quality Noun',
            'Gerund',
            'Recipient Noun',
            'Action Performer Noun',
            'Purpose Noun',
            'Size Modifier Noun',
            'State Noun',
            'Present Simple',
            'Past Simple',
            'Future Simple',
            'Present Progressive',
            'Past Progressive',
            'Present Perfect',
            'Past Perfect',
            'Verb Infinitive',
            'Third Person Singular',
            'Positive',
            'Comparative',
            'Superlative',
            'Adjectival Participle',
            'Feature Adjective',
            'Adverb Form',
            'Description Adverb',
            'Pronoun',
            'Preposition',
            'Conjunction',
            'Article',
            'Determiner',
            'Interjection',
            'Auxiliary Verb',
            'Negative Forms',
            'Contractions']
   - דוגמאות שימוש 'פשוטות' באנגלית 'ברמה של המילה הנלמדת' עם תרגום לעברית ("examples") - אם יש פחות מ 5 הטיות, אז להשלים משפטים נוספים, כך שיהיו בסך הכל 5 משפטים לפחות
8. ביטויים נפוצים ("ex") - 3 ביטויים ופתגמים 'קצרים' שכוללים את המילה
9. מילים נרדפות ("syn") - להשאיר ריק
10. מילים מנוגדות ("con") - להשאיר ריק

כללים חשובים:
- דוגמאות השימוש חייבות להיות משפטים פשוטים וברורים. כמו כן חשוב לי לשלב בתוכם משפטי מוטיבציה ומשפטים מחכימים.
- התרגומים לעברית חייבים להיות טבעיים (לא מילוליים מדי)

הנה 3 דוגמאות מדויקות למבנה הרצוי:
{
  "_id": {
    "$oid": "676dac2df6dabc96ddf5a052"
  },
  "index": 21,
  "word": "grow",
  "tr": "לגדול, לצמוח, להתפתח",
  "ps": "V",
  "inf": [
    "grew",
    "growing",
    "grown",
    "grows",
    "growth",
    "grower"
  ],
  "infl": [
    {
      "form": "to grow",
      "tr": "לִגְדּוֹל",
      "ps": "Verb Infinitive",
      "examples": [
        {
          "sen": "To grow plants helps you learn patience",
          "trn": "לגדל צמחים עוזר לך ללמוד סבלנות"
        }
      ]
    },
    {
      "form": "grow",
      "tr": "גָדֵל",
      "ps": "Present Simple",
      "examples": [
        {
          "sen": "I grow fresh vegetables in my garden",
          "trn": "אני מגדל ירקות טריים בגינה שלי"
        }
      ]
    },
    {
      "form": "grew",
      "tr": "גָדַל",
      "ps": "Past Simple",
      "examples": [
        {
          "sen": "The science student grew better with practice",
          "trn": "תלמיד המדעים השתפר עם התרגול"
        }
      ]
    },
    {
      "form": "will grow",
      "tr": "יִגְדַּל",
      "ps": "Future Simple",
      "examples": [
        {
          "sen": "This tree will grow tall and strong",
          "trn": "העץ הזה יגדל גבוה וחזק"
        }
      ]
    },
    {
      "form": "is growing",
      "tr": "גָּדֵל",
      "ps": "Present Progressive",
      "examples": [
        {
          "sen": "The plant is growing quickly",
          "trn": "הצמח גדל במהירות"
        }
      ]
    },
    {
      "form": "was growing",
      "tr": "גָדַל",
      "ps": "Past Progressive",
      "examples": [
        {
          "sen": "The community was growing more strong",
          "trn": "הקהילה הלכה והתחזקה"
        }
      ]
    },
    {
      "form": "have grown",
      "tr": "גָדַל",
      "ps": "Present Perfect",
      "examples": [
        {
          "sen": "Students have grown to love books",
          "trn": "התלמידים למדו לאהוב ספרים"
        }
      ]
    },
    {
      "form": "had grown",
      "tr": "גָדַל",
      "ps": "Past Perfect",
      "examples": [
        {
          "sen": "The school garden had grown beautiful",
          "trn": "גינת בית הספר הפכה יפה"
        }
      ]
    },
    {
      "form": "grows",
      "tr": "גָדֵל",
      "ps": "Third Person Singular",
      "examples": [
        {
          "sen": "Every student grows at their own speed",
          "trn": "כל תלמיד מתקדם בקצב שלו"
        }
      ]
    },
    {
      "form": "growth",
      "tr": "צְמִיחָה",
      "ps": "Process-Result Noun",
      "examples": [
        {
          "sen": "Knowledge growth brings better life",
          "trn": "צמיחה בידע מביאה חיים טובים יותר"
        }
      ]
    },
    {
      "form": "growing",
      "tr": "גִּדּוּל",
      "ps": "Gerund",
      "examples": [
        {
          "sen": "Growing food in America is important work",
          "trn": "גידול מזון באמריקה היא עבודה חשובה"
        }
      ]
    },
    {
      "form": "grower",
      "tr": "מְגַדֵּל",
      "ps": "Action Performer Noun",
      "examples": [
        {
          "sen": "The local grower sells fresh vegetables at the market",
          "trn": "המגדל המקומי מוכר ירקות טריים בשוק"
        }
      ]
    }
  ],
  "ex": {
    "grow up": "להתבגר",
    "grow on": "התחבב על"
  },
  "syn": [],
  "con": []
}
  {
  "_id": {
    "$oid": "676e7f13f6dabc96ddf5a094"
  },
  "index": 4,
  "word": "of",
  "tr": "של, מ-, על",
  "ps": "F",
  "inf": [],
  "infl": [
    {
      "form": "of",
      "tr": "שֶׁל",
      "ps": "Preposition",
      "examples": [
        {
          "sen": "The power of education can transform lives",
          "trn": "כוחו של החינוך יכול לשנות חיים"
        },
        {
          "sen": "A cup of coffee helps me start my day",
          "trn": "כוס קפה עוזרת לי להתחיל את היום"
        }
      ]
    },
    {
      "form": "of",
      "tr": "מִ-",
      "ps": "Preposition",
      "examples": [
        {
          "sen": "Many of the students passed the test",
          "trn": "רבים מהתלמידים עברו את המבחן"
        },
        {
          "sen": "Each of us has the potential for greatness",
          "trn": "לכל אחד מאיתנו יש פוטנציאל לגדולה"
        }
      ]
    },
    {
      "form": "of",
      "tr": "עַל",
      "ps": "Preposition",
      "examples": [
        {
          "sen": "The museum of history is full of amazing artifacts",
          "trn": "מוזיאון ההיסטוריה מלא בממצאים מדהימים"
        },
        {
          "sen": "Dreams of success motivate us to work harder",
          "trn": "חלומות על הצלחה מניעים אותנו לעבוד קשה יותר"
        }
      ]
    }
  ],
  "ex": {
    "part of": "חלק מ-",
    "of course": "כמובן",
    "proud of": "גאה ב-"
  },
  "syn": [],
  "con": []
}
  
  {
  "_id": {
    "$oid": "676e46f2f6dabc96ddf5a062"
  },
  "index": 22,
  "word": "water",
  "tr": "מים, נוזל",
  "ps": "N",
  "inf": [
    "waters",
    "watering",
    "watered",
    "watery"
  ],
  "infl": [
    {
      "form": "water",
      "tr": "מַיִם",
      "ps": "Singular",
      "examples": [
        {
          "sen": "Clean water helps everyone grow strong",
          "trn": "מים נקיים עוזרים לכולם להתחזק"
        }
      ]
    },
    {
      "form": "waters",
      "tr": "מַיִם",
      "ps": "Plural",
      "examples": [
        {
          "sen": "The Great Lakes waters are deep and blue",
          "trn": "מי האגמים הגדולים עמוקים וכחולים"
        }
      ]
    },
    {
      "form": "watering",
      "tr": "הַשְׁקָיָה",
      "ps": "Gerund",
      "examples": [
        {
          "sen": "Watering the garden brings fresh food",
          "trn": "השקיית הגינה מביאה אוכל טרי"
        }
      ]
    },
    {
      "form": "to water",
      "tr": "לְהַשְׁקוֹת",
      "ps": "Verb Infinitive",
      "examples": [
        {
          "sen": "To water plants helps them grow better",
          "trn": "להשקות צמחים עוזר להם לגדול טוב יותר"
        }
      ]
    },
    {
      "form": "water",
      "tr": "מַשְׁקֶה",
      "ps": "Present Simple",
      "examples": [
        {
          "sen": "I water the plants every day",
          "trn": "אני משקה את הצמחים כל יום"
        }
      ]
    },
    {
      "form": "watered",
      "tr": "הִשְׁקָה",
      "ps": "Past Simple",
      "examples": [
        {
          "sen": "She watered the plants yesterday",
          "trn": "היא השקתה את הצמחים אתמול"
        }
      ]
    },
    {
      "form": "will water",
      "tr": "יַשְׁקֶה",
      "ps": "Future Simple",
      "examples": [
        {
          "sen": "Tomorrow I will water all the plants",
          "trn": "מחר אשקה את כל הצמחים"
        }
      ]
    },
    {
      "form": "is watering",
      "tr": "מַשְׁקֶה",
      "ps": "Present Progressive",
      "examples": [
        {
          "sen": "She is watering the flowers right now",
          "trn": "היא משקה את הפרחים כרגע"
        }
      ]
    },
    {
      "form": "was watering",
      "tr": "הָיָה מַשְׁקֶה",
      "ps": "Past Progressive",
      "examples": [
        {
          "sen": "He was watering the lawn when the phone rang",
          "trn": "הוא היה משקה את הדשא כשהטלפון צלצל"
        }
      ]
    },
    {
      "form": "have watered",
      "tr": "הִשְׁקָה",
      "ps": "Present Perfect",
      "examples": [
        {
          "sen": "I have watered the garden already today",
          "trn": "כבר השקיתי את הגינה היום"
        }
      ]
    },
    {
      "form": "had watered",
      "tr": "הִשְׁקָה",
      "ps": "Past Perfect",
      "examples": [
        {
          "sen": "He had watered the plants before it rained",
          "trn": "הוא כבר השקה את הצמחים לפני שירד גשם"
        }
      ]
    },
    {
      "form": "waters",
      "tr": "מַשְׁקֶה",
      "ps": "Third Person Singular",
      "examples": [
        {
          "sen": "He waters the garden every morning",
          "trn": "הוא משקה את הגינה בכל בוקר"
        }
      ]
    },
    {
      "form": "watery",
      "tr": "מֵימִי",
      "ps": "Feature Adjective",
      "examples": [
        {
          "sen": "The sea looks blue and watery",
          "trn": "הים נראה כחול ומימי"
        }
      ]
    }
  ],
  "ex": {
    "water down": "לדלל, להחליש",
    "like water": "בשפע",
    "under water": "מתחת למים"
  },
  "syn": [],
  "con": []
}

אני צריך אובייקט איכותי, מדויק וצריך להכיל את כל המידע הנדרש למילה "${word}".
אנא החזר רק את האובייקט ה-JSON המלא, ללא טקסט מקדים או סיכום.
`;

// פונקציה לבדיקת איכות האובייקט
function validateQuality(obj, word) {
  // בדיקה בסיסית שהאובייקט כולל את כל השדות הנדרשים
  const requiredFields = ["_id", "index", "word", "tr", "ps", "inf", "infl", "ex"];
  const missingFields = requiredFields.filter(field => !(field in obj));
  
  if (missingFields.length > 0) {
    return { isValid: false, message: `שדות חסרים: ${missingFields.join(', ')}` };
  }
  
  // בדיקה שהמילה נכונה
  if (obj.word.toLowerCase() !== word.toLowerCase()) {
    return { isValid: false, message: `המילה לא תואמת: ${obj.word} במקום ${word}` };
  }
  
  // נבדוק שלכל איבר במערך יש שדה tr עם ניקוד
  for (let i = 0; i < obj.infl.length; i++) {
    const inflItem = obj.infl[i];
    if (!inflItem.tr || !hebrewDiacriticsRegex.test(inflItem.tr)) {
        return { 
            isValid: false, 
            message: `חסר ניקוד בתרגום של הטיה מספר ${i+1} (${inflItem.form})` 
        };
    }
}
  
  // בדיקה שיש לפחות נטייה אחת
  if (!obj.infl || obj.infl.length < 1) {
    return { isValid: false, message: "חסרות נטיות דקדוקיות" };
  }
  
  // בדיקה שיש לפחות דוגמה אחת לכל נטייה
  for (const infl of obj.infl) {
    if (!infl.examples || infl.examples.length < 1) {
      return { 
        isValid: false, 
        message: `חסרות דוגמאות לנטייה: ${infl.form || ''}` 
      };
    }
  }
  
  return { isValid: true, message: "האובייקט עבר את בדיקת האיכות" };
}

// פונקציה לקבלת אובייקט מילה
async function getWordObject(word, index, attempt = 1) {
  if (attempt > 3) {
    return { obj: null, message: "מספר הניסיונות המקסימלי הושג" };
  }
  
  // יצירת מזהה ייחודי בסגנון MongoDB
  const randomId = uuidv4().replace(/-/g, '').substring(0, 24);
  
  try {
    const response = await axios.post(API_URL, {
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4000,
      messages: [
        { role: "user", content: promptTemplate(word) }
      ]
    }, {
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      }
    });
    
    const responseText = response.data.content[0].text;
    
    // מציאת האובייקט JSON בתשובה
    const jsonMatch = responseText.match(/({[\s\S]*})/);
    if (!jsonMatch) {
      console.log(`⚠️ לא נמצא JSON בתשובה. ניסיון ${attempt}/3`);
      await sleep(2000);
      return getWordObject(word, index, attempt + 1);
    }
    
    const jsonText = jsonMatch[1];
    
    try {
      const wordObj = JSON.parse(jsonText);
      
      // עדכון האינדקס
      wordObj.index = index;
      
      // אפשר גם לעדכן את המזהה הייחודי שיצרנו למעלה
      if (!wordObj._id || !wordObj._id.$oid) {
        wordObj._id = { $oid: randomId };
      }
      
      // בדיקת איכות
      const { isValid, message } = validateQuality(wordObj, word);
      if (!isValid) {
        console.log(`⚠️ בעיית איכות: ${message}. ניסיון ${attempt}/3`);
        await sleep(2000);
        return getWordObject(word, index, attempt + 1);
      }
      
      return { obj: wordObj, message };
      
    } catch (e) {
      console.log(`⚠️ שגיאת פענוח JSON: ${e.message}. ניסיון ${attempt}/3`);
      await sleep(2000);
      return getWordObject(word, index, attempt + 1);
    }
  } catch (e) {
    console.log(`⚠️ שגיאה בבקשת API: ${e.message}. ניסיון ${attempt}/3`);
    await sleep(5000);
    return getWordObject(word, index, attempt + 1);
  }
}

// פונקציה ראשית לעיבוד כל המילים
async function processAllWords(words) {
  const results = [];
  const failedWords = [];
  
  // יצירת תיקיות לשמירת תוצאות
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(FAILED_DIR, { recursive: true });
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const actualIndex = START_INDEX + i;
    const outputFile = path.join(OUTPUT_DIR, `word_${String(actualIndex).padStart(3, '0')}_${word}.json`);
    
    // בדיקה אם המילה כבר עובדה
    try {
      const fileExists = await fs.access(outputFile).then(() => true).catch(() => false);
      
      if (fileExists) {
        const fileData = await fs.readFile(outputFile, 'utf8');
        const wordObj = JSON.parse(fileData);
        results.push(wordObj);
        console.log(`✓ נטען מקובץ קיים: ${word}`);
        continue;
      }
    } catch (error) {
      // קובץ לא קיים או שגיאה אחרת, נמשיך לעיבוד המילה
    }
    
    console.log(`\nמעבד מילה ${i+1}/${words.length}: ${word}`);
    const { obj: wordObj, message } = await getWordObject(word, START_INDEX + i);
    
    if (wordObj) {
      // שמירת תוצאה בקובץ
      await fs.writeFile(outputFile, JSON.stringify(wordObj, null, 2), 'utf8');
      
      results.push(wordObj);
      console.log(`✓ הושלם בהצלחה: ${word} - ${message}`);
    } else {
      const failedInfo = { index: i, word, reason: message };
      failedWords.push(failedInfo);
      
      await fs.writeFile(
        path.join(FAILED_DIR, `word_${String(i).padStart(3, '0')}_${word}.json`),
        JSON.stringify(failedInfo, null, 2),
        'utf8'
      );
      
      console.log(`❌ נכשל: ${word} - ${message}`);
    }
    
    // שמירת תוצאות ביניים כל 5 מילים
    if ((i+1) % 5 === 0 || i === words.length - 1) {
      await fs.writeFile(
        path.join(OUTPUT_DIR, 'word_database_partial.json'),
        JSON.stringify(results, null, 2),
        'utf8'
      );
      
      if (failedWords.length > 0) {
        await fs.writeFile(
          path.join(OUTPUT_DIR, 'failed_words.json'),
          JSON.stringify(failedWords, null, 2),
          'utf8'
        );
      }
    }
    
    // השהייה למניעת חריגה ממגבלות API
    await sleep(2000);
  }
  
  // שמירת התוצאות הסופיות
  await fs.writeFile(FINAL_OUTPUT, JSON.stringify(results, null, 2), 'utf8');
  
  return { results, failedWords };
}

// פונקציה ראשית
async function main() {
  try {
    // ודא שהמפתח של API קיים
    if (!API_KEY) {
      console.error('שגיאה: מפתח API של Claude לא נמצא במשתני הסביבה. וודא שקובץ .env מוגדר כראוי.');
      return;
    }
    
    const words = await loadWordList(WORD_LIST_PATH);
    
    if (words.length === 0) {
      console.error('רשימת המילים ריקה. אנא בדוק את הקובץ.');
      return;
    }
    
    console.log(`מתחיל בעיבוד ${words.length} מילים...`);
    const { results, failedWords } = await processAllWords(words);
    
    console.log("\n===== סיכום =====");
    console.log(`סך הכל מילים שעובדו: ${results.length}`);
    console.log(`סך הכל מילים שנכשלו: ${failedWords.length}`);
    
    if (failedWords.length > 0) {
      console.log("\nמילים שנכשלו:");
      failedWords.forEach(item => {
        console.log(`- ${item.word}: ${item.reason}`);
      });
    }
  } catch (error) {
    console.error('שגיאה:', error);
  }
}

// הפעלת הסקריפט
main();