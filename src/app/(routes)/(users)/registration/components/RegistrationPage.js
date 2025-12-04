import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, X, Gift } from 'lucide-react';
import { signIn } from "next-auth/react";
import SuccessModal from '../../successModal';
import PlansDisplay from '../../plans';

export default function RegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  
  // States for coupon modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const image = searchParams.get('image');
    
    if (!email) {
      const callbackUrl = `/registration${window.location.search}`;
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }

    setUserEmail(decodeURIComponent(email));
    if (name) setUserName(decodeURIComponent(name));
    if (image) setUserImage(decodeURIComponent(image));
  }, [searchParams]);

  const handlePlanSelection = async (planId) => {
    // אם זה מסלול קופון - פתיחת מודל הקופון
    if (planId === 'Coupon') {
      setShowCouponModal(true);
      setCouponCode('');
      setCouponError('');
      return;
    }

    // אם זה Free Trial - הרשמה ישירה (ללא תשלום)
    if (planId === 'Free Trial') {
      await proceedWithRegistration(planId);
      return;
    }

    // אם זה Intensive או Premium - מעבר לדף תשלום
    if (planId === 'Intensive' || planId === 'Premium') {
      const planPrice = planId === 'Intensive' ? 747 : 2148;
      const planDuration = planId === 'Intensive' ? 90 : 360;
      
      router.push(
        `/payment?plan=${planId}&price=${planPrice}&duration=${planDuration}&email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(userName)}&image=${encodeURIComponent(userImage)}`
      );
      return;
    }
  };

  const validateCoupon = async (code) => {
    try {
      const response = await fetch('/registration/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: code,
          email: userEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Coupon validation failed');
      }

      return data.valid;
    } catch (error) {
      console.error('Coupon validation error:', error);
      throw error;
    }
  };

  const handleCouponSubmit = async () => {
    if (!couponCode.trim()) {
      setCouponError('אנא הזן קוד קופון');
      return;
    }

    setValidatingCoupon(true);
    setCouponError('');

    try {
      // בדיקת הקוד המנהלי הישן
      if (couponCode === '13579') {
        setShowCouponModal(false);
        await proceedWithRegistration('Coupon');
        return;
      }

      // בדיקת קופון במערכת החדשה
      const isValid = await validateCoupon(couponCode);
      
      if (isValid) {
        setShowCouponModal(false);
        await proceedWithRegistration('Coupon');
      } else {
        setCouponError('הקוד אינו תקין או שפג תוקפו');
      }

    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('שגיאה בבדיקת הקוד. נסה שוב.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const proceedWithRegistration = async (planId) => {
    setIsLoading(true);
    setError('');
  
    try {
      // שליחה ל-complete-purchase (הAPI הקיים שכבר עובד)
      const response = await fetch('/payment/api/complete-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          avatar_url: userImage,
          planId: planId === 'Coupon' ? 'Intensive' : planId, // קופון = Intensive (90 ימים)
          installmentsCount: 1, // עבור Free Trial/Coupon תמיד 1
          paymentDetails: null, // אין פרטי תשלום
          transactionId: planId === 'Coupon' ? `COUPON-${couponCode}` : 'FREE-TRIAL',
          mode: 'new' // תמיד רישום חדש
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // אם זה קופון והצליח - סימון הקופון כמשומש
      if (planId === 'Coupon' && couponCode !== '13579') {
        await markCouponAsUsed(couponCode, data.user.id);
      }

      setRegistrationData({
        user: data.user,
        subscription: data.subscription,
        selectedPlan: planId
      });

      setShowSuccessModal(true);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'אירעה שגיאה בתהליך ההרשמה. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const markCouponAsUsed = async (code, userId) => {
    try {
      await fetch('/registration/api/mark-coupon-used', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: code,
          userId: userId
        }),
      });
    } catch (error) {
      console.error('Error marking coupon as used:', error);
      // לא נעצור את התהליך בגלל זה
    }
  };

  const handleSuccessModalClose = async () => {
    setShowSuccessModal(false);
    
    try {
      await signIn('google', { 
        redirect: true,
        callbackUrl: '/levelSelection?showWelcome=true'
      });
    } catch (error) {
      console.error('Sign in error:', error);
      setError('אירעה שגיאה בתהליך ההתחברות');
    }
  };

  const closeCouponModal = () => {
    setShowCouponModal(false);
    setCouponCode('');
    setCouponError('');
  };

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowRight className="h-5 w-5" />
            <span>חזור</span>
          </button>
  
          <h1 className="text-4xl font-bold mb-8">הרשמה לאתר</h1>
  
          {userName && (
            <div className="bg-blue-50 rounded-lg mb-8">
              <div className="px-6 py-4">
                <p className="text-lg m-0">
                  <span className="font-bold">שלום {getFirstName(userName)}!</span>
                  <br />
                  ברוך הבא!
                </p>
              </div>
            </div>
          )}
  
          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg mb-8">
              <div className="px-6 py-4 flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
  
        {/* כרטיסי התכניות - מוצללים בהרצה */}
        <div className="relative">
          {/* שכבת הצללה */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-40 z-10 rounded-2xl flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                בקרוב!
              </h3>
              <p className="text-gray-600 mb-4">
                המסלולים הללו יהיו זמינים בקרוב.
                <br />
                כרגע ניתן להצטרף רק באמצעות קוד קופון.
              </p>
              <button
                onClick={() => setShowCouponModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-3 mx-auto font-bold shadow-lg text-lg"
              >
                <Gift className="h-6 w-6" />
                יש לי קוד קופון
              </button>
            </div>
          </div>
          
          {/* כרטיסי התכניות - מוצללים */}
          <div className="pointer-events-none blur-sm">
            <PlansDisplay
              plansToShow={['Free Trial', 'Intensive', 'Premium']}
              onPlanSelect={handlePlanSelection}
            />
          </div>
        </div>
  
        {isLoading && !showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-lg">מעבד את בקשתך...</p>
            </div>
          </div>
        )}

        {/* Coupon Code Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">הזן קוד קופון</h3>
                <button
                  onClick={closeCouponModal}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={validatingCoupon}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4 text-right">
                הזן את קוד הקופון שקיבלת כדי להצטרף לתכנית (3 חודשים):
              </p>
              
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="הזן קוד קופון"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-right font-mono tracking-wider"
                dir="ltr"
                disabled={validatingCoupon}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCouponSubmit();
                  }
                }}
              />
              
              {couponError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-right flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeCouponModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={validatingCoupon}
                >
                  ביטול
                </button>
                <button
                  onClick={handleCouponSubmit}
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {validatingCoupon && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {validatingCoupon ? 'בודק...' : 'אישור'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal 
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userInfo={registrationData?.user}
          subscriptionInfo={registrationData?.subscription}
        />
      </div>
    </div>
  );
}