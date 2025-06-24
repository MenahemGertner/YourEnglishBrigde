// lib/services/wordsService.js
import { createServerClient } from '@/lib/db/supabase';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { getWordByIndex } from '@/lib/db/getWordByIndex'; // השירות הקיים שלך

export async function getUserWordsData() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.accessToken) {
      throw new Error('יש להתחבר כדי לצפות במילים');
    }

    // יצירת לקוח Supabase עם הטוקן של המשתמש
    const supabaseClient = createServerClient(session.accessToken);
    
    // Get user ID
    const userId = session.user.id;
    let userIdToUse;
    
    if (!userId) {
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userError) {
        throw new Error('משתמש לא נמצא');
      }
      
      userIdToUse = userData.id;
    } else {
      userIdToUse = userId;
    }

    // Get word indices and their levels
    const { data: userWords, error: wordsError } = await supabaseClient
      .from('user_words')
      .select('word_id, level')
      .eq('user_id', userIdToUse)
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