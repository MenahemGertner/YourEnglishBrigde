import React, { useState } from 'react';
import { CreditCard, MapPin, User, Phone, Mail, ChevronDown } from 'lucide-react';
import { calculatePayments, getPaymentOptions, formatPrice, getPaymentDescription } from './payment-utils';

export default function Step2PaymentDetails({ orderData, onComplete }) {
  if (!orderData) {
    console.error('❌ orderData is missing!');
    return <div className="text-center p-8">שגיאה: נתונים חסרים</div>;
  }

  // ⬅️ כל השורות האלה ימשיכו רק אם orderData בטוח קיים
  const paymentConfig = getPaymentOptions(orderData.plan);
  const isRenewal = orderData.mode === 'renewal';
  const discount = orderData.discount || 0;
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [isInstallmentsOpen, setIsInstallmentsOpen] = useState(false);
  const [formData, setFormData] = useState(orderData.formData || {
    fullName: orderData.userName || '',
    email: orderData.userEmail || '',
    phone: '',
    city: '',
    street: '',
    houseNumber: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({});

  // חישוב התשלומים בצורה מרכזית
  const paymentDetails = calculatePayments(orderData.basePrice, selectedInstallments);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    // אם זה renewal, אין צורך לוולידציה של פרטים אישיים
    if (isRenewal) {
      return true;
    }

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
      onComplete({ 
        formData,
        installmentsCount: selectedInstallments,
        paymentDetails
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        
        {/* Personal Details - רק למשתמשים חדשים */}
        {!isRenewal && (
          <>
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
          </>
        )}

        {/* הודעה ידידותית למשתמש חוזר */}
        {isRenewal && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">
                שלום שוב, {formData.fullName}! 👋
              </h3>
            </div>
            <p className="text-gray-700 mb-2">
              פרטיך כבר שמורים אצלנו
            </p>
            <p className="text-sm text-gray-600">
              נותר רק לבחור את אופן התשלום המועדף עליך
            </p>
          </div>
        )}

        {/* Payment Method - Installments Selector - לכולם */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            אופן תשלום
          </h3>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsInstallmentsOpen(!isInstallmentsOpen)}
              className="w-full p-4 border-2 border-blue-500 bg-blue-50 rounded-lg text-right transition-all hover:bg-blue-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-gray-800">
                    {selectedInstallments === 1 
                      ? 'תשלום מלא' 
                      : `פריסה ל-${selectedInstallments} תשלומים`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getPaymentDescription(selectedInstallments)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(paymentDetails.firstPayment)}
                  </div>
                  {selectedInstallments > 1 && (
                    <div className="text-sm text-gray-500">לתשלום</div>
                  )}
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                  isInstallmentsOpen ? 'rotate-180' : ''
                }`} />
              </div>
            </button>

            {/* Dropdown Options */}
            {isInstallmentsOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {paymentConfig.options.map((numPayments) => {
                  const optionDetails = calculatePayments(orderData.basePrice, numPayments);
                  
                  return (
                    <button
                      key={numPayments}
                      type="button"
                      onClick={() => {
                        setSelectedInstallments(numPayments);
                        setIsInstallmentsOpen(false);
                      }}
                      className={`w-full p-4 text-right transition-all hover:bg-blue-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                        selectedInstallments === numPayments ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div>
                        <div className="font-bold text-gray-800">
                          {numPayments === 1 
                            ? 'תשלום מלא' 
                            : `${numPayments} תשלומים`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {numPayments === 1 
                            ? 'חיוב חד פעמי - ללא ריבית' 
                            : `תשלום ראשון: ${formatPrice(optionDetails.firstPayment)}, יתר התשלומים: ${formatPrice(optionDetails.regularPayment)}`}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        {formatPrice(optionDetails.firstPayment)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            {isRenewal && discount > 0 && (
              <>
                <div className="flex justify-between text-gray-500 mb-2 line-through">
                  <span>מחיר רגיל:</span>
                  <span>{formatPrice(Math.floor(orderData.basePrice / (1 - discount / 100)))}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium mb-2">
                  <span>הנחת נאמנות ({discount}%):</span>
                  <span className="font-bold">חיסכון של {formatPrice(Math.floor(orderData.basePrice / (1 - discount / 100)) - orderData.basePrice)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-gray-700 mb-2">
              <span>{isRenewal && discount > 0 ? 'מחיר לתשלום:' : 'מחיר מלא:'}</span>
              <span className="font-bold">{formatPrice(orderData.basePrice)}</span>
            </div>
            {selectedInstallments > 1 && (
              <>
                <div className="flex justify-between text-blue-600 font-medium mb-2">
                  <span>פריסה ל-{selectedInstallments} תשלומים:</span>
                  <div className="text-left">
                    <div>תשלום ראשון: {formatPrice(paymentDetails.firstPayment)}</div>
                    <div className="text-sm">יתר התשלומים: {formatPrice(paymentDetails.regularPayment)} × {selectedInstallments - 1}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center pt-2 border-t">
                  התשלום הראשון יחויב כעת: {formatPrice(paymentDetails.firstPayment)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-bold text-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          המשך לתשלום מאובטח
          <CreditCard className="inline-block mr-2 h-5 w-5" />
        </button>

        <p className="text-center text-sm text-gray-500">
          התשלום מאובטח ומוצפן בתקן PCI DSS
        </p>
      </div>
    </div>
  );
}