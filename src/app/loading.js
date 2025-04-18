// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Globe } from 'lucide-react';

// export default function Loading() {
//   const [rotation, setRotation] = useState(0);
//   const [scale, setScale] = useState(1);
  
//   useEffect(() => {
//     const rotationInterval = setInterval(() => {
//       setRotation(prev => (prev + 1) % 360);
//     }, 20);

//     const scaleInterval = setInterval(() => {
//       setScale(prev => prev === 1 ? 1.2 : 1);
//     }, 1000);

//     return () => {
//       clearInterval(rotationInterval);
//       clearInterval(scaleInterval);
//     };
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md">
//       <div className="flex items-center justify-center h-screen">
//         <div className="relative">
//           {/* Outer spinning circle */}
//           <div 
//             className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-spin"
//             style={{ 
//               width: '80px', 
//               height: '80px',
//               animationDuration: '3s'
//             }}
//           />
          
//           {/* Inner spinning circle */}
//           <div 
//             className="absolute inset-0 border-4 border-emerald-300 rounded-full animate-spin"
//             style={{ 
//               width: '80px', 
//               height: '80px',
//               animationDuration: '2s',
//               animationDirection: 'reverse'
//             }}
//           />
          
//           {/* Globe icon */}
//           <Globe 
//             size={48}
//             color="#10B981"
//             style={{
//               transform: `rotate(${rotation}deg) scale(${scale})`,
//               transition: 'transform 0.2s ease-in-out',
//               margin: '16px'
//             }}
//             className="animate-pulse"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            className="animate-spin animate-pulse"
          >
            <defs>
              <linearGradient id="blue-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            
            {/* Main globe sphere */}
            
            {/* Latitude lines */}
            <path d="M2 12h20" stroke="url(#blue-purple-gradient)" strokeWidth="1" strokeLinecap="round" fill="none" />
            <path d="M4 6h16" stroke="url(#blue-purple-gradient)" strokeWidth="1" strokeLinecap="round" fill="none" />
            <path d="M4 18h16" stroke="url(#blue-purple-gradient)" strokeWidth="1" strokeLinecap="round" fill="none" />
            
            {/* Longitude lines */}
            <path d="M12 2v20" stroke="url(#blue-purple-gradient)" strokeWidth="1" strokeLinecap="round" fill="none" />
            <ellipse cx="12" cy="12" rx="10" ry="4" stroke="url(#blue-purple-gradient)" strokeWidth="1" fill="none" />
            <ellipse cx="12" cy="12" rx="10" ry="4" stroke="url(#blue-purple-gradient)" strokeWidth="1" fill="none" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" stroke="url(#blue-purple-gradient)" strokeWidth="1" fill="none" transform="rotate(-60 12 12)" />
          </svg>
        </div>
      </div>
    </div>
  );
}