// ============================================
// Step 2: Payment Details
// ============================================
import React, { useState } from 'react';
import { CreditCard, Shield, Phone, Mail, MapPin, User } from 'lucide-react';

function Step2PaymentDetails({ orderData, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState(orderData.paymentMethod);
  const [formData, setFormData] = useState(orderData.formData);
  const [errors, setErrors] = useState({});

  const installmentPrice = Math.ceil(orderData.basePrice / 3);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'שם מלא הוא שדה חובה';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון הוא שדה חובה';
    } else if (!/^05\d{8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'מספר טלפון לא תקין';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'עיר היא שדה חובה';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'רחוב הוא שדה חובה';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'מספר בית הוא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({ paymentMethod, formData });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        
        {/* Personal Details */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            פרטים אישיים
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                שם מלא *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg text-right ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="הזן שם מלא"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-right bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                טלפון נייד *
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg text-right ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="050-1234567"
                  dir="ltr"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            כתובת לחיוב
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                עיר *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg text-right ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="הזן עיר"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.city}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  רחוב *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg text-right ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="הזן רחוב"
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1 text-right">{errors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  מספר *
                </label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg text-right ${
                    errors.houseNumber ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="מס׳"
                />
                {errors.houseNumber && (
                  <p className="text-red-500 text-sm mt-1 text-right">{errors.houseNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                מיקוד (אופציונלי)
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הזן מיקוד"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            אופן תשלום
          </h3>
          
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('full')}
              className={`w-full p-4 border-2 rounded-lg text-right transition-all ${
                paymentMethod === 'full'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'full' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'full' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">תשלום מלא</div>
                    <div className="text-sm text-gray-600">חיוב חד פעמי</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ₪{orderData.basePrice.toLocaleString()}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('installments')}
              className={`w-full p-4 border-2 rounded-lg text-right transition-all ${
                paymentMethod === 'installments'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'installments' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'installments' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">פריסה ל-3 תשלומים</div>
                    <div className="text-sm text-gray-600">ללא ריבית</div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₪{installmentPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">לחודש</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-bold text-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          המשך לתשלום מאובטח
          <Shield className="inline-block mr-2 h-5 w-5" />
        </button>

        <p className="text-center text-sm text-gray-500">
          התשלום מאובטח ומוצפן בתקן PCI DSS
        </p>
      </div>
    </div>
  );
}

export default Step2PaymentDetails;