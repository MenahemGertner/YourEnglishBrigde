import React, { useState } from 'react';

const SpeedToggle = ({ onSpeedChange }) => {
  const [isNormalSpeed, setIsNormalSpeed] = useState(true);
  
  const handleToggle = () => {
    const newSpeedState = !isNormalSpeed;
    setIsNormalSpeed(newSpeedState);
    
    // מהירות רגילה: 1.0, מהירות איטית: 0.7
    const speedValue = newSpeedState ? 1.0 : 0.7;
    
    // קריאה לפונקציה שהועברה כ-prop (לשימוש עתידי)
    if (onSpeedChange) {
      onSpeedChange(speedValue);
    }
    
    console.log(`מהירות השתנתה ל: ${speedValue}`);
  };

  return (
    <div className="flex items-center gap-3 p-4" dir="rtl">
      <span className="text-sm font-medium text-gray-700">מהירות השמעה:</span>
      
      <div className="relative">
        {/* הכפתור המתחלף */}
        <button
          onClick={handleToggle}
          className={`
            relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isNormalSpeed ? 'bg-blue-600' : 'bg-gray-400'}
          `}
        >
          {/* הכדור הנע - עם פוזישן אבסולוטי במקום טרנספורם */}
          <span
            className={`
              absolute h-6 w-6 rounded-full bg-white shadow-lg transition-all duration-200 ease-in-out
              ${isNormalSpeed ? 'right-1' : 'right-9'}
            `}
          />
        </button>
      </div>
      
      {/* תווית המציגה את המהירות הנוכחית */}
      <span className="text-sm text-gray-600 min-w-16">
        {isNormalSpeed ? 'רגילה' : 'איטית'}
      </span>
      
    </div>
  );
};

export default SpeedToggle;