// virtualTour.js - קומפוננטה לניהול המדריך השלם
import React, { useEffect } from 'react';
import { TourProvider, useTour } from './tourContext';
import { TourController } from './tourController';
import { TourOverlay } from './tourOverlay';

const VirtualTourContent = ({ 
  tourId, 
  config, 
  autoStart = false,
  children 
}) => {
  const { startTour, isActive } = useTour();

  useEffect(() => {
    if (autoStart && !isActive) {
      // התחל את המדריך אוטומטית
      startTour(config);
    }
  }, [autoStart, config, startTour, isActive]);

  return (
    <>
      {children}
      <TourController />
      <TourOverlay />
    </>
  );
};

export const VirtualTour = (props) => {
  return (
    <TourProvider>
      <VirtualTourContent {...props} />
    </TourProvider>
  );
};