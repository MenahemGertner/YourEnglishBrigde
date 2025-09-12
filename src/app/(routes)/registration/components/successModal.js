import React from 'react';
import { Check, Calendar, ArrowLeft } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, userInfo, subscriptionInfo }) => {
  if (!isOpen) return null;

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanTitle = (planId) => {
    const plans = {
      'free': 'התנסות חינם',
      'monthly': 'חודשי',
      'semi-annual': 'חצי שנתי'
    };
    return plans[planId] || 'לא ידוע';
  };

  const getPlanType = (subscriptionType) => {
    const types = {
      'free': 'חינמי',
      'premium': 'פרימיום', 
      'pro': 'פרו'
    };
    return types[subscriptionType] || 'לא ידוע';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with success icon */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">ברוך הבא!</h2>
          <p className="text-green-100 mt-2">ההרשמה הושלמה בהצלחה</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700">
              שלום <span className="font-semibold text-gray-900">{getFirstName(userInfo?.name)}</span>!
            </p>
            <p className="text-gray-600 mt-1">חשבונך נוצר בהצלחה</p>
          </div>

          {/* Subscription Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">פרטי המנוי שלך</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">סוג מנוי:</span>
                <span className="font-medium text-gray-800">
                  {getPlanType(subscriptionInfo?.subscription_type)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">תחילת מנוי:</span>
                <span className="font-medium text-gray-800">
                  {formatDate(subscriptionInfo?.start_date)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">בתוקף עד:</span>
                <span className="font-medium text-blue-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(subscriptionInfo?.end_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              עכשיו נעביר אותך להתחלת המסע שלך!
            </p>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span>זיהוי קצר נוסף, ומתחילים</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;