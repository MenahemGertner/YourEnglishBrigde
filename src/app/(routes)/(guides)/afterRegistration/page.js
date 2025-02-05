'use client'

import { Cat } from 'lucide-react';
import Link from 'next/link';

const AfterRegistration = () => {

  const programs = [
    { name: 'מתחילים מהבסיס', href: '/beginners' },
    { name: 'רמה 1', href: '/startLearn?level=1' },
    { name: 'רמה 2', href: '/startLearn?level=2' },
    { name: 'רמה 3', href: '/startLearn?level=3' },
    { name: 'רמה 4', href: '/startLearn?level=4' },
    { name: 'רמה 5', href: '/startLearn?level=5' },
    { name: 'מתקדמים', href: '/advanced' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-3xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-56 animate-fade-in">
          נרשמת בהצלחה!
        </h2>

        {/* סקשן החתול והטקסט */}
        <div className="relative inline-block mb-16">
          <Link
            href="/checkYourLevel"
            className="group block relative transition-all duration-300 hover:scale-110"
          >
            <Cat
              className="h-32 w-32 transition-all duration-300 text-blue-900 group-hover:text-blue-700"
            />
            <div className="
              absolute bg-white border-2 border-blue-100 rounded-xl p-6
              shadow-lg -right-2 bottom-full mb-4 text-md md:text-lg text-gray-700
              whitespace-normal w-64 md:w-80
              transition-all duration-300
             ">
              לחיצה עלי, כדי שנדע את רמת האנגלית שלך, ושכבר נתחיל במסלול הלימוד האישי שלך!
              <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-r-2 border-b-2 border-blue-100 transform rotate-45" />
            </div>
          </Link>
        </div>

        <div className="space-y-4 pt-16">
          <p className="text-lg text-gray-600">כבר בדקת את רמת האנגלית שלך?</p>
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

export default AfterRegistration;