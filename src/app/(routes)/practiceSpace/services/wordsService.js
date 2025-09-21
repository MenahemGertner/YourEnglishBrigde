import { supabaseAdmin } from '@/lib/db/supabase';
import { requireAuth } from '@/utils/auth-helpers';
import { getWordByIndex } from '@/lib/db/getWordByIndex';

export async function getUserWordsData() {
  try {
    // אימות פשוט - מחזיר את הsession עם user.id
    const session = await requireAuth();
    const userId = session.user.id;

    // Get word indices and their levels
    const { data: userWords, error: wordsError } = await supabaseAdmin
      .from('user_words')
      .select('word_id, level')
      .eq('user_id', userId)
      .not('word_id', 'is', null);

    if (wordsError) {
      throw new Error('שגיאה בשליפת המילים');
    }

    // Organize indices by level
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

    // Remove duplicates
    for (const level of [2, 3, 4]) {
      wordIndicesByLevel[`level${level}`] = [...new Set(wordIndicesByLevel[`level${level}`])];
    }

    // Get all unique indices
    const allIndices = [
      ...wordIndicesByLevel.level2,
      ...wordIndicesByLevel.level3,
      ...wordIndicesByLevel.level4
    ];

    // Fetch words using your existing server component
    const wordPromises = allIndices.map(async (index) => {
      try {
        const wordData = await getWordByIndex(index);
        return { ...wordData, originalIndex: index };
      } catch (error) {
        console.error(`Error fetching word ${index}:`, error);
        return null;
      }
    });

    const wordResults = await Promise.all(wordPromises);
    const validWords = wordResults.filter(word => word !== null);

    // Process data for components
    const baseWords = []; // המילים הבסיסיות בלבד
    const inflections = []; // ההטיות בלבד
    const combinedWords = []; // המילים הבסיסיות + ההטיות (לתאימות לאחור)
    const challengingWordsByLevel = { // For ChallengingWords component
      level2: [],
      level3: [],
      level4: []
    };
    const wordTranslations = {}; // מפת תרגומים לפי מילה

    // Create a map of index to level for easy lookup
    const indexToLevel = {};
    userWords.forEach(item => {
      if (item.word_id && item.level >= 2 && item.level <= 4) {
        indexToLevel[parseInt(item.word_id)] = item.level;
      }
    });

    // Process each word
    validWords.forEach(wordData => {
      const level = indexToLevel[wordData.originalIndex];
      
      // Add to challenging words by level (base word only)
      if (level && wordData.word) {
        challengingWordsByLevel[`level${level}`].push(wordData.word);
        // שמירת התרגום במפה נפרדת
        if (wordData.tr) {
          wordTranslations[wordData.word] = wordData.tr;
        }
      }
      
      // Add base word
      if (wordData.word) {
        baseWords.push(wordData.word);
        combinedWords.push(wordData.word); // לתאימות לאחור
      }
      
      // Add inflections
      if (wordData.inf && Array.isArray(wordData.inf)) {
        inflections.push(...wordData.inf);
        combinedWords.push(...wordData.inf); // לתאימות לאחור
      }
    });

    // Remove duplicates
    const uniqueBaseWords = [...new Set(baseWords)];
    const uniqueInflections = [...new Set(inflections)];
    const uniqueCombinedWords = [...new Set(combinedWords)];

    // Remove duplicates from challenging words by level
    for (const level of [2, 3, 4]) {
      challengingWordsByLevel[`level${level}`] = [...new Set(challengingWordsByLevel[`level${level}`])];
    }

    return {
      words: uniqueBaseWords, // המילים הבסיסיות
      inflections: uniqueInflections, // ההטיות
      allWords: uniqueCombinedWords, // לתאימות לאחור - כל המילים ביחד
      challengingWords: challengingWordsByLevel,
      wordTranslations, // מפת תרגומים
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