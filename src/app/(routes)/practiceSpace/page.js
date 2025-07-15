// app/practiceSpace/page.js - Server Component חדש
import { getUserWordsData } from './services/wordsService';
import PracticeSpaceClient from './components/practiceSpaceClient';

export default async function PracticeSpace() {
  // שליפת נתוני המילים בServer Component
  let wordsData;
  try {
    wordsData = await getUserWordsData();
  } catch (error) {
    console.error('Failed to load user words:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">שגיאה בטעינת המילים</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return <PracticeSpaceClient wordsData={wordsData} />;
}