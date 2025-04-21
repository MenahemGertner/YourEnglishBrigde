'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);
  const [playbackState, setPlaybackState] = useState('normal');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // בדיקה אם ה-API נתמך
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      setIsSpeechSupported(false);
      return;
    }

    let isMounted = true;
    
    const loadVoices = () => {
      // ניסיון לטעון קולות מיד
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && isMounted) {
        console.log('Voices loaded:', voices.length);
        // נסה להשתמש בקול אנגלי, אחרת בקול ברירת המחדל
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && 
          (v.name.includes('Enhanced') || v.name.includes('Neural')));
        
        // אם לא נמצא קול מועדף, השתמש בקול ברירת מחדל או באחד הקולות הזמינים
        setVoice(preferredVoice || voices[0]);
      }
    };

    // טען קולות מיד (לדפדפנים כמו Firefox)
    loadVoices();

    // הקשב לאירוע מוכנות הקולות (לדפדפנים כמו Chrome)
    const voicesChangedHandler = () => {
      loadVoices();
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);

    // בדיקה תקופתית (פתרון חלופי למכשירים בעייתיים)
    const voiceCheckInterval = setInterval(() => {
      if (!voice && window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      }
    }, 500);

    return () => {
      isMounted = false;
      window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
      clearInterval(voiceCheckInterval);
      
      // נקה את הסינתיסייזר בעת עזיבת הקומפוננטה
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voice]);

  const speak = () => {
    if (!text || !isSpeechSupported) return;
    
    // קודם בטל כל דיבור פעיל
    window.speechSynthesis.cancel();
    
    // עדכן את מצב ההשמעה
    setPlaybackState(current => {
      const nextState = current === 'normal' ? 'slow' : 
                        current === 'slow' ? 'mute' : 'normal';
      
      // אם המצב הבא הוא השתקה, רק עדכן את המצב ואל תשמיע
      if (nextState === 'mute') {
        setIsPlaying(false);
        return nextState;
      }
      
      // אחרת, הכן השמעה חדשה
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        // הגדר קול אם יש
        if (voice) {
          utterance.voice = voice;
        }
        
        // הגדר מהירות לפי המצב החדש
        utterance.rate = nextState === 'slow' ? 0.6 : 1;
        utterance.pitch = 1;
        
        // טפל באירועים
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = (e) => {
          console.error('Speech synthesis error:', e);
          setIsPlaying(false);
        };
        
        // נסה להשמיע
        setIsPlaying(true);
        
        // פתרון עוקף לבעיית אנדרואיד - הוסף השהייה קצרה
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
          
          // פתרון עוקף לשמירה על פעילות במכשירי מובייל
          if (navigator.userAgent.match(/Android/i)) {
            const keepAlive = setInterval(() => {
              if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
              } else {
                clearInterval(keepAlive);
              }
            }, 10000); // בדוק כל 10 שניות
          }
        }, 100);
      } catch (error) {
        console.error('Speech synthesis failed:', error);
        setIsPlaying(false);
      }
      
      return nextState;
    });
  };

  const getIcon = () => {
    switch(playbackState) {
      case 'normal': return <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
      case 'slow': return <Volume1 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
      case 'mute': return <VolumeX className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
      default: return <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
    }
  };

  const getButtonTitle = () => {
    if (!isSpeechSupported) return 'Speech synthesis not supported';
    
    switch(playbackState) {
      case 'normal': return 'Click for normal speed';
      case 'slow': return 'Click to slow down';
      case 'mute': return 'Click to mute';
      default: return 'Click for normal speed';
    }
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
        playbackState !== 'normal' ? 'bg-gray-100' : ''
      }`}
      title={getButtonTitle()}
      disabled={!isSpeechSupported}
    >
      {getIcon()}
    </button>
  );
};

export default AudioButton;