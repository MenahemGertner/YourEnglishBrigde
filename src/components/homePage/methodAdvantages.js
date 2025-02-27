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
      description: "מתי באמת אפשר לומר שאני יודע אנגלית? לא קל להתקדם כשאין יעד מוגדר וברור. חוסר המיקוד הזה מוביל לתחושת בלבול ואובדן דרך."
    },
    {
      icon: <Brain className="w-6 h-6 text-red-500" />,
      title: "עומס קוגניטיבי מציף",
      description: "האינטרנט מציף אותנו במידע אינסופי. במקום להתקדם, אנחנו מבולבלים מכמות האפשרויות, מה שמונע 'התמקדות' בצעדים קונקרטיים להתקדמות אמיתית."
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
      description: "מסלול מדויק של 2,500 המילים השימושיות ביותר באנגלית, מחולקות ל-5 רמות מובנות. בסיום המסלול תוכל לקרוא, להקשיב, לדבר ולכתוב."
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
    <div className="shadow-lg rounded" >
      <div className="text-center p-8 bg-gradient-to-r from-blue-400 to-purple-400">
        <h1 className="text-3xl font-bold">
          דרך מהפכנית ללימוד אנגלית!
        </h1>
        <p className="mt-4 text-lg opacity-90">
          שיטה שמתמודדת עם האתגרים האמיתיים ומבטיחה תוצאות ברורות!
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="grid grid-cols-2 border-b">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`p-4 text-center font-medium ${
              activeTab === 'challenges'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            אתגרים אמיתיים ברכישת שפה
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`p-4 text-center font-medium ${
              activeTab === 'solutions'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            הפתרונות הייחודיים שלנו
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'challenges'
              ? challenges.map((item, index) => (
                  <div key={index} className="flex space-x-4 space-x-reverse p-5 bg-red-50 rounded-lg border border-red-100 hover:shadow-md p-4 gap-2">
                    <div className="flex-shrink-0 ml-4">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-red-700">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))
              : solutions.map((item, index) => (
                  <div key={index} className="flex space-x-4 space-x-reverse p-5 bg-green-50 rounded-lg border border-green-100 hover:shadow-md p-4 gap-2">
                    <div className="flex-shrink-0 ml-4">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-green-700">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {activeTab === 'solutions' && (
          <div className="p-8 text-white text-center bg-green-600 ">
            <h2 className="text-2xl font-bold mb-4">רוצה לשבור את מחסום השפה?</h2>
            <p className="mb-6">הצטרף עכשיו ותהנה מחווית לימוד אחרת!</p>
            <Link href="/registration"
                    className="bg-white text-green-700 font-bold py-3 px-6 rounded underline duration-300 hover:scale-105">
              התחל עכשיו - 14 יום חינם
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MethodAdvantages;