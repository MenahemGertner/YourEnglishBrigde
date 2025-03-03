// tourOverlay.js - שכבת הרקע שמדגישה את האלמנט הנוכחי
import React from 'react';
import { useTour } from './tourContext';

export const TourOverlay = () => {
  const { isActive } = useTour();

  if (!isActive) return null;

  return (
    <div className="tour-overlay fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none">
      {/* השכבה הזו רק מעמעמת את הרקע כדי להדגיש את האלמנט הנוכחי */}
    </div>
  );
};