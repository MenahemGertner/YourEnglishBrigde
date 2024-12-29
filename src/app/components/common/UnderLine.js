'use client'
import React from "react";
const underLine = (text, wordForms) => {
    const wordsPattern = wordForms.map(form => `\\b${form}\\b`).join('|');
    const regex = new RegExp(`(${wordsPattern})`, 'gi');
    
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      const isMatch = wordForms.some(form => 
        part.toLowerCase() === form.toLowerCase()
      );
      
      return isMatch ? (
        <span key={index} className="relative inline-block">
          {part}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 translate-y-0.5"></span>
        </span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      );
    });
};

export default underLine;