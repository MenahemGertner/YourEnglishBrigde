import React from 'react';
import { Check, Zap, Crown, Gift } from 'lucide-react';

/**
 * קומפוננטת תצוגת תכניות מנוי
 * 
 * @param {Array} plansToShow - מערך של IDs של תכניות להצגה ['Free Trial', 'Intensive', 'Premium']
 * @param {boolean} isBlocked - האם התכניות חסומות (מצב הרצה)
 * @param {Function} onPlanSelect - callback לטיפול בבחירת תכנית (planId)
 * @param {Object} discounts - אובייקט הנחות לפי תכנית { Intensive: 10, Premium: 20 }
 * @param {string} highlightPlan - ID של התכנית להדגשה
 * @param {boolean} isLoading - האם במצב טעינה
 * @param {string} selectedPlan - התכנית שנבחרה כרגע
 */
export default function PlansDisplay({
  plansToShow = ['Free Trial', 'Intensive', 'Premium'],
  isBlocked = false,
  onPlanSelect,
  discounts = {},
  highlightPlan = 'Premium',
  isLoading = false,
  selectedPlan = null
}) {

  // הגדרת התכניות הבסיסיות
  const basePlans = [
    {
      id: 'Free Trial',
      title: 'התנסות חינם',
      icon: Gift,
      price: 0,
      duration: '7 יום',
      durationDays: 7,
      months: null,
      features: [
        'גישה מלאה למדריך האישי',
        'תמיכה בסיסית'
      ],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'Intensive',
      title: 'אינטנסיבי',
      icon: Zap,
      price: 249,
      duration: '3 חודשים',
      durationDays: 90,
      months: 3,
      features: [
        'גישה מלאה למדריך האישי',
        'תרגילים מתקדמים',
        'מעקב אחר התקדמות',
        'תמיכה מלאה'
      ],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'Premium',
      title: 'פרימיום',
      icon: Crown,
      price: 179,
      duration: '12 חודשים',
      durationDays: 360,
      months: 12,
      features: [
        'גישה מלאה למדריך האישי',
        'תמיכה VIP',
        'גישה מוקדמת לתכנים חדשים',
        'מחוייבות מלאה לתהליך',
        'החיסכון הכי גדול!'
      ],
      color: 'from-purple-600 to-blue-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      badge: 'פופולרי'
    }
  ];

  // חישוב מחיר סופי עם הנחה
  const calculateFinalPrice = (plan) => {
    if (plan.id === 'Free Trial') {
      return {
        original: 0,
        final: 0,
        discount: 0,
        perMonth: 0
      };
    }

    const discount = discounts[plan.id] || 0;
    const totalOriginal = plan.price * plan.months;
    const totalFinal = Math.round(totalOriginal * (1 - discount / 100));
    
    return {
      original: totalOriginal,
      final: totalFinal,
      discount: discount,
      perMonth: Math.round(totalFinal / plan.months)
    };
  };

  // סינון התכניות לפי plansToShow
  const filteredPlans = basePlans.filter(plan => plansToShow.includes(plan.id));

  return (
    <div className={`grid grid-cols-1 gap-8 ${
      filteredPlans.length === 2 ? 'md:grid-cols-2 max-w-5xl' : 'md:grid-cols-3 max-w-6xl'
    } mx-auto`}>
      {filteredPlans.map((plan) => {
        const Icon = plan.icon;
        const pricing = calculateFinalPrice(plan);
        const isHighlighted = plan.id === highlightPlan;
        const isSelected = selectedPlan === plan.id;

        return (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg relative flex flex-col transition-all duration-300 ${
              isHighlighted && !isBlocked ? 'ring-4 ring-purple-400 ring-opacity-50 hover:shadow-2xl hover:scale-105' : ''
            }`}
          >
            {/* תג פופולרי או מומלץ */}
            {plan.badge && !isBlocked && (
              <div className="absolute -top-3 right-4 z-20">
                <div className={`bg-gradient-to-r ${plan.color} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2`}>
                  {plan.id === 'Premium' && <Crown className="h-4 w-4" />}
                  {plan.badge}
                </div>
              </div>
            )}

            <div className="p-6 flex-grow">
              {/* אייקון וכותרת - רק לתכניות בתשלום */}
              {plan.id !== 'Free Trial' ? (
                <div className="flex items-center gap-3 mb-6 mt-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{plan.title}</h3>
                    <p className="text-gray-500 text-sm">{plan.duration}</p>
                  </div>
                </div>
              ) : (
                <h3 className="text-xl font-bold mb-4 text-right mt-4">{plan.title}</h3>
              )}

              {/* מחיר */}
              <div className="text-right mb-6">
                {plan.id === 'Free Trial' ? (
                  <div>
                    <span className="text-3xl font-bold">₪0</span>
                    <span className="text-gray-500 mr-2">/ {plan.duration}</span>
                  </div>
                ) : (
                  <>
                    {pricing.discount > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl font-bold text-gray-800">
                            ₪{pricing.final}
                          </span>
                          <span className="text-2xl text-gray-400 line-through">
                            ₪{pricing.original}
                          </span>
                        </div>
                        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          חיסכון של {pricing.discount}%! 🎉
                        </div>
                        <p className="text-gray-600">
                          רק ₪{pricing.perMonth} לחודש
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold">₪{pricing.final}</span>
                        <span className="text-gray-500 mr-2">/ {plan.duration}</span>
                        {plan.months && (
                          <p className="text-gray-600 mt-1">
                            ₪{pricing.perMonth} לחודש
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* תכונות */}
              <ul dir="rtl" className="space-y-3 mb-6 list-none p-0">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-right flex-grow text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* כפתור */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onPlanSelect && onPlanSelect(plan.id)}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  isHighlighted
                    ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:scale-105`
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isSelected && isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    מעבד...
                  </>
                ) : (
                  isHighlighted ? 'בחר עכשיו!' : 'בחר תכנית זו'
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}