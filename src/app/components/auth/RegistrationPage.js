// components/auth/RegistrationPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { signIn } from "next-auth/react";

export default function RegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const image = searchParams.get('image');
    
    if (email) setUserEmail(decodeURIComponent(email));
    if (name) setUserName(decodeURIComponent(name));
    if (image) setUserImage(decodeURIComponent(image));
  }, [searchParams]);

  const handlePlanSelection = async (planId) => {
    if (!userEmail) {
      alert('יש לבצע זיהוי באמצעות Google לפני ההרשמה');
      // נעביר לתהליך הזיהוי הראשוני בלבד
      const callbackUrl = `/register`; // נחזור לדף ההרשמה אחרי הזיהוי
      
      // מעבר לזיהוי Google ללא התחברות בפועל
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          avatar_url: userImage,
          planId
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
  
      setIsLoading(true);
      alert('ההרשמה הושלמה בהצלחה! נעביר אותך לאימות קצר לצורך כניסה למערכת.');
      
      // רק כאן מתבצעת ההתחברות בפועל
      await signIn('google', { 
        redirect: true,
        callbackUrl: '/checkYourLevel'
      });
  
    } catch (err) {
      console.error('Registration error:', err);
      setError('אירעה שגיאה בתהליך ההרשמה. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      title: 'התנסות חינם',
      price: '0',
      duration: '14 יום',
      features: ['גישה מלאה למדריך האישי', 'תמיכה בסיסית'],
      isPopular: false,
      planId: 'free'
    },
    {
      title: 'חודשי',
      price: '99',
      duration: 'חודש',
      features: ['גישה מלאה למדריך האישי', 'תמיכה מלאה'],
      isPopular: true,
      planId: 'monthly'
    },
    {
      title: 'חצי שנתי',
      price: '399',
      duration: '6 חודשים',
      features: ['גישה מלאה למדריך האישי', 'תמיכה VIP', 'הטבות בלעדיות', 'חיסכון של 195 ש״ח'],
      isPopular: false,
      planId: 'semi-annual'
    }
  ];
  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowRight className="h-5 w-5" />
            <span>חזור</span>
          </button>
          
          <h1 className="text-4xl font-bold mb-4">הרשמה לאתר</h1>
          
          {userName && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <p className="text-lg">
                <span className="font-bold">שלום {getFirstName(userName)}!</span>
                <br />
                אנא בחר תכנית מתאימה להרשמה:
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* כרטיסי תמחור */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.planId} className={`bg-white rounded-lg shadow-lg p-6 ${plan.isPopular ? 'border-2 border-blue-500' : ''} relative`}>
              {plan.isPopular && (
                <span className="absolute -top-3 right-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  פופולרי
                </span>
              )}
              
              <h3 className="text-xl font-bold mb-4 text-right mt-4">{plan.title}</h3>
              <div className="text-right mb-6">
                <span className="text-3xl font-bold">₪{plan.price}</span>
                {plan.duration && <span className="text-gray-500 mr-2">/ {plan.duration}</span>}
              </div>
              
              <ul className="space-y-3 mb-6 text-right">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-end gap-2">
                    <span>{feature}</span>
                    <Check className="h-5 w-5 text-green-500" />
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handlePlanSelection(plan.planId)}
                className={`w-full py-2 px-4 rounded transition-all ${
                  plan.isPopular 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                בחר תכנית זו
              </button>
            </div>
          ))}
        </div>

        {/* לוודר */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-lg">מעבד את בקשתך...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}