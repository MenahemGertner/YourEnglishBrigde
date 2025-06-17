'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Brain, ChartBar, BookOpen, Clock, Smile, Frown, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

const MethodAdvantages = () => {
  
  const [activeTab, setActiveTab] = useState('challenges');

  const challenges = [
    {
      icon: <Target className="w-6 h-6 text-red-500" />,
      title: "היעדר מטרה ברורה",
      description: "מתי באמת אפשר לומר שאני יודע אנגלית? לא קל להתקדם כשאין יעד מוגדר וברור. חוסר המיקוד הזה מוביל לתחושת תקיעות ואי השגת המטרה."
    },
    {
      icon: <Brain className="w-6 h-6 text-red-500" />,
      title: "עומס קוגניטיבי מציף",
      description: "האינטרנט מציף אותנו במידע אינסופי. במקום להתמקד, אנחנו מבולבלים מכמות האפשרויות, מה שמונע 'התמקדות' בצעדים קונקרטיים להתקדמות אמיתית."
    },
    {
      icon: <ChartBar className="w-6 h-6 text-red-500" />,
      title: "אשליית ההתקדמות",
      description: "ללא מדדים ברורים, קשה לחוות את ההתקדמות. זה יוצר תחושה מתסכלת של תקיעות וחוסר התפתחות, שפוגעת קשות במוטיבציה."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-red-500" />,
      title: "רמת לימוד לא מתאימה",
      description: "ניסיון ללמוד ברמה שאינה תואמת את היכולות שלך, יוצר תסכול עמוק ואסוציאציות שליליות ללימוד השפה, מה שמקשה על המשך הלמידה."
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-red-500" />,
      title: "בזבוז זמן על לימוד לא אפקטיבי",
      description: "הטמעה לא נכונה גורמת לידע שכבר נרכש להישכח. מצד שני 'תרגול סגור' בתוך הידע המוכר אינו מקדם אותך, אלא רק מבזבז את זמנך היקר."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "הבנה שטחית ומטעה",
      description: "למידה ללא הקשר רחב ומזוויות שונות יוצרת אשליה של הבנה. בפועל, זה מוביל לטעויות רבות ולתסכול עמוק כשאתה מגלה שאתה לא מבין דבר."
    },
    {
      icon: <Frown className="w-6 h-6 text-red-500" />,
      title: "שעמום ונטישה",
      description: "התמקדות יתר בדקדוק וחוקים מופשטים יוצרת חוויית למידה משעממת ולא מתגמלת, מה שמוביל רבים לוותר לפני שהגיעו להישגים אמיתיים."
    }
  ];

  const solutions = [
    {
      icon: <Target className="w-6 h-6 text-green-600" />,
      title: "יעד מוגדר וברור לחלוטין",
      description: "מסלול מדויק של 1,500 המילים השימושיות ביותר באנגלית, מחולקות ל-5 רמות מובנות. המטרה היא, שבסיום המסלול תדע להשתמש בפועל בכל אחת מהמילים שלמדת."
    },
    {
      icon: <Brain className="w-6 h-6 text-green-600" />,
      title: "למידה בהקשר עמוק ורב-ממדי",
      description: "שיטה ייחודית שמפעילה את כל סוגי הזיכרון שלך. אנחנו מלמדים דרך הקשרים רחבים ומעשיים, יוצרים קשרים מוחיים חזקים שמבטיחים הבנה אמיתית ולא שטחית."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: "מדריך וירטואלי אישי",
      description: "לעולם לא תרגיש אבוד. המערכת מדריכה אותך בדיוק מה לעשות בכל שלב, ומתאימה את עצמה לקצב ולסגנון הלמידה האישי שלך, כמו מורה פרטי שזמין עבורך בכל עת."
    },
    {
      icon: <ChartBar className="w-6 h-6 text-green-600" />,
      title: "מדד התקדמות מדויק",
      description: "מערכת מתוחכמת שמשקפת לך בכל רגע את ההתקדמות שלך ביחס להשקעה. תוכל לראות במדויק כמה התקדמת וכמה עוד נשאר."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-green-600" />,
      title: "רכישת דקדוק בשיטה טבעית",
      description: "במקום שינון כללים משעמם, תלמד את מבנה השפה באופן טבעי דרך חשיפה מובנית לתבניות קבועות. תרכוש את הכללים כמעט בלי להרגיש, בדיוק כמו שילדים לומדים את שפת האם שלהם."
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-green-600" />,
      title: "מערכת חזרות חכמה ואדפטיבית",
      description: "מערכת חכמה שמזהה אילו מילים קשות לך יותר לזכור ובונה עבורך מסלול חזרות מותאם אישית. המילים הקשות יותר יחזרו בתדירות גבוהה יותר, מה שמבטיח הטמעה אפקטיבית באמת."
    },
    {
      icon: <Smile className="w-6 h-6 text-green-600" />,
      title: "חווית למידה מהנה וגמישה",
      description: "אתה יכול לבחור את הכלים שנחוצים לך - האזנה, תרגום, תרגול, או שילוב ביניהם. לעולם לא תצטרך להיעזר במקורות חיצוניים, הכל נמצא כאן עבורך ומותאם בדיוק לקצב הלמידה שלך."
    }
  ];

  return (
    <div className="shadow-lg rounded">
      <div className="text-center p-4 sm:p-8 bg-gradient-to-r from-blue-400 to-purple-400">
        <h1 className="text-2xl sm:text-3xl font-bold">
          דרך מהפכנית ללימוד אנגלית!
        </h1>
        <p className="mt-2 sm:mt-4 text-base sm:text-lg opacity-90">
          שיטה שמתמודדת עם האתגרים האמיתיים ומבטיחה תוצאות ברורות!
        </p>
      </div>
  
      {/* Tabs - Stacked on extra small screens, side-by-side on small and larger */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 border-b">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3 px-2 sm:p-4 text-center font-medium text-sm sm:text-base ${
              activeTab === 'challenges'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <span className="sm:hidden">אתגרים</span>
            <span className="hidden sm:inline">אתגרים אמיתיים ברכישת שפה</span>
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3 px-2 sm:p-4 text-center font-medium text-sm sm:text-base ${
              activeTab === 'solutions'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <span className="sm:hidden">פתרונות</span>
            <span className="hidden sm:inline">הפתרונות הייחודיים שלנו</span>
          </button>
        </div>
  
        {/* Content */}
        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {activeTab === 'challenges'
              ? challenges.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row p-3 sm:p-5 bg-red-50 rounded-lg border border-red-100 hover:shadow-md">
                    <div className="mx-auto sm:mx-0 sm:ml-3 mb-2 sm:mb-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-red-700 text-center sm:text-right">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 text-center sm:text-right">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              : solutions.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row p-3 sm:p-5 bg-green-50 rounded-lg border border-green-100 hover:shadow-md">
                    <div className="mx-auto sm:mx-0 sm:ml-3 mb-2 sm:mb-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-green-700 text-center sm:text-right">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 text-center sm:text-right">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
  
        {activeTab === 'solutions' && (
          <div className="p-4 sm:p-8 text-white text-center bg-green-600">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">רוצה לשבור את מחסום השפה?</h2>
            <p className="mb-4 sm:mb-6">הצטרף עכשיו ותהנה מחווית לימוד אחרת!</p>
            <Link href="/registration"
                  className="bg-white text-green-700 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded underline duration-300 hover:scale-105">
              התחל עכשיו - 14 יום חינם
            </Link>
          </div>
        )}
      </div>
    </div>
  );};

export default MethodAdvantages;