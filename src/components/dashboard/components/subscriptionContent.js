import { Crown, Calendar, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SubscriptionContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // מיפוי שמות מנויים לעברית
  const planNamesHebrew = {
    'Free Trial': 'ניסיון חינם',
    'Intensive': 'אינטנסיבי',
    'Premium': 'פרימיום',
    'Coupon': 'קופון'
  };

  // מיפוי סטטוסים לעברית
  const statusNamesHebrew = {
    'active': 'פעיל',
    'expired': 'פג תוקף'
  };

  // פורמט תאריך עברי
  const formatHebrewDate = (dateString) => {
    if (!dateString) return 'לא זמין';
    try {
      const date = new Date(dateString);
      // בדיקה שהתאריך תקין
      if (isNaN(date.getTime())) return 'לא זמין';
      return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'לא זמין';
    }
  };

  // טעינה
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // אין session
  if (!session?.user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-semibold">אין גישה למידע המנוי</p>
      </div>
    );
  }

  const subscription = session.user.subscription;

  // אין מנוי
  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p className="text-yellow-700 font-semibold">לא נמצא מנוי פעיל</p>
      </div>
    );
  }

  // חישוב ימים נותרים
  const daysRemaining = subscription.end_date 
    ? Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const isExpired = subscription.status === 'expired';
  const isFreeAndActive = subscription.status === 'active' && subscription.subscription_type === 'Free Trial';
  const isAboutToExpire = subscription.status === 'active' && subscription.subscription_type !== 'Free Trial' && daysRemaining <= 3 && daysRemaining > 0;
  const isPaidAndActive = subscription.status === 'active' && subscription.subscription_type !== 'Free Trial' && daysRemaining > 3;

  const handleUpgradeOrRenew = () => {
    router.push('/expired');
  };

  return (
    <div className="space-y-6">
      {/* כרטיס סטטוס מנוי */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {planNamesHebrew[subscription.subscription_type] || subscription.subscription_type}
            </h3>
            <span className={`
              inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1
              ${isExpired
                ? 'bg-red-100 text-red-700'
                : isFreeAndActive
                  ? 'bg-yellow-100 text-yellow-700'
                  : isAboutToExpire
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'}
            `}>
              {isFreeAndActive
                ? 'תקופת ניסיון'
                : isAboutToExpire
                  ? 'לפני פג תוקף'
                  : statusNamesHebrew[subscription.status] || subscription.status}
            </span>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              תאריך התחלה
            </span>
            <span className="font-semibold text-gray-900">
              {formatHebrewDate(subscription.start_date)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {isExpired ? 'פג תוקף ב' : 'תאריך סיום'}
            </span>
            <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
              {formatHebrewDate(subscription.end_date)}
            </span>
          </div>
        </div>
      </div>

      {/* כפתורי פעולה - לפי סטטוס המנוי */}
      {isExpired && (
        <div className="space-y-3">
          <button 
            onClick={handleUpgradeOrRenew}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            חדש מנוי
          </button>
          <p className="text-xs text-gray-500 text-center">
            המנוי שלך פג תוקף. חדש עכשיו כדי להמשיך ליהנות מכל התכונות
          </p>
        </div>
      )}

      {isAboutToExpire && (
        <div className="space-y-3">
          <button 
            onClick={handleUpgradeOrRenew}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            חדש מנוי
          </button>
          <p className="text-xs text-gray-500 text-center">
            המנוי שלך עומד לפוג בקרוב. חדש עכשיו כדי להמשיך ללא הפרעה
          </p>
        </div>
      )}

      {isFreeAndActive && (
        <div className="space-y-3">
          <button 
            onClick={handleUpgradeOrRenew}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            שדרג תכנית
          </button>
          <p className="text-xs text-gray-500 text-center">
            שדרג למנוי מלא ותקבל גישה בלתי מוגבלת לכל התכנים
          </p>
        </div>
      )}

      {isPaidAndActive && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
            <Crown className="w-5 h-5" />
            המנוי שלך פעיל ותקף
          </p>
          <p className="text-xs text-green-600 mt-1">
            תודה שאתה חלק מהקהילה שלנו!
          </p>
        </div>
      )}

      {/* מידע נוסף על המנוי */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-sm font-bold text-gray-700 mb-3">פרטי המנוי שלך</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>סוג מנוי:</span>
            <span className="font-semibold text-gray-900">
              {planNamesHebrew[subscription.subscription_type]}
            </span>
          </div>
          <div className="flex justify-between">
            <span>סטטוס:</span>
            <span className="font-semibold text-gray-900">
              {statusNamesHebrew[subscription.status]}
            </span>
          </div>
          {subscription.end_date && (
            <div className="flex justify-between">
              <span>ימים נותרים:</span>
              <span className="font-semibold text-gray-900">
                {Math.max(0, daysRemaining)} ימים
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}