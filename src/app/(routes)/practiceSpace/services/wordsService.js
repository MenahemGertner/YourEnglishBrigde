// app/practiceSpace/services/wordsService.js - גרסה מהירה

import { supabaseAdmin } from '@/lib/db/supabase';
import { requireAuth } from '@/utils/auth-helpers';
import { getWordsByIndices } from '@/lib/db/getWordByIndex'; // ← שים לב לשינוי!

export async function getUserWordsData() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    // 1️⃣ קבל את רשימת המילים של המשתמש
    const { data: userWords, error: wordsError } = await supabaseAdmin
      .from('user_words')
      .select('word_id, level')
      .eq('user_id', userId)
      .not('word_id', 'is', null);

    if (wordsError) {
      throw new Error('שגיאה בשליפת המילים');
    }

    // 2️⃣ ארגן לפי רמות
    const wordIndicesByLevel = {
      level2: [],
      level3: [],
      level4: []
    };

    userWords.forEach(item => {
      if (item.word_id && item.level >= 2 && item.level <= 4) {
        wordIndicesByLevel[`level${item.level}`].push(parseInt(item.word_id));
      }
    });

    // הסר כפילויות
    for (const level of [2, 3, 4]) {
      wordIndicesByLevel[`level${level}`] = [...new Set(wordIndicesByLevel[`level${level}`])];
    }

    // קבל את כל האינדקסים הייחודיים
    const allIndices = [
      ...wordIndicesByLevel.level2,
      ...wordIndicesByLevel.level3,
      ...wordIndicesByLevel.level4
    ];

    // 🔥 3️⃣ קבל את כל המילים בשאילתה אחת (במקום N שאילתות!)
    const validWords = await getWordsByIndices(allIndices);

    // 4️⃣ הוסף את ה-originalIndex לכל מילה
    const indexToWordMap = {};
    validWords.forEach(word => {
      // מצא את האינדקס המקורי מה-_id
      const idStr = word._id.toString();
      const indexMatch = idStr.match(/(\d{4})$/);
      if (indexMatch) {
        word.originalIndex = parseInt(indexMatch[1]);
        indexToWordMap[word.originalIndex] = word;
      }
    });

    // 5️⃣ עבד על הנתונים
    const baseWords = [];
    const inflections = [];
    const combinedWords = [];
    const challengingWordsByLevel = {
      level2: [],
      level3: [],
      level4: []
    };
    const wordTranslations = {};

    const indexToLevel = {};
    userWords.forEach(item => {
      if (item.word_id && item.level >= 2 && item.level <= 4) {
        indexToLevel[parseInt(item.word_id)] = item.level;
      }
    });

    validWords.forEach(wordData => {
      const level = indexToLevel[wordData.originalIndex];
      
      if (level && wordData.word) {
        challengingWordsByLevel[`level${level}`].push(wordData.word);
        if (wordData.tr) {
          wordTranslations[wordData.word] = wordData.tr;
        }
      }
      
      if (wordData.word) {
        baseWords.push(wordData.word);
        combinedWords.push(wordData.word);
      }
      
      if (wordData.inf && Array.isArray(wordData.inf)) {
        inflections.push(...wordData.inf);
        combinedWords.push(...wordData.inf);
      }
    });

    const uniqueBaseWords = [...new Set(baseWords)];
    const uniqueInflections = [...new Set(inflections)];
    const uniqueCombinedWords = [...new Set(combinedWords)];

    for (const level of [2, 3, 4]) {
      challengingWordsByLevel[`level${level}`] = [...new Set(challengingWordsByLevel[`level${level}`])];
    }

    return {
      words: uniqueBaseWords,
      inflections: uniqueInflections,
      allWords: uniqueCombinedWords,
      challengingWords: challengingWordsByLevel,
      wordTranslations,
      stats: {
        level2: challengingWordsByLevel.level2.length,
        level3: challengingWordsByLevel.level3.length,
        level4: challengingWordsByLevel.level4.length,
        baseWords: uniqueBaseWords.length,
        inflections: uniqueInflections.length,
        total: uniqueCombinedWords.length
      }
    };

  } catch (error) {
    console.error('Full error:', error);
    throw new Error(error.message || 'שגיאת שרת פנימית');
  }
}
