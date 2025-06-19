import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWordsByCategory } from '@/lib/db/getWordsByCategory';

export default async function UsefulWordsPage(props) {
  const { searchParams } = props;
  const resolvedParams = await Promise.resolve(searchParams);
  const category = resolvedParams?.category || '300';

  let data;
  try {
    data = await getWordsByCategory(category);
  } catch (err) {
    console.error(err);
    notFound();
  }

  if (!data || data.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto my-10 px-4">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
        {parseInt(category) - 299} - {category} המילים השימושיות ביותר באנגלית
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
