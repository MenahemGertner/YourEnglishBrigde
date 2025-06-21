'use server';

import { createServerClient } from '@/lib/db/supabase';
import { getWordByIndex } from '@/lib/db/getWordByIndex';

export async function getChallengingWords(userId) {
  if (!userId) {
    throw new Error('Authentication required');
  }

  // כאן יוצרים את ה-client בלי accessToken - אם אתה צריך אותו,
  // אפשר להוסיף אותו כפרמטר גם כן ולהעביר מהקליינט.
  const supabase = createServerClient();

  const { data: userWords, error } = await supabase
    .from('user_words')
    .select('word_id, level')
    .eq('user_id', userId)
    .not('word_id', 'is', null);

  if (error) {
    throw new Error('שגיאה בשליפת המילים');
  }

  const grouped = {
    level2: [],
    level3: [],
    level4: []
  };

  userWords.forEach(({ word_id, level }) => {
    if (level >= 2 && level <= 4) {
      grouped[`level${level}`].push(parseInt(word_id));
    }
  });

  for (const key in grouped) {
    grouped[key] = [...new Set(grouped[key])];
  }

  const getWords = async (indices) => {
    const wordResults = await Promise.all(indices.map((i) => getWordByIndex(i)));
    return wordResults
      .filter(w => w && w.word)
      .map(w => ({
        word: w.word,
        inf: w.inf || [],
      }));
  };

  return {
    level2: await getWords(grouped.level2),
    level3: await getWords(grouped.level3),
    level4: await getWords(grouped.level4),
  };
}
