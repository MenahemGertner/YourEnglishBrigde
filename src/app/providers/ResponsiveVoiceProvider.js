'use client'
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Script from 'next/script';

const ResponsiveVoiceContext = createContext({
  isReady: false,
  speak: () => {},
  cancel: () => {}
});

export const useResponsiveVoice = () => useContext(ResponsiveVoiceContext);

export const ResponsiveVoiceProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const isSpeaking = useRef(false);
  const cancelRequested = useRef(false);

  // מטפל בטעינת הסקריפט
  const handleScriptLoad = () => {
    if (window.responsiveVoice) {
      console.log('ResponsiveVoice script loaded');
      setIsReady(true);
    }
  };

  // מטפל בביטול הדיבור עם הגנה מפני מרוצי תנאים
  const cancel = () => {
    if (!window.responsiveVoice) return;
    
    cancelRequested.current = true;
    
    try {
      window.responsiveVoice.cancel();
      // נאפס את הדגלים אחרי זמן קצר לוודא שהביטול הושלם
      setTimeout(() => {
        isSpeaking.current = false;
        cancelRequested.current = false;
      }, 50);
    } catch (e) {
      console.error('Error canceling speech:', e);
      isSpeaking.current = false;
      cancelRequested.current = false;
    }
  };

  // פונקציית הדיבור עם הגנות מפני התנגשויות
  const speak = (text, options = {}) => {
    if (!isReady || !window.responsiveVoice || !text) return false;
    
    // אם כבר מדברים, נבטל קודם
    if (isSpeaking.current) {
      cancel();
      // נמתין תקופה קצרה לפני שנתחיל מחדש
      return new Promise(resolve => {
        setTimeout(() => {
          // נבדוק שוב שהביטול הושלם
          if (cancelRequested.current) {
            setTimeout(() => resolve(speak(text, options)), 50);
            return;
          }
          
          startSpeech(text, options, resolve);
        }, 100);
      });
    } else {
      return new Promise(resolve => {
        startSpeech(text, options, resolve);
      });
    }
  };

  // פונקציה פנימית להתחלת הדיבור
  const startSpeech = (text, options, resolvePromise) => {
    // סימון שמדברים כעת
    isSpeaking.current = true;
    cancelRequested.current = false;
    
    // עטיפה של האירועים של המשתמש
    const userOnstart = options.onstart;
    const userOnend = options.onend;
    const userOnerror = options.onerror;
    
    try {
      window.responsiveVoice.speak(text, "US English Male", {
        ...options,
        onstart: () => {
          if (userOnstart) userOnstart();
        },
        onend: () => {
          // סיום דיבור רגיל
          if (!cancelRequested.current) {
            isSpeaking.current = false;
            if (userOnend) userOnend();
          }
          resolvePromise(true);
        },
        onerror: (error) => {
          console.warn('ResponsiveVoice error:', error);
          isSpeaking.current = false;
          if (userOnerror) userOnerror(error);
          resolvePromise(false);
        }
      });
    } catch (e) {
      console.error('Exception in ResponsiveVoice:', e);
      isSpeaking.current = false;
      if (userOnerror) userOnerror(e);
      resolvePromise(false);
    }
  };

  // ניקוי כשהקומפוננטה מתפרקת
  useEffect(() => {
    return () => {
      if (window.responsiveVoice) {
        window.responsiveVoice.cancel();
      }
    };
  }, []);

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