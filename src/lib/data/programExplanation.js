'use client'
import React, { useState } from 'react';
import { BrainCircuit, Move, Target, RepeatIcon, Trophy, ChevronDown, XCircle, CheckCircle } from 'lucide-react';

const MethodAdvantages = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const challenges = [
    {
      problem: "עומס מידע",
      description: "אתרי לימוד רבים מציפים אותך במידע - מילים, כללי דקדוק, ביטויים. בסוף אתה לא זוכר כלום.",
      solution: "מיקוד ב-2,500 המילים החשובות באמת, עם מערכת חכמה שמתאימה את קצב הלמידה אליך"
    },
    {
      problem: "זכירה לטווח קצר",
      description: "למדת מילה חדשה? מעולה. תזכור אותה מחר? כנראה שלא. השיטות המסורתיות לא עובדות.",
      solution: "מערכת חזרות חכמה שמזהה בדיוק מתי אתה צריך לחזור על כל מילה, בלי לבזבז זמן על מה שכבר ידוע"
    },
    {
      problem: "פער בין הבנה לשימוש",
      description: "אתה מבין כשקוראים או מדברים, אבל כשצריך לדבר או לכתוב - המילים פשוט לא יוצאות.",
      solution: "תרגול אינטגרטיבי שמשלב את כל המיומנויות - קריאה, כתיבה, שמיעה ודיבור, עם דגש על שימוש מעשי"
    }
  ];

  const advantages = [
    {
      icon: <BrainCircuit className="w-12 h-12 text-blue-500" />,
      title: "מערכת למידה אדפטיבית",
      description: "השיטה מזהה בדיוק מה קשה לך ומתאימה את עצמה אליך. אתה לומד בדיוק את מה שאתה צריך, בקצב המתאים לך.",
      details: [
        "זיהוי אוטומטי של מילים קשות",
        "התאמה אישית של קצב החזרות",
        "מעקב חכם אחר ההתקדמות שלך"
      ]
    },
    {
      icon: <Target className="w-12 h-12 text-purple-500" />,
      title: "למידה ממוקדת ויעילה",
      description: "במקום ללמוד אלפי מילים שלא תשתמש בהן, אנחנו מתמקדים במה שבאמת חשוב - 2,500 המילים השימושיות ביותר.",
      details: [
        "התמקדות במילים שבאמת משתמשים בהן",
        "חלוקה חכמה ל-5 רמות מובנות",
        "התקדמות הדרגתית ואפקטיבית"
      ]
    },
    {
      icon: <RepeatIcon className="w-12 h-12 text-yellow-500" />,
      title: "חזרות חכמות",
      description: "המערכת מזהה בדיוק מתי אתה צריך לחזור על כל מילה, ומשלבת את החזרות בתוך תרגילים מעשיים.",
      details: [
        "תזמון מדויק של חזרות",
        "שילוב חזרות בתוך תרגול מעשי",
        "מניעת שכחה לטווח ארוך"
      ]
    },
    {
      icon: <Move className="w-12 h-12 text-green-500" />,
      title: "למידה אינטגרטיבית",
      description: "פיתוח מקביל של כל המיומנויות הנדרשות, עם דגש על שימוש מעשי בשפה.",
      details: [
        "שילוב קריאה, כתיבה, שמיעה ודיבור",
        "תרגול בהקשר אמיתי",
        "גישור על הפער בין הבנה לשימוש"
      ]
    },
    {
      icon: <Trophy className="w-12 h-12 text-red-500" />,
      title: "מעקב והנעה",
      description: "ראייה ברורה של ההתקדמות שלך, עם מדדים ברורים ועידוד להמשיך.",
      details: [
        "מעקב מפורט אחר ההתקדמות",
        "זיהוי תחומים לשיפור",
        "הצגת הישגים והתקדמות"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">למה כל כך קשה ללמוד אנגלית?</h2>
      </div>

      {/* האתגרים */}
      <div className="mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 
                ${activeChallenge === index ? 'scale-105' : 'scale-100'}`}
              onMouseEnter={() => setActiveChallenge(index)}
              onMouseLeave={() => setActiveChallenge(null)}
            >
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-red-600">{challenge.problem}</h3>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              <div className={`transition-all duration-300 ${activeChallenge === index ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-start text-green-600">
                  <CheckCircle className="w-5 h-5 mt-1 ml-2" />
                  <p className="text-sm">{challenge.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* הפתרונות */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 mt-12">איך השיטה שלנו פותרת את זה?</h2>
        <p className="text-lg text-gray-600">מערכת חכמה שמתאימה את עצמה אליך ומבטיחה התקדמות אמיתית</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {advantages.map((advantage, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
              ${activeCard === index ? 'scale-105' : 'scale-100'}`}
            onMouseEnter={() => setActiveCard(index)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{advantage.title}</h3>
              <p className="text-gray-600 text-center mb-4">{advantage.description}</p>
              
              <div className={`overflow-hidden transition-all duration-300 
                ${activeCard === index ? 'max-h-48' : 'max-h-0'}`}>
                <ul className="space-y-2 text-gray-600">
                  {advantage.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronDown className="w-4 h-4 mt-1 ml-2 text-blue-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MethodAdvantages;