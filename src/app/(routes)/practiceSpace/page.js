import { getChallengingWords } from './actions/getChallengingWords';
import PracticeSpace from './practiceSpace';

export default async function PracticePage() {
  const result = await getChallengingWords();

  const all = [...result.level2, ...result.level3, ...result.level4];
  const baseWords = [];
  const inflections = [];

  all.forEach(({ word, inf }) => {
    if (word) baseWords.push(word);
    if (Array.isArray(inf)) inflections.push(...inf);
  });

  const userWords = [...new Set(baseWords)];
  const wordInflections = [...new Set(inflections)];

  return (
    <PracticeSpace userWords={userWords} wordInflections={wordInflections} />
  );
}
