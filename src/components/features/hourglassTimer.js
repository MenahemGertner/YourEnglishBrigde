"use client";

import React, { useState, useEffect } from 'react';

const HourglassTimer = () => {
  // 10 minutes in milliseconds
  const totalTime = 10 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1000);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Calculate the sand level as a percentage
  const sandPercentage = (timeLeft / totalTime) * 100;
  
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  // Format time left as mm:ss
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Create falling sand particles effect
  const renderSandParticles = () => {
    if (isRunning && timeLeft < totalTime) {
      return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-1 h-4">
          <div className="animate-sand-fall w-1 h-1 bg-amber-300 rounded-full absolute"></div>
          <div className="animate-sand-fall-delay-1 w-1 h-1 bg-amber-300 rounded-full absolute"></div>
          <div className="animate-sand-fall-delay-2 w-1 h-1 bg-amber-300 rounded-full absolute"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Timer display */}
      <div className="text-2xl mb-4 font-mono">{formatTimeLeft()}</div>
      
      {/* Hourglass container */}
      <div className="relative w-52 h-80">
        {/* Top half of hourglass */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-32 
                        bg-gray-100 border-2 border-gray-800 rounded-t-full overflow-hidden">
          <div className="relative w-full h-full">
            {/* Sand in top chamber */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-amber-200 transition-all duration-1000"
              style={{ height: `${sandPercentage}%` }}
            />
          </div>
        </div>

        {/* Middle/Neck part */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-8 h-16 
                        bg-gray-800 flex justify-center">
          <div className="w-4 bg-amber-800">
            {renderSandParticles()}
          </div>
        </div>

        {/* Bottom half of hourglass */}
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-40 h-32 
                        bg-gray-100 border-2 border-gray-800 rounded-b-full overflow-hidden">
          <div className="relative w-full h-full">
            {/* Sand in bottom chamber */}
            <div 
              className="absolute top-0 left-0 right-0 bg-amber-200 transition-all duration-1000"
              style={{ height: `${100 - sandPercentage}%` }}
            />
          </div>
        </div>

        {/* Base of hourglass */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-4 
                       bg-gray-800 rounded"></div>
      </div>
      
      {/* Controls */}
      <div className="mt-8 flex space-x-4">
        <button 
          onClick={handleStart}
          disabled={isRunning}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          התחל
        </button>
        <button 
          onClick={handlePause}
          disabled={!isRunning}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
        >
          השהה
        </button>
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          אפס
        </button>
      </div>
    </div>
  );
};

export default HourglassTimer;