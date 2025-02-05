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
    <div className="container mx-auto my-16">
      <h1 className="text-center text-2xl font-bold mb-16">
        {parseInt(category) - 499} - {category} המילים השימושיות ביותר באנגלית
      </h1>
      <div className="grid md:grid-cols-5 gap-4">
        {[...data]
          .sort((a, b) => a.index - b.index) 
          .map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded p-4 hover:bg-blue-50 transition"
            >
              <Link href={`/words?index=${item.index}&category=${category}`}>
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