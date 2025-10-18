import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Loader, AlertCircle, Sparkles } from 'lucide-react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { formatPrice, calculatePaymentDates } from './payment-utils';

export default function Step4Confirmation({ orderData }) {
  const [status, setStatus] = useState('registering');
  const [error, setError] = useState('');
  const [registrationResult, setRegistrationResult] = useState(null);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const isRegistering = useRef(false);
  const registrationId = useRef(`reg-${Date.now()}-${Math.random()}`);
  const router = useRouter();

  const { paymentDetails, installmentsCount, mode } = orderData;
  const currentPayment = paymentDetails?.firstPayment || orderData.basePrice;
  const transactionId = 'TXN' + Date.now();

  const planDetails = {
    'Intensive': { name: 'תכנית אינטנסיבית', duration: '3 חודשים' },
    'Premium': { name: 'תכנית פרמיום', duration: '12 חודשים' }
  };

  // טקסטים מותאמים לפי mode
  const getTexts = () => {
    if (mode === 'renewal') {
      return {
        successTitle: 'המנוי חודש בהצלחה!',
        successSubtitle: 'חידוש המנוי הושלם',
        completingText: 'מחדש את המנוי שלך...',
        actionButtonText: 'חזור ללמידה',
        thankYouText: 'תודה שהמשכת איתנו!'
      };
    }
    return {
      successTitle: 'תשלום בוצע בהצלחה!',
      successSubtitle: 'ההרשמה שלך הושלמה',
      completingText: 'משלים את ההרשמה...',
      actionButtonText: 'התחל ללמוד עכשיו',
      thankYouText: 'ברוך הבא!'
    };
  };

  const texts = getTexts();

  useEffect(() => {
    if (isRegistering.current) {
      console.log('⚠️ Registration already in progress, skipping...', registrationId.current);
      return;
    }
    
    isRegistering.current = true;
    console.log('🔒 Starting registration process...', registrationId.current);

    const completeRegistration = async () => {
      try {
        const response = await fetch('/payment/api/complete-purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': `${orderData.userEmail}-${transactionId}`
          },
          body: JSON.stringify({
            email: orderData.userEmail,
            name: orderData.formData.fullName,
            avatar_url: orderData.userImage || null,
            phone: orderData.formData.phone || null,
            city: orderData.formData.city || null,
            street: orderData.formData.street || null,
            house_number: orderData.formData.houseNumber || null,
            zip_code: orderData.formData.zipCode || null,
            planId: orderData.plan,
            installmentsCount: installmentsCount || 1,
            paymentDetails: paymentDetails,
            transactionId: transactionId,
            mode: mode, // העברת ה-mode ל-API
            previousPlan: orderData.previousPlan,
            userId: orderData.userId
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        setRegistrationResult(data);
        setStatus('success');

      } catch (err) {
        console.error('Registration error:', err);
        setError(err.message || 'אירעה שגיאה בתהליך ההרשמה');
        setStatus('error');
      }
    };

    completeRegistration();
  }, []);

  const handleContinue = async () => {
    try {
      if (mode === 'renewal') {
        // משתמש קיים - הפניה ישירה לדף הבית
        router.push('/');
      } else {
        // משתמש חדש - הצגת הודעה ואז התחברות
        setShowRedirectMessage(true);
        
        // המתנה של שניה ואז מעבר לאימות
        setTimeout(async () => {
          await signIn('google', { 
            redirect: true,
            callbackUrl: '/levelSelection?showWelcome=true'
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setError('אירעה שגיאה בתהליך ההתחברות');
    }
  };

  // מסך טעינה בזמן רישום
  if (status === 'registering') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-12">
          <div className="text-center">
            <Loader className="h-20 w-20 text-blue-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{texts.completingText}</h2>
            <p className="text-gray-600 mb-6">
              אנא המתן, אנחנו {mode === 'renewal' ? 'מעדכנים את המנוי שלך' : 'יוצרים את החשבון שלך'}
            </p>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-sm text-gray-600">זה עשוי לקחת מספר שניות</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // מסך שגיאה
  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-12">
          <div className="text-center">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">אירעה שגיאה</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-all"
              >
                נסה שוב
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                חזור
              </button>
            </div>
            <div className="text-center pt-6 border-t mt-6">
              <p className="text-sm text-gray-600 mb-2">צריך עזרה?</p>
              <p className="text-sm text-gray-600">
                <a href="/contact" className="text-blue-600 hover:underline">צור קשר</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // חישוב תאריכי תשלומים עתידיים
  const paymentDates = calculatePaymentDates(installmentsCount || 1);

  // מסך הצלחה
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
          <CheckCircle className="h-24 w-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{texts.successTitle}</h1>
          <p className="text-lg opacity-90">{texts.successSubtitle}</p>
        </div>

        {/* Transaction Details */}
        <div className="p-8 space-y-6">
          
          {/* Transaction ID */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">מספר עסקה</p>
            <p className="text-xl font-mono font-bold text-gray-800">{transactionId}</p>
          </div>

          {/* Order Summary */}
          <div className="border-t border-b py-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-800 text-right">פרטי ההזמנה:</h3>
            
            <div className="flex justify-between text-right">
              <span className="text-gray-600">תכנית:</span>
              <span className="font-bold text-gray-800">{planDetails[orderData.plan].name}</span>
            </div>

            {mode === 'renewal' && orderData.previousPlan && (
              <div className="flex justify-between text-right">
                <span className="text-gray-600">תכנית קודמת:</span>
                <span className="font-medium text-gray-700">{orderData.previousPlan}</span>
              </div>
            )}

            {mode === 'renewal' && orderData.discount > 0 && (
              <div className="flex justify-between text-right">
                <span className="text-gray-600">הנחת נאמנות:</span>
                <span className="font-bold text-green-600">{orderData.discount}%</span>
              </div>
            )}

            <div className="flex justify-between text-right">
              <span className="text-gray-600">תקופה:</span>
              <span className="font-bold text-gray-800">{planDetails[orderData.plan].duration}</span>
            </div>

            <div className="flex justify-between text-right">
              <span className="text-gray-600">אופן תשלום:</span>
              <span className="font-bold text-gray-800">
                {installmentsCount === 1 ? 'תשלום מלא' : `פריסה ל-${installmentsCount} תשלומים`}
              </span>
            </div>

            <div className="flex justify-between text-right pt-4 border-t">
              <span className="text-gray-600">סכום ששולם:</span>
              <span className="text-2xl font-bold text-green-600">{formatPrice(currentPayment)}</span>
            </div>

            {installmentsCount > 1 && paymentDetails && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2 text-right">פירוט תשלומים:</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">תשלום ראשון (שולם):</span>
                    <span className="font-bold text-green-600">{formatPrice(paymentDetails.firstPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">יתר התשלומים ({installmentsCount - 1}):</span>
                    <span className="font-bold text-gray-800">{formatPrice(paymentDetails.regularPayment)} × {installmentsCount - 1}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-blue-200">
                    <span className="text-gray-600">סה&quot;כ:</span>
                    <span className="font-bold text-gray-800">{formatPrice(orderData.basePrice)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center pt-3 mt-3 border-t border-blue-200">
                  התשלומים הבאים יחויבו אוטומטית בתאריכים: <br />
                  {paymentDates.slice(1).map(date => date.toLocaleDateString('he-IL')).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* User Info - רק למשתמש חדש */}
          {mode === 'new' && (
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3 text-right">פרטי לקוח:</h3>
              <div className="space-y-2 text-right">
                <p className="text-gray-700"><span className="font-medium">שם:</span> {orderData.formData.fullName}</p>
                <p className="text-gray-700"><span className="font-medium">אימייל:</span> {orderData.formData.email}</p>
                <p className="text-gray-700"><span className="font-medium">טלפון:</span> {orderData.formData.phone}</p>
                <p className="text-gray-700">
                  <span className="font-medium">כתובת:</span> {orderData.formData.street} {orderData.formData.houseNumber}, {orderData.formData.city}
                </p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-3 text-right">מה הלאה?</h3>
            <ul className="space-y-2 text-right">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">קבלה ופרטי הרכישה נשלחו לכתובת המייל שלך</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  {mode === 'renewal' 
                    ? 'תוכל להמשיך ללמוד מיד לאחר לחיצה על הכפתור למטה'
                    : 'תוכל להתחיל ללמוד מיד לאחר לחיצה על הכפתור למטה'
                  }
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">המנוי שלך פעיל עד {new Date(Date.now() + orderData.duration*24*60*60*1000).toLocaleDateString('he-IL')}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-bold text-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {texts.actionButtonText}
            </button>
            
            <button
              onClick={() => window.print()}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              הדפס אישור
            </button>
          </div>

          {/* Support */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-gray-600 mb-2">יש שאלה? צריך עזרה?</p>
            <p className="text-sm text-gray-600">
              <a href="/contact" className="text-blue-600 hover:underline">צור קשר</a>
            </p>
          </div>
        </div>
      </div>

      {/* Redirect Message Modal - רק למשתמשים חדשים */}
      {showRedirectMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-4 text-center animate-fade-in">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              אימות קטן נוסף ומיד מתחילים!
            </h3>
            <div className="mt-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}