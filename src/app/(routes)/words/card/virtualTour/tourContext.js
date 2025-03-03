// tourContext.js - קונטקסט לניהול מצב המדריך
import React, { createContext, useState, useContext } from 'react';
import { getCurrentStep, saveCurrentStep, markTourAsCompleted } from './utils';

const TourContext = createContext(undefined);

export const TourProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [tourConfig, setTourConfig] = useState(null);
  const [currentTourId, setCurrentTourId] = useState(null);

  const startTour = (config) => {
    const tourId = `tour_${Date.now()}`;
    setCurrentTourId(tourId);
    setTourConfig(config);
    setSteps(config.steps);
    setCurrentStep(getCurrentStep(tourId));
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (currentTourId) {
        saveCurrentStep(currentTourId, newStep);
      }
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (currentTourId) {
        saveCurrentStep(currentTourId, newStep);
      }
    }
  };

  const skipTour = () => {
    setIsActive(false);
    tourConfig?.onSkip?.();
  };

  const endTour = () => {
    setIsActive(false);
    if (currentTourId) {
      markTourAsCompleted(currentTourId);
    }
    tourConfig?.onComplete?.();
  };

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        endTour,
        currentTourId
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};