'use client'
import React, { createContext, useContext, useState } from 'react';
import Script from 'next/script';

const ResponsiveVoiceContext = createContext({
  isReady: false,
  speak: () => {},
  cancel: () => {}
});

export const useResponsiveVoice = () => useContext(ResponsiveVoiceContext);

export const ResponsiveVoiceProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  const handleScriptLoad = () => {
    if (window.responsiveVoice) {
      setIsReady(true);
    }
  };

  const speak = (text, options = {}) => {
    if (!isReady || !window.responsiveVoice) return false;
    window.responsiveVoice.speak(text, "US English Male", options);
    return true;
  };

  const cancel = () => {
    if (!isReady || !window.responsiveVoice) return;
    window.responsiveVoice.cancel();
  };

  return (
    <>
      <Script
        id="responsivevoice"
        strategy="afterInteractive"
        src="https://code.responsivevoice.org/responsivevoice.js?key=aOMA3wyH"
        onLoad={handleScriptLoad}
      />
      <ResponsiveVoiceContext.Provider value={{ isReady, speak, cancel }}>
        {children}
      </ResponsiveVoiceContext.Provider>
    </>
  );
};