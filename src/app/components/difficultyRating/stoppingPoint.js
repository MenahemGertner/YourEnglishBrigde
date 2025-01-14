'use client'
import { Cat } from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

const StoppingPoint = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lastPosition, setLastPosition] = useState(null);

  // Fetch last position from server
  const { data: serverPosition, mutate } = useSWR(
    session?.user ? '/api/userWords/userPosition' : null,
    fetcher
  );

  // Update position on server when user navigates
  useEffect(() => {
    if (session?.user && pathname.includes('/words')) {
      const currentIndex = searchParams.get('index');
      const currentCategory = searchParams.get('category') || '500';

      if (currentIndex) {
        const position = {
          index: currentIndex,
          category: currentCategory
        };

        // Update local state
        setLastPosition(position);
        
        // Update server
        fetch('/api/userWords/userPosition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(position)
        }).then(() => mutate());
      }
    }
  }, [pathname, searchParams, session, mutate]);

  // Set initial position from server data
  useEffect(() => {
    if (serverPosition) {
      setLastPosition(serverPosition);
    }
  }, [serverPosition]);

  if (!session) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href={`/words?index=${lastPosition?.index || 1}&category=${lastPosition?.category || '500'}`}>
        <div className="relative group">
          <Cat 
            className="h-14 w-14 transition-colors duration-200 text-blue-900 hover:text-blue-700"
          />
          
          <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded-md p-2 shadow-lg -right-2 bottom-full mb-1 text-sm text-gray-700 whitespace-nowrap">
            {lastPosition
              ? `חזרה למילה מספר ${lastPosition.index}`
              : 'התחל מההתחלה'
            }
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StoppingPoint;