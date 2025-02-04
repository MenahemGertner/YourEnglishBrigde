'use client'
import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const GlobeLoader = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 45) % 360);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center py-60">
      <Globe 
        size={48} 
        color="#10B981" 
        style={{ 
          transform: `rotate(${rotation}deg)`, 
          transition: 'transform 0.2s linear' 
        }}
        className="animate-pulse"
      />
    </div>
  );
};

export default GlobeLoader;