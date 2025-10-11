import React from 'react';
import { Check, Calendar, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  userInfo, 
  subscriptionInfo,
  mode = 'registration', // 'registration' או 'renewal'
  actionType = 'renewed', // 'renewed', 'upgraded', 'downgraded'
  wasExtended = false,
  daysAdded = null
}) => {
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

  const getPlanTitle = (subscriptionType) => {
    const plans = {
      'Free Trial': 'התנסות חינם',
      'Intensive': 'אינטנסיבי',
      'Premium': 'פרימיום',
      'Coupon': 'קופון'
    };
    return plans[subscriptionType] || subscriptionType;
  };

  // תוכן דינמי לפי מצב
  const getModalContent = () => {
    if (mode === 'registration') {
      return {
        icon: Check,
        bgColor: 'from-green-500 to-green-600',
        title: 'ברוך הבא!',
        subtitle: 'ההרשמה הושלמה בהצלחה',
        greeting: `שלום ${getFirstName(userInfo?.name)}!`,
        message: 'חשבונך נוצר בהצלחה',
        nextStepTitle: 'עכשיו נעביר אותך להתחלת המסע שלך!',
        buttonText: 'זיהוי קצר נוסף, ומתחילים',
        buttonIcon: ArrowLeft
      };
    } else {
      // mode === 'renewal'
      let title, subtitle, message;
      
      if (actionType === 'upgraded') {
        title = 'שודרג בהצלחה!';
        subtitle = 'המנוי שלך שודרג';
        message = wasExtended 
          ? `קיבלת ${daysAdded} ימים נוספים למנוי שלך`
          : 'המנוי החדש שלך החל';
      } else if (actionType === 'downgraded') {
        title = 'עודכן בהצלחה!';
        subtitle = 'המנוי שלך עודכן';
        message = 'המנוי החדש שלך החל';
      } else {
        // renewed
        title = 'חודש בהצלחה!';
        subtitle = 'המנוי שלך חודש';
        message = wasExtended 
          ? `קיבלת ${daysAdded} ימים נוספים למנוי שלך`
          : 'המנוי החדש שלך החל';
      }

      return {
        icon: actionType === 'upgraded' ? Sparkles : RefreshCw,
        bgColor: actionType === 'upgraded' 
          ? 'from-purple-500 to-blue-600' 
          : 'from-blue-500 to-blue-600',
        title,
        subtitle,
        greeting: `${getFirstName(userInfo?.name)}, מעולה!`,
        message,
        nextStepTitle: 'אתה מוכן להמשיך',
        buttonText: 'חזרה לדף הבית',
        buttonIcon: ArrowLeft
      };
    }
  };

  const content = getModalContent();
  const IconComponent = content.icon;
  const ButtonIcon = content.buttonIcon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in duration-300">
        {/* Header with success icon */}
        <div className={`bg-gradient-to-r ${content.bgColor} p-6 text-center`}>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{content.title}</h2>
          <p className="text-white text-opacity-90 mt-2">{content.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700">
              <span className="font-semibold text-gray-900">{content.greeting}</span>
            </p>
            <p className="text-gray-600 mt-1">{content.message}</p>
          </div>

          {/* Subscription Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">
              {mode === 'registration' ? 'פרטי המנוי שלך' : 'פרטי המנוי המעודכן'}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">סוג מנוי:</span>
                <span className="font-medium text-gray-800">
                  {getPlanTitle(subscriptionInfo?.subscription_type)}
                </span>
              </div>
              
              {mode === 'registration' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">תחילת מנוי:</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(subscriptionInfo?.start_date)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">בתוקף עד:</span>
                <span className="font-medium text-blue-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(subscriptionInfo?.end_date)}
                </span>
              </div>

              {wasExtended && daysAdded && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-green-700 text-center font-medium">
                    🎉 קיבלת {daysAdded} ימים נוספים בונוס!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {content.nextStepTitle}
            </p>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <span>{content.buttonText}</span>
              <ButtonIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;