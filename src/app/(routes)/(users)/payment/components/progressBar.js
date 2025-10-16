// ============================================
// Progress Bar Component
// ============================================
import React from 'react';
import { Check } from 'lucide-react';
function ProgressBar({ currentStep }) {
  const steps = [
    { number: 1, label: 'בחירת תכנית' },
    { number: 2, label: 'פרטים ותשלום' },
    { number: 3, label: 'תשלום' },
    { number: 4, label: 'אישור' }
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > step.number 
                    ? 'bg-green-500' 
                    : currentStep === step.number 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span className={`font-bold ${
                      currentStep === step.number ? 'text-white' : 'text-gray-400'
                    }`}>{step.number}</span>
                  )}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${
                  currentStep === step.number 
                    ? 'text-blue-600' 
                    : currentStep > step.number 
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;