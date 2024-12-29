'use client'
import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce function
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      }
    }, 500); // חיפוש 500 מילישניות אחרי הפסקת ההקלדה

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      // דמה חיפוש - החלף בלוגיקת חיפוש האמיתית שלך
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('מחפש:', searchQuery);
    } catch (error) {
      console.error('שגיאה בחיפוש:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center mr-auto justify-start w-full max-w-xs"
    >
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        />
        <SearchIcon 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20} 
        />
      </div>
      {isLoading && (
        <Loader2 
          className="mr-2 animate-spin text-blue-500" 
          size={24} 
        />
      )}
    </form>
  );
};

export default Search;