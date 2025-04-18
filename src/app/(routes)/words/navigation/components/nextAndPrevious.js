// app/words/navigation/components/NextAndPrevious.js
import Link from 'next/link';
import { getAdjacentIndex } from '../helpers/navigationHelpers';

export default function NextAndPrevious({ index, categorySize }) {
  const currentIndex = parseInt(index);
  const nextIndex = getAdjacentIndex(currentIndex, 'next', categorySize);
  const prevIndex = getAdjacentIndex(currentIndex, 'prev', categorySize);
  
  const buttonClasses = `bg-gradient-to-r from-blue-100 to-purple-100 
                          px-6 py-3 duration-300 hover:scale-110 rounded
                           w-24 text-center`;
  
  return (
    <div className="w-80 min-w-[250px] sm:w-80 mx-2 sm:mx-auto border-t p-4 flex justify-between md:w-96 lg:w-[500px]">
      <Link
        href={prevIndex ? `/words?index=${prevIndex}` : '#'}
        className={`
          ${buttonClasses}
          ${!prevIndex ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-800'}
        `}
        aria-disabled={!prevIndex}
      >
        הקודם
      </Link>
      <Link
        href={nextIndex ? `/words?index=${nextIndex}` : '#'}
        className={`
          ${buttonClasses}
          ${!nextIndex ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-800'}
        `}
        aria-disabled={!nextIndex}
      >
        הבא
      </Link>
    </div>
  );
}