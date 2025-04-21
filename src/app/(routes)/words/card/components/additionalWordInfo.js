'use client'
import React from "react"
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AudioButton from "@/components/features/AudioButton";
import Tooltip from "@/components/features/Tooltip";
import { useWindowContext } from '@/app/(routes)/words/card/providers/WindowContext.js';
import MoreOrLess from "@/components/features/MoreOrLess"

const AdditionalWordInfo = ({ 
  ex, // ביטויים
  syn, // מילים נרדפות
  con // מילים דומות
}) => {
  const router = useRouter();
  const { toggleSection } = useWindowContext();

  const hasExData = ex && Object.keys(ex).length > 0;
  const hasSynData = syn && syn.length > 0;
  const hasConData = con && con.length > 0;
  
  if (!hasExData && !hasSynData && !hasConData) {
    return null;
  }

  const handleNavigation = (index) => {
    toggleSection(null);
    setTimeout(() => {
      router.push(`/words?index=${index}`);
    }, 0);
  };

  const generateExpressionsItems = (data) => {
    if (!data) return [];
    
    return Object.entries(data).map(([word, translation]) => ({
      word,
      translation
    }));
  };

  const exItems = generateExpressionsItems(ex);

  return (
<div className="max-h-[80vh] w-[75vw] max-w-[90vw] md:w-auto window-content fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 overflow-auto">      <div className="flex flex-col md:flex-row gap-6">
        {hasExData && (
          <div className="md:w-60 relative flex flex-col rounded-lg shadow-md overflow-hidden" dir="ltr">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-24 flex flex-col justify-center">
              <p className="font-semibold text-white text-xl text-center p-2 border-b border-blue-100/30">ביטויים</p>
              <p className="text-blue-100 text-sm text-center my-2">ביטויים נפוצים שעשויים לשנות את המשמעות הבסיסית של המילה</p>
            </div>
            <div className="p-4 bg-white flex-grow">
              <MoreOrLess
                items={exItems}
                itemRenderer={(item) => (
                  <div key={item.word} className="flex items-center hover:bg-blue-50 rounded-md p-2 transition-colors duration-200">
                    <AudioButton text={item.word} />
                    <div className="flex items-center gap-3">
                      <Tooltip content={item.translation}>
                        <span className="hover:text-blue-700 transition-colors duration-200">{item.word}</span>          
                      </Tooltip>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        )}
        
        {hasSynData && (
          <div className="md:w-60 relative flex flex-col rounded-lg shadow-md overflow-hidden" dir="ltr">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-24 flex flex-col justify-center">
              <p className="font-semibold text-white text-xl text-center p-2 border-b border-blue-100/30">מילים נרדפות</p>
              <p className="text-blue-100 text-sm text-center my-2">מילים חלופיות עם משמעות דומה</p>
            </div>
            <div className="p-4 bg-white flex-grow">
              <MoreOrLess
                items={syn}
                itemRenderer={(item) => (
                  <div key={item.word} className="flex items-center hover:bg-blue-50 rounded-md p-2 transition-colors duration-200">
                    <AudioButton text={item.word} />
                    <div className="flex items-center gap-3">
                      <Tooltip content={item.translation}>
                        <span className="hover:text-blue-700 transition-colors duration-200">{item.word}</span>          
                      </Tooltip>
                      <div 
                        onClick={() => handleNavigation(item.index)} 
                        className="cursor-pointer p-1 rounded-full hover:bg-blue-100 transition-all duration-200"
                      >
                        <ExternalLink className="h-3 w-3 text-blue-500 hover:scale-110 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {hasConData && (
          <div className="md:w-60 relative flex flex-col rounded-lg shadow-md overflow-hidden" dir="ltr">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-24 flex flex-col justify-center">
              <p className="font-semibold text-white text-xl text-center p-2 border-b border-blue-100/30">מילים דומות</p>
              <p className="text-blue-100 text-sm text-center my-2">מילים שונות שקל להתבלבל ביניהן</p>
            </div>
            <div className="p-4 bg-white flex-grow">
              <MoreOrLess
                items={con}
                itemRenderer={(item) => (
                  <div key={item.word} className="flex items-center hover:bg-blue-50 rounded-md p-2 transition-colors duration-200">
                    <AudioButton text={item.word} />
                    <div className="flex items-center gap-3">
                      <Tooltip content={item.translation}>
                        <span className="hover:text-blue-700 transition-colors duration-200">{item.word}</span>          
                      </Tooltip>
                      <div 
                        onClick={() => handleNavigation(item.index)} 
                        className="cursor-pointer p-1 rounded-full hover:bg-blue-100 transition-all duration-200"
                      >
                        <ExternalLink className="h-3 w-3 text-blue-500 hover:scale-110 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalWordInfo;