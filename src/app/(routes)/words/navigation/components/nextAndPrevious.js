'use client'
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  return data.completed ? null : data;
};

const NextAndPrevious = ({ category = '500', index }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: nextWordData } = useSWR(
    index ? `/words/navigation/api/wordNavigation?direction=next&index=${index}` : null,
    fetcher
  );

  const { data: prevWordData } = useSWR(
    index ? `/words/navigation/api/wordNavigation?direction=prev&index=${index}` : null,
    fetcher
  );

  const handleNext = () => {
    if (nextWordData) {
      router.push(`/words?index=${nextWordData.index}&category=${nextWordData.category}`);
    }
  };
    
  const handlePrev = () => {
    if (prevWordData) {
      router.push(`/words?index=${prevWordData.index}&category=${prevWordData.category}`);
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