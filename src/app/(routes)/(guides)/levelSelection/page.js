'use client'

import { Cat } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const LevelSelection = () => {
  const searchParams = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // בדוק אם יש פרמטר showWelcome ב-URL
    const shouldShowWelcome = searchParams.get('showWelcome') === 'true';
    
    if (shouldShowWelcome) {
      setShowWelcome(true);
      
      // הסר את ההודעה אחרי 3 שניות
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  
  const programs = [
    { name: 'מתחילים מהבסיס', href: '/underConstruction' },
    { name: 'רמה 1', href: '/words?index=1&category=300' },
    { name: 'רמה 2', href: '/words?index=301&category=600' },
    { name: 'רמה 3', href: '/words?index=601&category=900' },
    { name: 'רמה 4', href: '/words?index=901&category=1200' },
    { name: 'רמה 5', href: '/words?index=1201&category=1500' },
    { name: 'מתקדמים', href: '/underConstruction' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-50 to-white flex flex-col items-center justify-center p-8 my-28">
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold">ברוך הבא!</h2>
          </div>
        </div>
      )}
      <div className="text-center max-w-3xl mx-auto space-y-12">

        {/* סקשן החתול והטקסט */}
        <div className="relative inline-block mb-4">
          <Link
            href="/checkYourLevel"
            className="group block relative transition-all duration-300 hover:scale-110"
          >
            <Cat
              className="h-32 w-32 transition-all duration-300 text-indigo-900 group-hover:text-indigo-700"
            />
            <div className="
              absolute bg-white border-2 border-blue-100 rounded-xl p-6
              shadow-lg -right-2 bottom-full mb-4 text-md md:text-lg text-gray-700
              whitespace-normal w-64 md:w-80
              transition-all duration-300
             ">
              בכדי שהלימוד יהיה יעיל ואפקטיבי, יש לבחור את רמת הלימוד המתאימה. לבדיקת רמה לחץ כאן
              <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-r-2 border-b-2 border-blue-100 transform rotate-45" />
            </div>
          </Link>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-600">כבר יודע את רמת האנגלית שלך?</p>
        </div>

        {/* תוכניות לימוד */}
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-gray-800">בחר תכנית להתחיל</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {programs.map((program) => (
              <Link
                key={program.name}
                href={program.href}
                className="
                  p-4 bg-white rounded-lg shadow-md border border-blue-50
                  hover:shadow-lg hover:border-blue-200 transition-all duration-200
                  text-gray-700 hover:text-blue-800
                "
              >
                {program.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;