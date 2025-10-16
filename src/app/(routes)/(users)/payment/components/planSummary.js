// ============================================
// Step 1: Plan Summary
// ============================================
import { Check, Calendar, Users, BookOpen, Shield } from 'lucide-react';
function Step1PlanSummary({ orderData, onComplete }) {
  const planDetails = {
    'Intensive': {
      name: 'תכנית אינטנסיבית',
      duration: '3 חודשים',
      features: [
        'גישה מלאה לכל השיעורים',
        'תרגול יומי מותאם אישית',
        'מעקב אחר התקדמות',
        'תמיכה טכנית מלאה',
        'תעודת סיום דיגיטלית'
      ],
      color: 'from-blue-500 to-purple-600'
    },
    'Premium': {
      name: 'תכנית פרמיום',
      duration: '12 חודשים',
      features: [
        'כל היתרונות של התכנית האינטנסיבית',
        'שיעורי אנגלית מתקדמים',
        'תרגול דיבור אינטראקטיבי',
        'חומרי לימוד בלעדיים',
        'גישה לקהילת הלומדים',
        'תמיכה עדיפות'
      ],
      color: 'from-purple-500 to-pink-600'
    }
  };

  const selectedPlan = planDetails[orderData.plan];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Plan Header */}
        <div className={`bg-gradient-to-r ${selectedPlan.color} text-white p-8 rounded-lg mb-8`}>
          <h2 className="text-3xl font-bold mb-4 text-right">{selectedPlan.name}</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-lg">{selectedPlan.duration}</span>
            </div>
            <div className="text-4xl font-bold">
              ₪{orderData.basePrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">מה כלול בתכנית:</h3>
          <ul className="space-y-3">
            {selectedPlan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-right">
                <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* User Info */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-3 text-right">פרטי המשתמש:</h3>
          <div className="space-y-2 text-right">
            <p className="text-gray-700"><span className="font-medium">שם:</span> {orderData.userName}</p>
            <p className="text-gray-700"><span className="font-medium">אימייל:</span> {orderData.userEmail}</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mb-8 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-10 w-10 text-green-500" />
              <span className="text-sm text-gray-600">תשלום מאובטח</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-10 w-10 text-blue-500" />
              <span className="text-sm text-gray-600">אלפי משתמשים</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-10 w-10 text-purple-500" />
              <span className="text-sm text-gray-600">גישה מיידית</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => onComplete({})}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-bold text-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          המשך למילוי פרטים
        </button>
      </div>
    </div>
  );
}

export default Step1PlanSummary;