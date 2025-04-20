// components/GradientCat.jsx
'use client'

import React from 'react'

const GradientCat = ({ size = 56, className = "", onClick, isAnimated = false }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${isAnimated ? 'animate-bounce' : ''} ${className}`}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="catGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path 
        d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26.42.17.52.59.52.59.11.42.41 1.63-.69 3.33-.34.53-.68 1.05-1 1.58L22 12l-1.25 1.08-.8 3.34C19.1 19.95 15.6 22 12 22c-3.6 0-7.1-2.05-7.95-5.58l-.8-3.34L2 12l2.75-3.5c-.32-.53-.66-1.05-1-1.58-1.1-1.7-.8-2.91-.7-3.33 0 0 .11-.42.53-.59 1.39-.58 4.64.26 6.42 2.26.65-.17 1.33-.26 2-.26Z" 
        stroke="url(#catGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 14v.5M16 14v.5" 
        stroke="url(#catGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M11.25 16.25h1.5L12 17l-.75-.75Z" 
        stroke="url(#catGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default GradientCat