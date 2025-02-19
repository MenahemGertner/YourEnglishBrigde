import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

async function fetchWordLists(category = '500') {
  try {
    const headersList = await headers();
    const domain = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const response = await fetch(
      `${protocol}://${domain}/wordLists/api/list?category=${category}`, 
      { 
        cache: 'no-store',
        next: { revalidate: 3600 }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch word lists');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching word lists:', error);
    return null;
  }
}

export default async function UsefulWordsPage({ searchParams }) {
  const { category = '500' } = await Promise.resolve(searchParams);
  
  const data = await fetchWordLists(category);
  
  if (!data || data.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
        {parseInt(category) - 499} - {category} המילים השימושיות ביותר באנגלית
      </h1>
      <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[...data]
          .sort((a, b) => a.index - b.index) 
          .map((item) => (
            <Link 
              href={`/words?index=${item.index}&category=${category}`}
              key={item._id}
              className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded p-4 transition duration-200 hover:border-blue-200 hover:translate-y-[-2px]"
            >
              <div className="flex flex-col text-center py-1">
                <span className="text-sm text-gray-500 mb-1">{item.index}</span>
                <span className="text-lg font-semibold text-gray-800">{item.word}</span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}