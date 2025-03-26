import MainCard from "./card/components/mainCard";
// import ExtractInfo from "./card/components/additionalInfo";
import NextAndPrevious from "./navigation/components/nextAndPrevious";
import StatusIcons from './navigation/components/statusIcons';
import ProContent from '@/components/auth/ProContent';
import GuestContent from '@/components/auth/GuestContent';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import SequenceReset from './navigation/personalGuide/components/sequenceReset'
import { ColorProvider } from './navigation/components/colorContext';
import { WindowProvider } from './card/providers/WindowContext'


async function getWordData(index, category = '500') {
  try {
    const headersList = await headers();
    const domain = headersList.get('host');
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
  const categorySize = data.categorySize;
  
  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col py-8">
      <ColorProvider>
      <WindowProvider>
      <MainCard word={data.word} index={data.index} tr={data.tr}
                ps={data.ps} inf={data.inf} infl={data.infl} ex={data.ex}
                syn={data.synonyms} con={data.confused}/>               
      <div className="mb-4 mt-8">
      {/* <ExtractInfo infl={data.infl} der={data.der} ex={data.ex}
                    syn={data.synonyms} con={data.confused}/> */}
      </div>
      <ProContent>
        <StatusIcons word={data.word} index={data.index}
                      category={category} inf={data.inf}/>
        <SequenceReset/>
      </ProContent>
      <GuestContent>
      <NextAndPrevious index={data.index} categorySize={categorySize} />
      </GuestContent>
      </WindowProvider>
      </ColorProvider>
    </div>
  );
}