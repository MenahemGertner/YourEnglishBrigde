'use client'
import { createContext } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import MainCard from "./card/components/mainCard";
import ExtractInfo from "./card/components/additionalInfo";
import NextAndPrevious from "./navigation/components/nextAndPrevious";
import GlobeLoader from '@/components/features/Loading';
import StatusIcons from './navigation/components/statusIcons';
import ProContent from '@/components/auth/ProContent';
import GuestContent from '@/components/auth/GuestContent';


export const WordContext = createContext(null);

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export default function Word() {
  const searchParams = useSearchParams();
const index = searchParams.get('index');
const category = searchParams.get('category') || '500';

const { data, error, isLoading } = useSWR(
  index ? `words/card/api/word?index=${index}&category=${category}` : null,
  fetcher
);

  if (isLoading) return <GlobeLoader/>;
  if (error) return <div>שגיאה: {error.message}</div>;
  if (!data) return <div>לא נמצא מידע עבור המילה</div>;

  return (
    <WordContext.Provider value={data}>
      <div  className="min-h-screen flex items-center justify-center flex-col py-8">
        <MainCard />
        <div className="mb-4 mt-8">
          <ExtractInfo/>
        </div>
        <ProContent>
        <StatusIcons/>
        </ProContent>
        <GuestContent>
        <NextAndPrevious/> 
        </GuestContent>       
      </div>
    </WordContext.Provider>
  );
}