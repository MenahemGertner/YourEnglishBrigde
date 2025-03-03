// tourController.js - קומפוננטה לניהול המדריך הוירטואלי
import React, { useEffect } from 'react';
import { useTour } from './tourContext';
import { highlightElement, scrollToElement } from './utils';

export const TourController = () => {
  const { isActive, steps, currentStep, nextStep, prevStep, skipTour, endTour } = useTour();

  useEffect(() => {
    if (isActive && steps.length > 0) {
      const currentStepData = steps[currentStep];
      scrollToElement(currentStepData.targetId);
      highlightElement(currentStepData.targetId);
      
      // כאן תוכל להוסיף קוד שיפעיל את ה-Tooltip הקיים שלך
      // לדוגמה: triggerTooltip(currentStepData.targetId, currentStepData.content);
    }
  }, [isActive, currentStep, steps]);

  if (!isActive) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="tour-controls fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">
          צעד {currentStep + 1} מתוך {steps.length}
        </span>
        <button 
          onClick={skipTour}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          דלג על המדריך
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={prevStep}
          disabled={isFirstStep}
          className={`px-4 py-2 rounded ${
            isFirstStep ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          הקודם
        </button>
        <button
          onClick={isLastStep ? endTour : nextStep}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLastStep ? 'סיים' : 'הבא'}
        </button>
      </div>
    </div>
  );
};