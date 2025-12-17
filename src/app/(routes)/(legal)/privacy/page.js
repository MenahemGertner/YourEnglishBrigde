import React from 'react';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>מדיניות פרטיות | Your English Bridge</title>
        <meta name="description" content="מדיניות הפרטיות של Your English Bridge - למד כיצד אנו מגנים על המידע האישי שלך" />
      </Head>

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 my-4" dir="rtl">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">מדיניות פרטיות</h1>
          <p className="text-sm text-gray-600 mb-8">תאריך עדכון אחרון: ינואר 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. מבוא</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ברוכים הבאים ל-Your English Bridge (להלן: "האתר", "אנו", "שלנו"). אנו מחויבים להגן על פרטיותך ולשמור על המידע האישי שלך. מדיניות פרטיות זו מסבירה אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, וכיצד אנו מגנים עליהם.
            </p>
            <p className="text-gray-700 leading-relaxed">
              השימוש באתר מהווה הסכמה למדיניות פרטיות זו. אם אינך מסכים למדיניות זו, אנא הימנע משימוש באתר.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. מידע שאנו אוספים</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">2.1 משתמשים לא רשומים</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              עבור משתמשים שמבקרים באתר ללא הרשמה, אנו לא אוספים כל מידע אישי.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">2.2 משתמשים רשומים</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              בעת ההרשמה לאתר, אנו אוספים את המידע הבא:
            </p>
            <ul className="list-disc list-inside text-gray-700 mr-6 space-y-1">
              <li>שם מלא</li>
              <li>כתובת דואר אלקטרוני (אימייל)</li>
              <li>מספר טלפון</li>
              <li>כתובת מלאה (מגורים)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">2.3 מידע נוסף במהלך השימוש</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              במהלך השימוש באתר, אנו שומרים:
            </p>
            <ul className="list-disc list-inside text-gray-700 mr-6 space-y-1">
              <li>התקדמות לימודית (מילים שנלמדו, תרגילים שבוצעו)</li>
              <li>העדפות אישיות והגדרות משתמש</li>
              <li>היסטוריית פעילות בפלטפורמת הלימוד</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. כיצד אנו משתמשים במידע</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              אנו משתמשים במידע שנאסף למטרות הבאות:
            </p>
            <ul className="list-disc list-inside text-gray-700 mr-6 space-y-2">
              <li><strong>אספקת השירות:</strong> לאפשר לך לחזור על מילים קשות ולהגדיר העדפות אישיות</li>
              <li><strong>תקשורת:</strong> לשלוח אימיילי אישור הרשמה והתראות לפני סיום תקופת מנוי</li>
              <li><strong>שיפור השירות:</strong> לשפר את חוויית המשתמש ואת איכות התכנים</li>
              <li><strong>תמיכה טכנית:</strong> למתן תמיכה ומענה לפניות שלך</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.1 אנו לא משתפים את המידע שלך</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              אנו לא מוכרים, משכירים או משתפים את המידע האישי שלך עם גורמים חיצוניים למטרות שיווקיות.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.2 ספקי שירות</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              אנו משתמשים בספקי שירות חיצוניים הבאים:
            </p>
            <ul className="list-disc list-inside text-gray-700 mr-6 space-y-1">
              <li><strong>Supabase:</strong> לאחסון נתונים מאובטח (שרתים בציריך, שוויץ)</li>
              <li><strong>Resend:</strong> לשליחת אימיילים טרנזקציוניים</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              ספקים אלו פועלים בהתאם להוראותינו וכפופים להתחייבויות סודיות.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.3 דרישות חוק</h3>
            <p className="text-gray-700 leading-relaxed">
              אנו עשויים לחשוף מידע אם נדרש על פי חוק, צו שיפוטי, או הליך משפטי.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. אבטחת מידע</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלך:
            </p>
            <ul className="list-disc list-inside text-gray-700 mr-6 space-y-2">
              <li><strong>אדריכלות מאובטחת:</strong> כל הגישה לנתונים מתבצעת דרך שרת backend מאובטח (API routes), ולא ישירות מדפדפן הלקוח</li>
              <li><strong>בקרת גישה:</strong> שימוש ב-service role של Supabase עם אימות והרשאות מחמירים</li>
              <li><strong>הצפנה:</strong> המידע מאוחסן בשרתי Supabase המוגנים בהצפנה</li>
              <li><strong>אימות:</strong> מערכת אימות משתמשים עם אבטחה רב-שכבתית</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              עם זאת, חשוב לזכור שאף שיטת העברה או אחסון באינטרנט אינה מאובטחת ב-100%, ואנו לא יכולים להבטיח אבטחה מוחלטת.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. עוגיות (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>אנו לא משתמשים בעוגיות באתר זה.</strong> הניהול של מצב המשתמש מתבצע באמצעים טכניים אחרים.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. זכויותיך</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              כמשתמש רשום, יש לך את הזכויות הבאות:
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">7.1 זכות עיון</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              אתה רשאי לבקש לעיין במידע האישי השמור עליך במערכותינו.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">7.2 זכות לתיקון</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              אתה רשאי לבקש לתקן מידע שגוי או לא מדויק.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">7.3 זכות למחיקה</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              אתה רשאי לבקש למחוק את חשבונך ואת המידע האישי שלך. ניתן לעשות זאת דרך טופס יצירת הקשר באתר.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3">7.4 זכות להתנגדות</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              אתה רשאי להתנגד לשימושים מסוימים במידע שלך.
            </p>

            <p className="text-gray-700 leading-relaxed">
              ליישום זכויותיך, נא לפנות אלינו דרך <a href="/contact" className="text-blue-600 hover:underline">טופס יצירת הקשר</a> באתר.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. שמירת מידע</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              אנו שומרים את המידע שלך למשך הזמן הבא:
            </p>
            <ul className="list-disc list-inside text-gray-700 mr-6 space-y-2">
              <li><strong>משתמשים פעילים:</strong> כל עוד חשבונך פעיל</li>
              <li><strong>לאחר בקשת מחיקה:</strong> עד 30 יום לצרכים טכניים ומשפטיים, ולאחר מכן המידע נמחק לחלוטין</li>
              <li><strong>חשבונות לא פעילים:</strong> לאחר 2 שנים ללא פעילות, נשלח אליך התראה ונמחק את החשבון תוך 30 יום אם לא תחזור לפעילות</li>
              <li><strong>לוגים וגיבויים:</strong> עד 90 יום</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. קטינים ושימוש באתר</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              האתר מיועד למשתמשים מגיל 13 ומעלה. אנו לא אוספים במודע מידע מילדים מתחת לגיל 13.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              משתמשים מתחת לגיל 18 צריכים לקבל הסכמת הורה או אפוטרופוס לפני ההרשמה לאתר.
            </p>
            <p className="text-gray-700 leading-relaxed">
              אם הגעת למסקנה שאספנו בטעות מידע מקטין מתחת לגיל 13, נא ליצור איתנו קשר מיד ונמחק את המידע.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. העברת מידע בינלאומית</h2>
            <p className="text-gray-700 leading-relaxed">
              המידע שלך מאוחסן בשרתים בציריך, שוויץ. שוויץ מוכרת כמדינה עם רמת הגנה מספקת על פי תקנות ה-GDPR האירופיות.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. שינויים במדיניות הפרטיות</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת. במקרה של שינויים מהותיים, נודיע לך באמצעות:
            </p>
            <ul className="list-disc list-inside text-gray-700 mr-6 space-y-1">
              <li>הודעה באתר</li>
              <li>שליחת אימייל לכתובת הרשומה אצלנו</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              תאריך העדכון האחרון יופיע בראש מסמך זה. המשך שימוש באתר לאחר שינויים מהווה הסכמה למדיניות המעודכנת.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. יצירת קשר</h2>
            <p className="text-gray-700 leading-relaxed">
              אם יש לך שאלות, בקשות או חששות בנוגע למדיניות הפרטיות או לטיפול במידע האישי שלך, נא ליצור קשר באמצעות <a href="/contact" className="text-blue-600 hover:underline">טופס יצירת הקשר</a> באתר.
            </p>
          </section>
<footer className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 font-semibold">Your English Bridge</p>
            <p className="text-gray-500 text-sm mt-1">מחויבים לפרטיותך ולאבטחת המידע שלך</p>
            <div className="mt-4 space-x-4 space-x-reverse">
              <a href="/terms" className="text-blue-600 hover:underline text-sm">תנאי שימוש</a>
              <span className="text-gray-400">|</span>
              <a href="/contact" className="text-blue-600 hover:underline text-sm">צור קשר</a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}