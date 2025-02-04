'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Cat } from 'lucide-react';
import VideoPlayer from '@/components/features/VideoPlayer'

const PersonalGuide = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "איך המערכת עובדת?",
            answer: "המערכת מותאמת אישית לקצב הלמידה שלך ומציעה תוכן מותאם בהתאם להתקדמות שלך. אנחנו משתמשים באלגוריתמים חכמים כדי לזהות את החוזקות והאתגרים שלך."
        },
        {
            question: "כמה זמן לוקח להשלים את התוכנית?",
            answer: "משך התוכנית משתנה בהתאם לקצב האישי שלך. אנחנו מאמינים בלמידה יעילה ומותאמת אישית, כך שכל אחד יכול להתקדם בקצב המתאים לו."
        },
        {
            question: "האם אני יכול/ה לבטל את המנוי?",
            answer: "כן, ניתן לבטל את המנוי בכל עת. אנחנו מאמינים בגמישות ובמתן אפשרות ללקוחות שלנו לשלוט בחוויית הלמידה שלהם."
        },
        {
            question: "האם יש תמיכה טכנית?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        },
        {
            question: "למה ללמוד עם המדריך האישי?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        },
        {
            question: "האם אפשר לשאול שאלות את המדריך האישי?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        },
        {
            question: "מה בעצם נותן לי המדריך האישי?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        },
        {
            question: "האם אני מקבל התחייבות לדעת אנגלית?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        },
        {
            question: "עד לאיזו רמה של אנגלית אני יכול להגיע בתכנית?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        },
        {
            question: "האם ניתן ללמוד אנגלית גם בלי המדריך האישי?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        },
        {
            question: "האם ניתן להירשם לתקופת התנסות?",
            answer: "בהחלט! צוות התמיכה שלנו זמין 24/7 לענות על כל שאלה או בעיה שעולה במהלך הלמידה."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="container mx-auto px-4 mt-8 mb-8">
            <div className="max-w-6xl mx-auto bg-blue-50 rounded p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">המדריך האישי</h1>
                <div className="text-lg text-gray-600 space-y-4 text-right">
                    <p>
                        <span className='flex gap-2'>
                        הי, אני המדריך האישי! <Cat/></span>
                        התפקיד שלי הוא לעזור לך להטמיע את כל הלימוד החדש, בקצב שלך ובחווית הצלחה מירבית!<br/>
                        אנחנו לא נבזבז זמן על מה שקל עבורך, נתמקד בחלקים המאתגרים, ונעבוד על כך שהלימוד יהיה יעיל ומהיר.<br/>
                        לא פחות מכך, חשוב לי לשקף לך לאורך כל הדרך את ההתקדמות שלך!<br/>
                        המוטיבציה שלך היא התנאי הראשון להצלחה שלנו!<br/>
                        אז יאללה אני מחכה לך בפנים..
                    </p>
                </div>
            </div>
           
            <div className="mt-12 text-center mb-8">
                <Link 
                    href="/registration"
                    className="inline-block bg-blue-900 text-white px-32 py-5 rounded text-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                    להרשמה
                </Link>
            </div>
            <VideoPlayer src="/video/example.mp4"/>

            {/* FAQ Section */}
            <div className="w-full max-w-md mx-auto mt-16">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">שאלות נפוצות</h2>
                <div dir="rtl" className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className="bg-blue-50 rounded-lg shadow-sm overflow-hidden"
                        >
                            <button
                                className="w-full p-6 flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
                                onClick={() => toggleFaq(index)}
                            >
                                <span className="text-lg font-semibold text-gray-800">
                                    {faq.question}
                                </span>
                                <ChevronDown 
                                    className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                                    size={20}
                                />
                            </button>
                            <div 
                                className={`overflow-hidden transition-all duration-300 ${
                                    openIndex === index 
                                        ? 'max-h-48 opacity-100' 
                                        : 'max-h-0 opacity-0'
                                }`}
                            >
                                <p className="p-6 text-gray-600 text-right border-t">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-12 text-center">
                <Link 
                    href="/registration"
                    className="inline-block bg-blue-900 text-white px-32 py-5 rounded text-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                    להרשמה
                </Link>
            </div>
        </main>
    );
};

export default PersonalGuide;