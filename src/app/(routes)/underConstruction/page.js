'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Construction, Home, ChevronRight } from 'lucide-react';

const UnderConstruction = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center my-8">
      <div className="text-center max-w-xl mx-auto">
        <Construction className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-bounce" />
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          העמוד בבנייה{dots}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8" dir='ltr'>
          !אנחנו עובדים במרץ כדי להביא לכם את התוכן הטוב ביותר
        </p>
        
        <div className="bg-yellow-100 p-4 rounded-lg mb-8">
          <p className="text-yellow-800">
            🚧 צוות הפיתוח שלנו עובד על זה ממש עכשיו 🚧
          </p>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-800 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          <Home className="w-5 h-5 ml-2" />
          חזרה לדף הבית
          <ChevronRight className="w-5 h-5 mr-2" />
        </Link>
      </div>
    </div>
  );
};

export default UnderConstruction;