'use client'
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Brain, Star, Cat } from 'lucide-react';

const StartLearn = () => {
  const searchParams = useSearchParams();
  const level = parseInt(searchParams.get('level') || '1');
  
  // חישוב האינדקס ההתחלתי לפי הרמה
  const startIndex = (level - 1) * 500 + 1;
  
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "2500 המילים הנפוצות ביותר",
      description: "לימוד שיטתי של אוצר המילים החיוני ביותר באנגלית."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "למידה מותאמת אישית",
      description: "עבודה על כל חלקי השפה. קריאה, שמיעה, דיבור וכתיבה."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "תרגול אינטראקטיבי",
      description: "הגייה, משפטי דוגמה והקשרים להטמעה מיטבית."
    },
    {
      icon: <Cat className="w-6 h-6" />,
      title: "מדריך אישי",
      description: "מעקב אחר התקדמות וחזרה חכמה על מילים מאתגרות לצורך הטמעה מירבית."
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="text-center p-6 border-b">
          <h1 className="text-3xl font-bold">
            הסבר לתכנית לימוד עבור רמה {level}
          </h1>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <p className="text-lg text-center mb-8">
              ברוכים הבאים לתכנית הלימוד המתקדמת שלנו! 
              כאן תלמדו את {500} המילים החשובות ביותר ברמה {level}.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">איך זה עובד?</h3>
              <p className="mb-4">
                בכל כרטיס לימוד תמצאו:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>תרגום מדויק של המילה</li>
                <li>משפטי דוגמה להבנת ההקשר</li>
                <li>הטיות ומידע מגוון להבנה נרחבת של המושג</li>
                <li>דירוג כל מילה לפי רמת הקושי</li>
              </ul>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">מערכת חזרות והטמעה חכמה</h3>
              <p className="mb-4">
                לאחר כל יחידת לימוד, המערכת מעבירה אתכם לשלב ההטמעה המתקדם:
              </p>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-green-700 mb-2">אלגוריתם למידה מתקדם</h4>
                  <p className="text-gray-600">
                    מערכת חכמה המזהה את המילים המאתגרות עבורכם ומתאימה את תכנית החזרות בהתאם.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-green-700 mb-2">תרגול מקיף בארבעה מימדים</h4>
                  <p className="text-gray-600">
                    כל מילה נלמדת דרך קריאה, שמיעה, דיבור וכתיבה, תוך התאמה לרמת המשתמש והשלב הנוכחי.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center p-6 border-t">
          <button 
            className="bg-blue-900 hover:bg-blue-700 text-white px-8 py-3 rounded text-lg font-semibold transition-colors"
            onClick={() => window.location.href = `/words?index=${startIndex}`}
          >
            להתחיל כבר בתכנית!
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartLearn;