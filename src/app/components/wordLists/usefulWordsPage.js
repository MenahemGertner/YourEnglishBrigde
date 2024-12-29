'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import GlobeLoader from '../common/Loading'

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to fetch');
  }
  return response.json();
};

export default function UsefulWordsPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('500');

  useEffect(() => {
    const categoryParam = searchParams.get('category') || '500';
    const normalizedCategory = categoryParam.toLowerCase();
    setCategory(normalizedCategory);
  }, [searchParams]);

  const { data, error, isLoading } = useSWR(
    `/api/list?category=${category}`,
    fetcher
  );

  if (isLoading) return <GlobeLoader/>;
  if (error) return <div>שגיאה: {error.message}</div>;
  if (!data || data.length === 0) return <div>לא נמצאו נתונים</div>;

return (
  <div className="container mx-auto my-16">
    <h1 className="text-center text-2xl font-bold mb-16">
      {category - 499} - {category} המילים השימושיות ביותר באנגלית
    </h1>
    <div className="grid md:grid-cols-5 gap-4">
      {[...data]
        .sort((a, b) => a.index - b.index) 
        .map((item) => (
          <div
            key={item._id}
            className="bg-white shadow rounded p-4 hover:bg-blue-50 transition"
          >
            <Link href={`/words?index=${item.index}`}>
              <div className="flex flex-col text-center">
                <span>{item.index}</span>
                <span className='text-xl font-semibold'>{item.word}</span>
              </div>
            </Link>
          </div>
        ))}
    </div>
  </div>
);
}