'use client'
import React from "react";
import { partOfSpeechMap } from "@/app/(routes)/words/card/helpers/partOfSpeech.js"; 

const underLine = (text, wordForms, partOfSpeech = null) => {
  const wordsPattern = wordForms.map(form => `\\b${form}\\b`).join('|');
  const regex = new RegExp(`(${wordsPattern})`, 'gi');
  
  const parts = text.split(regex);
  
  // Get border color based on part of speech
  let borderColor = "border-gray-300"; // Default color
  
  if (partOfSpeech) {
    const psType = partOfSpeech.charAt(0); // Get first character (V, N, A, F)
    const psInfo = partOfSpeechMap[psType];
    
    if (psInfo) {
      // Extract the color from the fill property
      // Convert hex to tailwind class
      if (psType === 'V') borderColor = "border-pink-400";
      else if (psType === 'N') borderColor = "border-sky-400";
      else if (psType === 'A') borderColor = "border-purple-500";
      else if (psType === 'F') borderColor = "border-slate-300";
      else if (psType === 'D') borderColor = "border-green-400";
    }
  }
  
  return (
    <span className="inline">
      {parts.map((part, index) => {
        const isMatch = wordForms.some(form => 
          part.toLowerCase() === form.toLowerCase()
        );
        
        return isMatch ? (
          <span
            key={index}
            className={`border-b ${borderColor} pb-0.5`}
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