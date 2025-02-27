'use client'
import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export default function Loading() {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 20);

    const scaleInterval = setInterval(() => {
      setScale(prev => prev === 1 ? 1.2 : 1);
    }, 1000);

    return () => {
      clearInterval(rotationInterval);
      clearInterval(scaleInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md">
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          {/* Outer spinning circle */}
          <div 
            className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-spin"
            style={{ 
              width: '80px', 
              height: '80px',
              animationDuration: '3s'
            }}
          />
          
          {/* Inner spinning circle */}
          <div 
            className="absolute inset-0 border-4 border-emerald-300 rounded-full animate-spin"
            style={{ 
              width: '80px', 
              height: '80px',
              animationDuration: '2s',
              animationDirection: 'reverse'
            }}
          />
          
          {/* Globe icon */}
          <Globe 
            size={48}
            color="#10B981"
            style={{
              transform: `rotate(${rotation}deg) scale(${scale})`,
              transition: 'transform 0.2s ease-in-out',
              margin: '16px'
            }}
            className="animate-pulse"
          />
        </div>
      </div>
    </div>
  );
}
// import React from 'react';
// import { Globe } from 'lucide-react';

// export default function Loading() {
//   return (
//     <div className="fixed inset-0 bg-white/80 backdrop-blur-sm">
//       <div className="flex items-center justify-center h-screen">
//         <Globe 
//           size={48} 
//           color="#10B981" 
//           className="animate-spin animate-pulse"
//         />
//       </div>
//     </div>
//   );
// }