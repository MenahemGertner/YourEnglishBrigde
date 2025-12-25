// app/(routes)/(games)/prepositions/hooks/useTimer.js

import { useEffect, useRef } from 'react';

/**
 * Custom hook לניהול טיימר
 * @param {boolean} isActive - האם הטיימר פעיל
 * @param {function} onTick - פונקציה שתקרא בכל tick (מקבלת deltaTime)
 * @param {number} interval - מרווח הזמן בין ticks במילישניות (default: 100)
 */
export const useTimer = (isActive, onTick, interval = 100) => {
  const intervalRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Reset last time when starting
    lastTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = now;

      onTick(deltaTime);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onTick, interval]);
};

/**
 * פורמט זמן לתצוגה (MM:SS)
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * חישוב אחוז הזמן שנותר
 */
export const getTimePercentage = (timeRemaining, maxTime) => {
  return (timeRemaining / maxTime) * 100;
};