// components/auth/ProContent.js - גרסה משופרת
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * ProContent - קומפוננט לניהול תוכן למנויים
 * 
 * דוגמאות שימוש:
 * 
 * 1. מערכת דירוג מילים (ללא חסימת אורחים):
 * <ProContent 
 *   requireAuth={false}
 *   expiredFallback={useBasicRating ? <BasicRatingSystem /> : null}
 *   onSwitchToBasic={() => setUseBasicRating(true)}
 *   showExpiredNotification={!useBasicRating}
 * >
 *   <SmartRatingSystem />
 * </ProContent>
 * 
 * 2. תוכן שדורש מנוי חובה:
 * <ProContent>
 *   <PremiumContent />
 * </ProContent>
 * 
 * 3. תוכן עם גישות שונות למשתמשים:
 * <ProContent 
 *   guestFallback={<GuestContent />}
 *   expiredFallback={<BasicContent />}
 * >
 *   <PremiumContent />
 * </ProContent>
 */

export default function ProContent({
  children,
  guestFallback = null, // מה להציג למשתמשים לא מחוברים
  expiredFallback, // מה להציג למשתמשים עם מנוי פג (ללא ברירת מחדל!)
  redirectTo = '/api/auth/signin',
  requireAuth = true,
  showExpiredNotification = true, // האם להציג הודעת מנוי פג
  onSwitchToBasic = null // פונקציה שמתבצעת כשלוחצים "חזרה למערכת בסיסית"
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // אם נדרש אימות והמשתמש לא מחובר
    if (requireAuth && status === 'unauthenticated') {
      router.push(redirectTo);
      return;
    }
  }, [status, requireAuth, redirectTo, router]);

  // לא מחובר
  if (!session) {
    // אם לא נדרש אימות - לא מציגים כלום (GuestContent יטפל בזה)
    if (!requireAuth) {
      return null;
    }
    
    // אם נדרש אימות - הצג הודעה או fallback
    return guestFallback || (
      <div className="text-center p-8">
        <p className="text-lg mb-4">נדרש להתחבר כדי לצפות בתוכן זה</p>
        <button
          onClick={() => router.push(redirectTo)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          התחבר
        </button>
      </div>
    );
  }

  // מחובר אבל מנוי לא פעיל
  if (session?.user.subscription?.status !== 'active') {
    // אם מוגדר expiredFallback - הצג הודעת ניווט (עם אפשרות למערכת בסיסית)
    if (expiredFallback !== undefined) {
      return (
        <div className="w-full">
          {/* הודעת מנוי פג למערכת ניווט */}
          {showExpiredNotification && (
            <ExpiredSubscriptionBanner 
              subscription={session.user.subscription}
              onSwitchToBasic={onSwitchToBasic}
            />
          )}
          
          {/* התוכן הבסיסי - רק אם expiredFallback לא null */}
          {expiredFallback}
        </div>
      );
    }

    // אחרת - הודעה רגילה לעמודים שדורשים מנוי חובה (עם "חזרה לעמוד הבית")
    return <ExpiredSubscriptionMessage subscription={session.user.subscription} />;
  }

  // כל שאר המקרים - הצג תוכן פרו
  return <>{children}</>;
}

// קומפוננט הודעה למנוי פג - בנר חכם למערכת דירוג
function ExpiredSubscriptionBanner({ subscription, onSwitchToBasic }) {
  const router = useRouter();
  const endDate = subscription?.end_date ? 
    new Date(subscription.end_date).toLocaleDateString('he-IL') : null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6
    w-80 min-w-[250px]
    md:w-96 lg:w-[450px]
    mx-auto">
      <div className="space-y-3">
        {/* הודעה ראשית */}
        <div className="text-yellow-700">
          <span className="font-medium">כדי להמשיך להשתמש במערכת דירוג המילים החכמה נדרש מנוי פעיל</span>
          {endDate && subscription.status === 'expired' && (
            <div className="text-sm mt-1">מנוי ה {subscription.subscription_type} שלך פג תוקף ב-{endDate}</div>
          )}
        </div>

        {/* כפתורי פעולה */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.push('/pricing')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm rounded hover:from-blue-500 hover:to-purple-500 transition-colors"
          >
            חידוש מנוי
          </button>
          
          <button
            onClick={onSwitchToBasic}
            className="bg-gray-200 text-gray-700 px-4 py-2 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            חזרה למערכת הבסיסית
          </button>
        </div>
      </div>
    </div>
  );
}

// קומפוננט הודעה מלאה למנוי פג - לעמודים שדורשים מנוי חובה
function ExpiredSubscriptionMessage({ subscription }) {
  const router = useRouter();
  const endDate = subscription?.end_date ? 
    new Date(subscription.end_date).toLocaleDateString('he-IL') : null;

  return (
    <div className="text-center p-8">
      <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-yellow-800 mb-4">נדרש מנוי פעיל</h2>
        
        {subscription?.status === 'expired' && endDate && (
          <p className="text-yellow-700 mb-4">
            מנוי ה {subscription.subscription_type} שלך פג תוקף ב-{endDate}
          </p>
        )}
        
        {subscription?.status === 'inactive' && (
          <p className="text-yellow-700 mb-4">
            אין לך מנוי פעיל כרגע
          </p>
        )}
        
        <p className="text-yellow-700 mb-6">
          תוכן זה דורש מנוי פעיל
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/pricing')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-colors"
          >
            {subscription?.subscription_type ? 'חידוש מנוי' : 'רכישת מנוי'}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            חזרה לעמוד הבית
          </button>
        </div>
      </div>
    </div>
  );
}