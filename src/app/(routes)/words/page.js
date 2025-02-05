import MainCard from "./card/components/mainCard";
import ExtractInfo from "./card/components/additionalInfo";
import NextAndPrevious from "./navigation/components/nextAndPrevious";
import StatusIcons from './navigation/components/statusIcons';
import ProContent from '@/components/auth/ProContent';
import GuestContent from '@/components/auth/GuestContent';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

async function getWordData(index, category = '500') {
  try {
    const headersList = await headers();
    const domain = await headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const response = await fetch(
      `${protocol}://${domain}/words/card/api/word?index=${index}&category=${category}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch word data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching word data:', error);
    return null;
  }
}

export default async function Word({ searchParams }) {
  const { index, category = '500' } = await Promise.resolve(searchParams);
  
  if (!index) {
    notFound();
  }

  const data = await getWordData(index, category);
  
  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col py-8">
      <MainCard word={data.word} index={data.index} tr={data.tr}
                ps={data.ps} inf={data.inf} sen={data.sen}/>
      <div className="mb-4 mt-8">
      <ExtractInfo 
  inflections={data.infl}
  derivatives={data.der}
  expressions={data.ex}
  synonyms={data.synonyms}
  confusedWords={data.confused}
/>
      </div>
      <ProContent>
        <StatusIcons wordData={data} />
      </ProContent>
      <GuestContent>
        <NextAndPrevious category={data.category} index={data.index} />
      </GuestContent>
    </div>
  );
}