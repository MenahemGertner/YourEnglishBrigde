'use client'
import React from 'react';
import { ChevronDown } from 'lucide-react';
import useOpenWindow from '@/app/(routes)/words/card/hooks/openWindow';
import AdditionalWordInfo from './additionalWordInfo';

const Information = ({ ex, syn, con }) => {
  const { isOpen, toggleSection } = useOpenWindow('additionalInfo');
  
  const hasAdditionalData = 
    (ex && Object.keys(ex).length > 0) || 
    (syn && syn.length > 0) || 
    (con && con.length > 0);
  
  if (!hasAdditionalData) {
    return null;
  }

  return (
    <div className="mt-2 mb-4 text-center border-t border-gray-100">
      <button 
        onClick={() => toggleSection('additionalInfo')}
        className="toggle-button flex items-center justify-center mx-auto text-gray-600 hover:text-blue-600 transition-colors duration-300 mt-4"
      >
        <span className="text-sm font-medium">גלה יותר: ביטויים, מילים נרדפות ודומות</span>
        <ChevronDown className="h-4 w-4 mr-1" />
      </button>
      
      {isOpen && (
        <AdditionalWordInfo 
          ex={ex} 
          syn={syn} 
          con={con} 
        />
      )}
    </div>
  );
};

export default Information;