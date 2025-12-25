// app/(routes)/(games)/prepositions/page.js

'use client';

import { useRouter } from 'next/navigation';
import LevelSelector from './components/LevelSelector';

export default function PrepositionsGamePage() {
  const router = useRouter();

  const handleSelectLevel = (levelId) => {
    router.push(`/prepositions/play?level=${levelId}`);
  };

  return <LevelSelector onSelectLevel={handleSelectLevel} />;
}