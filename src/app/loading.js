'use client'
import React from 'react';
import { Globe } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-center h-screen">
        <Globe 
          size={48} 
          color="#10B981" 
          className="animate-spin animate-pulse"
        />
      </div>
    </div>
  );
}