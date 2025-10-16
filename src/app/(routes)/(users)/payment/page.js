// ============================================
// קומפוננטה ראשית - Payment Page
// ============================================
'use client'
import React, { useState } from 'react';
import ProgressBar from './components/progressBar'
import Step1PlanSummary from './components/planSummary'
import Step2PaymentDetails from './components/paymentDetails'
import Step3PaymentProcessing from './components/paymentProcessing'
import Step4Confirmation from './components/confirmation'
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    plan: searchParams.get('plan') || 'Intensive',
    basePrice: parseInt(searchParams.get('price')) || 747,
    duration: parseInt(searchParams.get('duration')) || 90,
    userEmail: searchParams.get('email') || '',
    userName: searchParams.get('name') || '',
    userImage: searchParams.get('image') || '',
    paymentMethod: 'full',
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
    setOrderData(prev => ({ ...prev, ...stepData }));
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
            <h1 className="text-2xl font-bold text-gray-800">השלמת הרכישה</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} />

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