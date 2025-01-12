'use client'
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { WordContext } from '../../(routes)/words/page.js';
import { useSession } from "next-auth/react";
import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return response.json();
};

const NextAndPrevious = () => {
  const router = useRouter();
  const currentWord = useContext(WordContext);
  const { data: session } = useSession();

  const category = currentWord?.category || '500';
  const index = currentWord?.index;

  const { data: nextWordData } = useSWR(
    index ? `/api/nextAndPrevious?category=${category}&direction=next&index=${index}` : null,
    fetcher
  );

  const { data: prevWordData } = useSWR(
    index ? `/api/nextAndPrevious?category=${category}&direction=prev&index=${index}` : null,
    fetcher
  );

  const handleNext = () => {
    if (nextWordData) {
      router.push(`/words?index=${nextWordData.index}&category=${category}`);
    }
  };

  const handlePrev = () => {
    if (prevWordData) {
      router.push(`/words?index=${prevWordData.index}&category=${category}`);
    }
  };

  return (
    <div className="w-80 min-w-[250px] sm:w-80 mx-2 sm:mx-auto border-t p-4 flex justify-between md:w-96 lg:w-[550px]">
      <button 
        onClick={handlePrev}
        disabled={!prevWordData}
        className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-800"
      >
        הקודם
      </button>
      <button 
        onClick={handleNext}
        disabled={!nextWordData}
        className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-800"
      >
        הבא
      </button>
    </div>
  );
};

export default NextAndPrevious;