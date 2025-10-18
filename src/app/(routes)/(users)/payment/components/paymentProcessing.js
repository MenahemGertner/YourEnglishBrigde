import React, { useState, useEffect } from 'react';
import { Loader, CheckCircle } from 'lucide-react';
import { formatPrice } from './payment-utils';

export default function Step3PaymentProcessing({ orderData, onComplete }) {
  const [status, setStatus] = useState('processing'); // processing, success

  useEffect(() => {
    // דמה תהליך תשלום - 2 שניות
    const timer = setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onComplete({});
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // שימוש בפירוט התשלומים שעבר מהשלב הקודם
  const { paymentDetails, installmentsCount } = orderData;
  const currentPayment = paymentDetails?.firstPayment || orderData.basePrice;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="text-center">
          {status === 'processing' ? (
            <>
              <Loader className="h-20 w-20 text-blue-500 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">מעבד את התשלום...</h2>
              <p className="text-gray-600 mb-6">
                אנא המתן, התהליך עשוי לקחת מספר שניות
              </p>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">סכום לתשלום:</p>
                <p className="text-3xl font-bold text-blue-600">{formatPrice(currentPayment)}</p>
                {installmentsCount > 1 && (
                  <p className="text-sm text-gray-500 mt-2">
                    תשלום ראשון מתוך {installmentsCount}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-green-600 mb-4">התשלום בוצע בהצלחה!</h2>
              <p className="text-gray-600">מעביר אותך לדף האישור...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}