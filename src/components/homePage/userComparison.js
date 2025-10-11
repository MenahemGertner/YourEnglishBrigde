'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { User, UserPlus, Check, Book, BarChart2, Brain, Bookmark, AlignLeft, Headphones, Mic, Edit, Clock, BadgeCheck, Lightbulb, Zap, Bot } from 'lucide-react';

const UserComparison = () => {
  const [selectedTab, setSelectedTab] = useState('regular');
  const handleRegisterClick = async (e) => {
      e.preventDefault();
      
      await signIn('google', { 
        redirect: true,
        callbackUrl: '/registration'
      });
    };
  
  const regularFeatures = [
    {
      icon: <Book className="w-6 h-6 text-blue-600" />,
      title: "1500 המילים השימושיות באנגלית",
      description: "גישה לאוצר המילים החיוני ביותר באנגלית, מחולק לפי 5 רמות מובנות לפי סדר שימושיות ותדירות."
    },
    {
      icon: <Bookmark className="w-6 h-6 text-blue-600" />,
      title: "כרטיסי מילים מפורטים",
      description: "כל מילה מלווה בדוגמאות שימוש, תרגום, הבניה דקדוקית, ומבנה משפט נכון להטמעה אפקטיבית."
    },
    {
      icon: <BadgeCheck className="w-6 h-6 text-blue-600" />,
      title: "לימוד יסודי ומדויק",
      description: "מתודולוגיה מובנית המבטיחה הבנה עמוקה וזכירה לטווח ארוך של המילים והמושגים הנלמדים."
    }
  ];
  
  const premiumFeatures = [
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "מערכת חזרות אדפטיבית",
      description: "אלגוריתם חכם המזהה את המילים שקשה לך לזכור, ובונה עבורך מסלול חזרות והטמעה מותאמים אישית."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-purple-600" />,
      title: "מדריך וירטואלי אישי",
      description: "שילווה אותך לאורך כל הדרך, ויתווה עבורך את מסלול הלמידה. המטרה היא למקד את הלימוד, ולגרום ללמידה להיות אפקטיבית."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
      title: "מעקב התקדמות מדויק",
      description: "משקף לך בכל רגע את ההתקדמות שלך ביחס להשקעה, ומציג נתונים מפורטים על הרגלי הלמידה והביצועים שלך."
    },
    {
      icon: <AlignLeft className="w-6 h-6 text-purple-600" />,
      title: "פיתוח כל מיומנויות השפה",
      description: "עמודי הטמעה ייחודיים המפתחים במקביל יכולות קריאה, שמיעה, דיבור וכתיבה, ויוצרים הבנה מקיפה של השפה."
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: "כלי AI מתקדמים",
      description: "טכנולוגיית AI חדשנית המספקת משוב מיידי, ומיקוד והטמעה של החלקים שמאתגרים אותך."
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: "למידה אפקטיבית ויעילה",
      description: "חיסכון משמעותי בזמן, השגת תוצאות טובות יותר ושיפור המוטיבציה, הודות למסלול למידה ממוקד ואופטימלי."
    }
  ];

  const PremiumBadge = () => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      פרימיום
    </span>
  );

  return (
    <div className="w-full max-w-4xl mx-auto shadow-lg rounded-lg" dir="rtl">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-300 to-purple-300 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          בחרו את חווית הלמידה המושלמת עבורכם!
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg opacity-90">
          למידת אנגלית אפקטיבית לפי רמה, שבירת מחסומים והתמקדות במה שמאתגר אתכם!
        </p>
      </div>
  
      {/* Tabs */}
      <div className="flex border-b-2 border-gray-200">
        <button
          onClick={() => setSelectedTab('regular')}
          className={`flex-1 py-2 sm:py-4 px-2 sm:px-6 flex justify-center items-center gap-1 sm:gap-2 transition-colors ${
            selectedTab === 'regular'
              ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">משתמש רגיל</span>
        </button>
        <button
          onClick={() => setSelectedTab('premium')}
          className={`flex-1 py-2 sm:py-4 px-2 sm:px-6 flex justify-center items-center gap-1 sm:gap-2 transition-colors ${
            selectedTab === 'premium'
              ? 'border-b-2 border-purple-600 text-purple-700 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
          }`}
        >
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">משתמש רשום</span>
        </button>
      </div>
  
      {/* Content */}
      <div className="p-3 sm:p-6">
        {/* Feature List */}
        <div className="space-y-4 sm:space-y-6">
          {selectedTab === 'regular' ? (
            <>
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100">
                <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 sm:mb-4 flex items-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 mr-1 ml-1 sm:mr-2 sm:ml-2" />
                  יתרונות המשתמש הרגיל
                </h2>
                <p className="text-gray-700 mb-3 sm:mb-6 text-sm sm:text-base">
                  התחילו את מסע לימוד האנגלית שלכם עם הכלים הבסיסיים החיוניים. גם ללא הרשמה, תוכלו להתקדם משמעותית עם:
                </p>
                <div className="grid grid-cols-1 gap-3 sm:gap-6">
                  {regularFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">{feature.icon}</div>
                      <div className="text-center sm:text-right">
                        <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-blue-800">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-gray-700">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">רוצים להאיץ את ההתקדמות שלכם?</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">הרשמו כמשתמשים ותיהנו מכל היתרונות המתקדמים שיש לנו להציע</p>
                <button 
                  onClick={() => setSelectedTab('premium')}
                  className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 text-white py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  גלו את יתרונות המשתמש הרשום
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-purple-100">
                <h2 className="text-lg sm:text-xl font-bold text-purple-800 mb-2 sm:mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-1 ml-1 sm:mr-2 sm:ml-2" />
                  יתרונות המשתמש הרשום
                  <PremiumBadge className="ml-2 sm:ml-3" />
                </h2>
                <p className="text-gray-700 mb-3 sm:mb-6 text-sm sm:text-base">
                  חוויית לימוד מתקדמת המואצת בעזרת טכנולוגיה חכמה. כמשתמשים רשומים, תקבלו את כל יתרונות המשתמש הרגיל בתוספת:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg border border-purple-200 hover:shadow-md transition-all">
                      <div className="flex-shrink-0 p-2 bg-purple-100 rounded-full">{feature.icon}</div>
                      <div className="text-center sm:text-right">
                        <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-purple-800">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-gray-700">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-500 text-white p-4 sm:p-8 rounded-xl shadow-lg">
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">שדרגו עכשיו את חווית הלמידה שלכם</h2>
                  <p className="text-base sm:text-lg opacity-90">הצטרפו לאלפי לומדים שכבר מרגישים את ההבדל</p>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 rounded">
                    <h3 className="font-medium text-lg sm:text-xl mb-2 sm:mb-3 text-center">התנסות ללא התחייבות</h3>
                    <p className="text-center mb-3 sm:mb-4 text-sm sm:text-base">נסו את כל היתרונות המתקדמים שלנו במשך 7 יום, ללא עלות וללא התחייבות</p>
                    <div className="flex justify-center">
                    <button
              onClick={handleRegisterClick} className="bg-white text-indigo-700 py-2 px-4 sm:px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-sm sm:text-base">
                        התחילו בחינם
                      </button>
                    </div>
                  </div>
                  <span className="text-white text-opacity-70 mx-2 text-lg hidden md:block">או</span>
                  <div className="bg-white bg-opacity-10 p-3 sm:p-5 rounded-lg max-w-xs relative mt-4 md:mt-0">
                    <span className="absolute -top-3 right-2 sm:right-4 bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full">הכי פופולרי</span>
                    <h3 className="font-medium text-black text-lg sm:text-xl mb-2 sm:mb-3 text-center">מנוי שנתי</h3>
                    <p className="text-center text-black mb-3 sm:mb-4 text-sm sm:text-base">חיסכון של 40% לעומת המנוי החודשי, עם גישה מלאה לכל התכונות המתקדמות</p>
                    <div className="flex justify-center">
                    <button
              onClick={handleRegisterClick} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-indigo-900 py-2 px-4 sm:px-6 rounded-lg font-medium hover:shadow-lg transition-shadow text-sm sm:text-base">
                        הצטרפו עכשיו
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  
      {/* Feature Comparison Table */}
      <div className="border-t border-gray-200 mt-4 sm:mt-8 p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-center text-gray-800">השוואת יכולות</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-gray-700">יכולת</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-center font-medium text-gray-700">משתמש רגיל</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-center font-medium text-purple-700 bg-purple-50">
                  משתמש רשום <PremiumBadge />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">1500 מילים שימושיות</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">כרטיסי מילים מפורטים</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">מערכת חזרות אדפטיבית</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-400">—</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">מדריך וירטואלי אישי</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-400">—</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">פיתוח כל מיומנויות השפה</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-400">—</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">כלי AI מתקדמים</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-400">—</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">מעקב התקדמות מדויק</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-400">—</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700">למידה אפקטיבית ויעילה</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-400">חלקי</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-center bg-purple-50"><Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Call to Action */}
      <div className="p-4 sm:p-8 bg-gray-50 border-t border-gray-200 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">מוכנים להתחיל?</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-lg mx-auto">
          בין אם תבחרו להתחיל כמשתמשים רגילים או לשדרג מיד למשתמשים רשומים - אנחנו כאן ללוות אתכם בדרך להצלחה באנגלית
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/levelSelection" className="bg-white border-2 border-blue-600 text-blue-600 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base">
            התחילו כמשתמש רגיל
          </Link>
          <button
              onClick={handleRegisterClick} className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:shadow-lg transition-shadow text-sm sm:text-base">
            הצטרפו כמשתמש רשום
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserComparison;