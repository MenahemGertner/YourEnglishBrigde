'use client'

import { useState, useEffect } from 'react';

export default function SunBackground({ duration = 60 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / (duration * 1000)) % 1;
      setProgress(newProgress);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [duration]);

  // חישוב מיקום השמש (1 = ימין, 0 = שמאל - מימין לשמאל)
  const sunX = 100 - (progress * 100);
  
  // חישוב גובה השמש (קשת פרבולית)
  const sunY = 70 - Math.sin(progress * Math.PI) * 50;

  // חישוב צבעי הרקע בהתאם למיקום השמש - מעברים רכים יותר
  const getSkyColors = () => {
    if (progress < 0.08) {
      // לילה מוקדם
      const t = progress / 0.08;
      return {
        top: `rgb(${25}, ${25}, ${60 + t * 52})`,
        bottom: `rgb(${25}, ${25}, ${60 + t * 52})`
      };
    } else if (progress < 0.15) {
      // תחילת זריחה
      const t = (progress - 0.08) / 0.07;
      return {
        top: `rgb(${25 + t * 60}, ${25 + t * 80}, ${112 + t * 73})`,
        bottom: `rgb(${25 + t * 65}, ${25 + t * 65}, ${112 - t * 42})`
      };
    } else if (progress < 0.22) {
      // זריחה
      const t = (progress - 0.15) / 0.07;
      return {
        top: `rgb(${85 + t * 50}, ${105 + t * 75}, ${185 + t * 35})`,
        bottom: `rgb(${90 + t * 165}, ${90 + t * 90}, ${70 + t * 10})`
      };
    } else if (progress < 0.30) {
      // בוקר מוקדם
      const t = (progress - 0.22) / 0.08;
      return {
        top: `rgb(${135 + t * 0}, ${180 + t * 10}, ${220 + t * 15})`,
        bottom: `rgb(${255 - t * 55}, ${180 + t * 26}, ${80 + t * 90})`
      };
    } else if (progress < 0.40) {
      // בוקר
      const t = (progress - 0.30) / 0.10;
      return {
        top: `rgb(${135}, ${190 + t * 16}, ${235})`,
        bottom: `rgb(${200 - t * 10}, ${206 + t * 10}, ${170 + t * 10})`
      };
    } else if (progress < 0.60) {
      // צהריים
      const t = (progress - 0.40) / 0.20;
      return {
        top: `rgb(${135}, ${206}, ${235})`,
        bottom: `rgb(${190}, ${216 + t * 10}, ${180})`
      };
    } else if (progress < 0.70) {
      // אחר הצהריים
      const t = (progress - 0.60) / 0.10;
      return {
        top: `rgb(${135 - t * 15}, ${206 - t * 30}, ${235 - t * 35})`,
        bottom: `rgb(${190 + t * 30}, ${226 - t * 20}, ${180 - t * 30})`
      };
    } else if (progress < 0.78) {
      // שקיעה מוקדמת
      const t = (progress - 0.70) / 0.08;
      return {
        top: `rgb(${120 - t * 30}, ${176 - t * 50}, ${200 - t * 80})`,
        bottom: `rgb(${220 + t * 35}, ${206 - t * 46}, ${150 - t * 80})`
      };
    } else if (progress < 0.85) {
      // שקיעה
      const t = (progress - 0.78) / 0.07;
      return {
        top: `rgb(${90 - t * 35}, ${126 - t * 60}, ${120 - t * 55})`,
        bottom: `rgb(${255}, ${160 + t * 20}, ${70 - t * 50})`
      };
    } else if (progress < 0.92) {
      // דמדומים
      const t = (progress - 0.85) / 0.07;
      return {
        top: `rgb(${55 - t * 20}, ${66 - t * 31}, ${65 - t * 35})`,
        bottom: `rgb(${255 - t * 155}, ${180 - t * 90}, ${20 - t * 10})`
      };
    } else {
      // לילה
      const t = (progress - 0.92) / 0.08;
      return {
        top: `rgb(${35 - t * 10}, ${35 - t * 10}, ${30 - t * 10})`,
        bottom: `rgb(${100 - t * 75}, ${90 - t * 65}, ${10 + t * 10})`
      };
    }
  };

  const skyColors = getSkyColors();
  const sunOpacity = progress > 0.05 && progress < 0.95 ? 1 : 0.3;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* רקע שמיים עם גרדיאנט */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `linear-gradient(to bottom, ${skyColors.top}, ${skyColors.bottom})`
        }}
      />
      
      {/* השמש */}
      <div
        className="absolute rounded-full transition-opacity duration-1000"
        style={{
          left: `${sunX}%`,
          top: `${sunY}%`,
          width: '80px',
          height: '80px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#FDB813',
          boxShadow: '0 0 60px 20px rgba(253, 184, 19, 0.6)',
          opacity: sunOpacity
        }}
      />
    </div>
  );
}