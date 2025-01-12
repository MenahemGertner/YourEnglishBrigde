'use client'
import React from 'react';
import { signIn } from 'next-auth/react';

const PricingCard = ({ title, price, duration, features, isPopular, planId }) => {
  const handleSelection = () => {
    sessionStorage.setItem('selectedPlan', planId);
    signIn('google');
  };

  return (
    <div className={`bg-white rounded shadow-lg p-6 ${isPopular ? 'border-2 border-blue-500' : ''}`}>
      {isPopular && (
        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm float-right">
          פופולרי
        </span>
      )}
      <h3 className="text-xl font-bold mb-4 text-right">{title}</h3>
      <div className="text-right mb-6">
        <span className="text-3xl font-bold">₪{price}</span>
        {duration && <span className="text-gray-500 mr-2">/ {duration}</span>}
      </div>
      <ul className="space-y-3 mb-6 text-right">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center justify-end gap-2">
            <span>{feature}</span>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </li>
        ))}
      </ul>
      <button 
        onClick={handleSelection}
        className={`w-full py-2 px-4 rounded ${
          isPopular 
            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        הצטרף עכשיו
      </button>
    </div>
  );
};

const PricingPage = () => {
  const plans = [
    {
      title: 'התנסות חינם',
      price: '0',
      duration: '30 יום',
      features: [
        'גישה למדריך האישי',
        'תמיכה בסיסית',
        'גישה לתכנים בסיסיים'
      ],
      isPopular: false,
      planId: 'free'
    },
    {
      title: ' חודשי ',
      price: '99',
      duration: 'חודש',
      features: [
        'גישה מלאה למדריך האישי',
        'תמיכה מלאה',
        'גישה לכל התכנים',
        'הטבות בלעדיות'
      ],
      isPopular: true,
      planId: 'monthly'
    },
    {
      title: 'חצי שנתי',
      price: '399',
      duration: '6 חודשים',
      features: [
        'גישה מלאה למדריך האישי',
        'תמיכה VIP',
        'גישה לכל התכנים',
        'הטבות בלעדיות',
        'חיסכון של 195 ש״ח'
      ],
      isPopular: false,
      planId: 'semi-annual'
    }
  ];

  return (
    <main className="container mx-auto px-4 mt-8 mb-8">
      <div className="max-w-6xl mx-auto bg-blue-50 rounded p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">בחר את התכנית המתאימה לך</h2>
          <p className="text-gray-600">כל התכניות כוללות גישה למדריך האישי</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PricingPage;