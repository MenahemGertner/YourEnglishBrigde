'use client'
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProgressBar from './components/progressBar'
import Step1PlanSummary from './components/planSummary'
import Step2PaymentDetails from './components/paymentDetails'
import Step3PaymentProcessing from './components/paymentProcessing'
import Step4Confirmation from './components/confirmation'
import { ArrowRight } from 'lucide-react';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  
  // זיהוי mode - האם זה רישום חדש או חידוש מנוי
  const mode = searchParams.get('mode') || 'new'; // 'new' או 'renewal'
  const previousPlan = searchParams.get('previousPlan') || '';
  const discount = parseInt(searchParams.get('discount')) || 0;
  const userId = searchParams.get('userId') || '';
  
  console.log('🚀 PaymentPage Init:', {
    mode,
    previousPlan,
    discount,
    userId,
    allParams: Object.fromEntries(searchParams.entries())
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    plan: searchParams.get('plan') || 'Intensive',
    basePrice: parseInt(searchParams.get('price')) || 747,
    duration: parseInt(searchParams.get('duration')) || 90,
    userEmail: decodeURIComponent(searchParams.get('email') || ''),
    userName: decodeURIComponent(searchParams.get('name') || ''),
    userImage: decodeURIComponent(searchParams.get('image') || ''),
    paymentMethod: 'full',
    mode: mode, // שמירת ה-mode
    previousPlan: previousPlan,
    discount: discount,
    userId: userId,
    formData: {
      fullName: decodeURIComponent(searchParams.get('name') || ''),
      email: decodeURIComponent(searchParams.get('email') || ''),
      phone: '',
      city: '',
      street: '',
      houseNumber: '',
      zipCode: ''
    }
  });


  const handleStepComplete = (stepData) => {
    console.log('📦 Step completed with data:', stepData);
    setOrderData(prev => {
      const updated = { ...prev, ...stepData };
      console.log('📊 Updated orderData:', updated);
      return updated;
    });
    
    // מעבר לשלב הבא - Step2 מוצג לכולם (עם תוכן מותאם)
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 my-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              <span>חזור</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {mode === 'renewal' ? 'חידוש מנוי' : 'השלמת הרכישה'}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar - כולם עוברים 4 שלבים */}
      <ProgressBar currentStep={currentStep} totalSteps={4} />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {currentStep === 1 && (
          <Step1PlanSummary 
            orderData={orderData}
            onComplete={handleStepComplete}
          />
        )}
        {currentStep === 2 && (
          <Step2PaymentDetails 
            orderData={orderData}
            onComplete={handleStepComplete}
          />
        )}
        {currentStep === 3 && (
          <Step3PaymentProcessing 
            orderData={orderData}
            onComplete={handleStepComplete}
          />
        )}
        {currentStep === 4 && (
          <Step4Confirmation 
            orderData={orderData}
          />
        )}
      </div>
    </div>
  );
}