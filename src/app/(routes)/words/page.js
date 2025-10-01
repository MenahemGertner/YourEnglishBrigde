import MainCard from "./card/components/mainCard";
import NavigationWrapper from "./navigation/NavigationWrapper";
import { notFound } from 'next/navigation';
import { ColorProvider } from './navigation/components/colorContext';
import { WindowProvider } from './card/providers/WindowContext';
import FeedbackButton from "./card/feedbackButton/components/feedbackButton";
import { getWordByIndex } from '@/lib/db/getWordByIndex';

export default async function Word({ searchParams }) {
  const params = await searchParams;
  const index = parseInt(params.index);
  
  if (!index) {
    notFound();
  }

  let data;
  try {
    data = await getWordByIndex(index);
  } catch (error) {
    console.error('Failed to load word data:', error);
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col py-8">
      <ColorProvider>
        <WindowProvider>
          <MainCard 
            word={data.word} 
            index={data.index} 
            tr={data.tr}
            ps={data.ps} 
            inf={data.inf} 
            infl={data.infl} 
            ex={data.ex}
            syn={data.synonyms} 
            con={data.confused}
          />
          
          <div className="py-6"/>
          
          {/* כל לוגיקת הניווט עטופה בקומפוננט אחד */}
          <NavigationWrapper 
            index={data.index} 
            category={data.category}
            categorySize={data.categorySize}
          />         
          <FeedbackButton/>
        </WindowProvider>
      </ColorProvider>
    </div>
  );
}