import React from 'react';
import MethodAdvantages from './utils/programExplanation';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4 animate-fade-in pb-4">
              Your English Bridge
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-800 mb-6">
              לשבור את מחסום השפה
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
              הדרך החכמה והיעילה ללמוד אנגלית. 
              מותאם אישית, שיטה יחודית ופורצת דרך, פשוט עובד!
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                התחל ללמוד עכשיו
              </button>
              <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                גלה עוד
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <Hero />
      <div className="bg-gradient-to-b from-white to-blue-50">
        <MethodAdvantages />
      </div>
      {/* ניתן להוסיף כאן סקציות נוספות */}
    </main>
  );
}