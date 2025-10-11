'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Check, ArrowRight, Sparkles, Crown, AlertCircle } from 'lucide-react';
import PlansDisplay from '../plans';
import SuccessModal from '../successModal';

export default function ExpiredPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [renewalData, setRenewalData] = useState(null);

  // הפניה למשתמשים לא מחוברים
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (!session) {
    return null;
  }

  const subscription = session.user.subscription;
  const previousPlanType = subscription?.subscription_type || 'Free Trial';
  const userName = session.user.name?.split(' ')[0] || 'משתמש יקר';

  // חישוב הנחה לפי סוג המנוי הקודם
  const getDiscount = (planType) => {
    if (previousPlanType === 'Premium') return 20;
    if (previousPlanType === 'Intensive') return 10;
    return 0;
  };

  // הנחות לפי תכנית
  const discounts = {
    Intensive: getDiscount('Intensive'),
    Premium: getDiscount('Premium')
  };

  // תוכן מותאם לפי סוג המשתמש הקודם
  const getContentByPreviousSubscription = () => {
    switch (previousPlanType) {
      case 'Free Trial':
        return {
          title: `${userName}, תקופת ההתנסות שלך הסתיימה!`,
          subtitle: 'הגיע הזמן להמשיך ולשפר את האנגלית שלך',
          description: 'ראית כמה זה עובד - עכשיו הגיע הזמן להתקדם ברצינות! בחר את המסלול שמתאים לך ותמשיך להתקדם.',
          urgency: '',
          recommendedPlans: ['Intensive', 'Premium'],
          highlightPlan: 'Premium'
        };
      
      case 'Intensive':
        return {
          title: `${userName}, המסלול האינטנסיבי שלך הסתיים`,
          subtitle: 'מרשים! עשית עבודה נהדרת',
          description: 'ראינו את המסירות שלך ללמידה. המשך ושדרג את עצמך למסלול הפרימיום, או המשך באותו הקצב שאהבת.',
          urgency: `הנחת נאמנות של ${getDiscount('Intensive')}% במיוחד עבורך!`,
          recommendedPlans: ['Intensive', 'Premium'],
          highlightPlan: 'Premium'
        };
      
      case 'Premium':
        return {
          title: `${userName}, אנחנו מתגעגעים אליך`,
          subtitle: 'היית חלק מהקהילה הפרימיום שלנו',
          description: 'השקעת כל כך הרבה בלמידה - אל תעצור עכשיו! חדש את המנוי וחזור למסלול ההצלחה שלך.',
          urgency: `הנחת VIP של ${getDiscount('Premium')}% רק בשבילך!`,
          recommendedPlans: ['Premium', 'Intensive'],
          highlightPlan: 'Premium'
        };
      
      default:
        return {
          title: 'הצטרף שוב אלינו!',
          subtitle: 'המשך את מסע הלמידה שלך',
          description: 'בחר את המסלול המתאים לך והמשך להתקדם',
          urgency: '',
          recommendedPlans: ['Intensive', 'Premium'],
          highlightPlan: 'Premium'
        };
    }
  };

  const content = getContentByPreviousSubscription();

  const handlePlanSelection = async (planId) => {
    setIsLoading(true);
    setError('');
    setSelectedPlan(planId);

    try {
      const response = await fetch('/expired/api/renew-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPlanId: planId }),
      });

      // בדיקה שהתשובה היא JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', await response.text());
        throw new Error('שגיאת שרת - התקבלה תשובה לא תקינה');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בחידוש המנוי');
      }

      // הצלחה! שמור את הנתונים ופתח את המודל
      setRenewalData({
        subscription: data.subscription,
        actionType: data.actionType,
        wasExtended: data.wasExtended,
        daysAdded: data.daysAdded
      });
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Renewal error:', err);
      setError(err.message || 'אירעה שגיאה. אנא נסה שוב.');
      setSelectedPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 my-8">
      <div className="container mx-auto px-4 py-12">
        {/* כותרת וטקסט פתיחה */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {content.urgency}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {content.title}
          </h1>
          
          <p className="text-xl text-gray-700 mb-3">
            {content.subtitle}
          </p>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </p>

          {subscription?.end_date && (
            <div className="mt-6 inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <p className="text-sm text-yellow-800">
                מנוי ה-{subscription.subscription_type} שלך פג ב-
                {new Date(subscription.end_date).toLocaleDateString('he-IL')}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* כרטיסי המנויים - באמצעות הקומפוננטה החדשה */}
        <div className="mb-12">
          <PlansDisplay
            plansToShow={content.recommendedPlans}
            isBlocked={false}
            onPlanSelect={handlePlanSelection}
            discounts={discounts}
            highlightPlan={content.highlightPlan}
            isLoading={isLoading}
            selectedPlan={selectedPlan}
          />
        </div>

        {/* מידע נוסף */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h3 className="text-lg font-bold mb-3 text-gray-800">
              למה לחדש עכשיו?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
                <p>המשך ללא הפסקה</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <p>גישה לכל התכנים</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Crown className="h-5 w-5 text-green-600" />
                </div>
                <p>הנחת נאמנות</p>
              </div>
            </div>
          </div>

          {/* כפתור חזרה */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              חזרה לעמוד הבית
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && !showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-800">מעדכן את המנוי שלך...</p>
            <p className="text-sm text-gray-600 mt-2">רק עוד רגע קטן</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        userInfo={session?.user}
        subscriptionInfo={renewalData?.subscription}
        mode="renewal"
        actionType={renewalData?.actionType}
        wasExtended={renewalData?.wasExtended}
        daysAdded={renewalData?.daysAdded}
      />
    </div>
  );
}