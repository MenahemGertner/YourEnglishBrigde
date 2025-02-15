'use client'
import React from 'react';

const AnimatedBackground = ({ variant = 'default' }) => {
  // התאמת השקיפות והצבעים לפי הווריאנט
  const styles = {
    default: {
      gradientFrom: 'rgba(147,51,234,0.05)',
      gradientTo: 'rgba(59,130,246,0.05)',
      swirlColors: ['rgb(147,51,234)', 'rgb(59,130,246)', 'rgb(147,51,234)', 'rgb(59,130,246)'],
      opacities: [0.015, 0.01, 0.005, 0.01]
    },
    minimal: {
      gradientFrom: 'rgba(147,51,234,0.03)',
      gradientTo: 'rgba(59,130,246,0.03)',
      swirlColors: ['rgb(147,51,234)', 'rgb(59,130,246)', 'rgb(147,51,234)', 'rgb(59,130,246)'],
      opacities: [0.005, 0.01, 0.005, 0.01]
    }
  };

  const currentStyle = styles[variant];

  return (
    <>
      {/* Base gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, ${currentStyle.gradientFrom}, ${currentStyle.gradientTo})`
        }}
      />
      
      {/* Swirly stripes */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
          {/* First swirl */}
          <path 
            d="M-50,100 
               C50,80 100,150 150,100 
               S250,20 300,100 
               S400,150 450,100 
               V300 H-50 Z" 
            fill={currentStyle.swirlColors[0]}
            opacity={currentStyle.opacities[0]}
            style={{
              animation: 'swirl 20s ease-in-out infinite',
            }}
          />
          
          {/* Second swirl */}
          <path 
            d="M-50,150 
               C0,100 100,200 200,150 
               S300,50 350,150 
               S450,200 500,150 
               V300 H-50 Z" 
            fill={currentStyle.swirlColors[1]}
            opacity={currentStyle.opacities[1]}
            style={{
              animation: 'swirl 25s ease-in-out 2s infinite',
            }}
          />
          
          {/* Third swirl */}
          <path 
            d="M-100,180 
               C0,150 50,220 150,180 
               S250,120 350,180 
               S450,220 500,180 
               V300 H-100 Z" 
            fill={currentStyle.swirlColors[2]}
            opacity={currentStyle.opacities[2]}
            style={{
              animation: 'swirl 30s ease-in-out 4s infinite',
            }}
          />
          
          {/* Fourth swirl */}
          <path 
            d="M-100,200 
               C-50,180 0,240 50,200
               S150,140 200,200
               S300,240 350,200
               S450,160 500,200
               V300 H-100 Z" 
            fill={currentStyle.swirlColors[3]}
            opacity={currentStyle.opacities[3]}
            style={{
              animation: 'swirl-back 22s ease-in-out infinite',
            }}
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes swirl {
          0%, 100% { transform: translateX(0%) translateY(0%) scale(1); }
          33% { transform: translateX(-5%) translateY(2%) scale(1.02); }
          66% { transform: translateX(5%) translateY(-2%) scale(0.98); }
        }

        @keyframes swirl-back {
          0%, 100% { transform: translateX(0%) translateY(0%) scale(1); }
          33% { transform: translateX(5%) translateY(2%) scale(1.02); }
          66% { transform: translateX(-5%) translateY(-2%) scale(0.98); }
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;