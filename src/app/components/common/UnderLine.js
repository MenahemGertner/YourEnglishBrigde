'use client'
import React from "react";

const underLine = (text, wordForms) => {
    const wordsPattern = wordForms.map(form => `\\b${form}\\b`).join('|');
    const regex = new RegExp(`(${wordsPattern})`, 'gi');
    
    const parts = text.split(regex);
    
    return (
      <span className="inline">
        {parts.map((part, index) => {
          const isMatch = wordForms.some(form => 
            part.toLowerCase() === form.toLowerCase()
          );
          
          return isMatch ? (
            <span 
              key={index} 
              className="border-b border-gray-300 pb-0.5"
            >
              {part}
            </span>
          ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
          );
        })}
      </span>
    );
};

export default underLine;