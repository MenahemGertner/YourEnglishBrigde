// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Volume2, Volume1, VolumeX } from 'lucide-react';

// const AudioButton = ({ text }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [voice, setVoice] = useState(null);
//   const [playbackState, setPlaybackState] = useState('normal');

//   useEffect(() => {
//     let isMounted = true;

//     const loadVoice = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (voices.length > 0 && isMounted) {
//         const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
//         const bestVoice = englishVoices.find(v => 
//           v.name.includes('Enhanced') || v.name.includes('Neural')
//         ) || englishVoices[0];

//         setVoice(bestVoice);
//       }
//     };

//     loadVoice();

//     const voicesChangedHandler = () => {
//       loadVoice();
//     };

//     window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);

//     return () => {
//       isMounted = false;
//       window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
//     };
//   }, []);

//   const speak = () => {
//     if (!text) return;

//     if (!voice) {
//       const voices = window.speechSynthesis.getVoices();
//       const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
//       const bestVoice = englishVoices.find(v => 
//         v.name.includes('Enhanced') || v.name.includes('Neural')
//       ) || englishVoices[0];
//     }

//     window.speechSynthesis.cancel();

//     setPlaybackState(current => {
//       switch(current) {
//         case 'normal': return 'slow';
//         case 'slow': return 'mute';
//         case 'mute': return 'normal';
//         default: return 'normal';
//       }
//     });

//     if (playbackState === 'mute') {
//       setIsPlaying(false);
//       return;
//     }

//     setIsPlaying(true);

//     const utterance = new SpeechSynthesisUtterance(text);
//     if (voice) {
//       utterance.voice = voice;
//     }
//     utterance.rate = playbackState === 'slow' ? 0.6 : 1;
//     utterance.pitch = 1;

//     utterance.onend = () => {
//       setIsPlaying(false);
//       // Only reset to normal speed if currently in slow mode
//       if (playbackState === 'slow') {
//         setPlaybackState('normal');
//       }
//     };

//     utterance.onerror = () => {
//       setIsPlaying(false);
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   const getIcon = () => {
//     switch(playbackState) {
//       case 'normal': return <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
//       case 'slow': return <Volume1 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
//       case 'mute': return <VolumeX className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
//       default: return <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
//     }
//   };

//   const getButtonTitle = () => {
//     switch(playbackState) {
//       case 'normal': return 'Click for normal speed';
//       case 'slow': return 'Click to slow down';
//       case 'mute': return 'Click to mute';
//       default: return 'Click for normal speed';
//     }
//   };

//   return (
//     <button
//       onClick={speak}
//       className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
//         playbackState !== 'normal' ? 'bg-gray-100' : ''
//       }`}
//       title={getButtonTitle()}
//     >
//       {getIcon()}
//     </button>
//   );
// };

// export default AudioButton;

'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);
  const [playbackState, setPlaybackState] = useState('normal');
  const [debugLog, setDebugLog] = useState([]);
  const utteranceRef = useRef(null);
  const isAndroidRef = useRef(false);

  const logMessage = (msg) => {
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`].slice(-5));
  };

  useEffect(() => {
    // בדוק אם זה אנדרואיד
    const userAgent = navigator.userAgent.toLowerCase();
    isAndroidRef.current = userAgent.includes('android');
    logMessage(`Platform: ${isAndroidRef.current ? 'Android' : 'Other'}`);

    let isMounted = true;
    
    const loadVoice = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        logMessage(`Voices loaded: ${voices.length}`);
        
        if (voices.length > 0 && isMounted) {
          // אם זה אנדרואיד, ננסה למצוא קול מקומי
          if (isAndroidRef.current) {
            // ננסה למצוא קול מקומי או ברירת מחדל
            const localVoice = voices.find(v => !v.localService === false) || voices[0];
            setVoice(localVoice);
            logMessage(`Android voice: ${localVoice?.name || 'None'}`);
          } else {
            // אם לא אנדרואיד, נמשיך עם הלוגיקה הקודמת
            const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
            const bestVoice = englishVoices.find(v => 
              v.name.includes('Enhanced') || v.name.includes('Neural')
            ) || englishVoices[0];
            
            setVoice(bestVoice);
            logMessage(`Selected voice: ${bestVoice?.name || 'None'}`);
          }
        }
      } catch (err) {
        logMessage(`Error loading voices: ${err.message}`);
      }
    };

    if (window.speechSynthesis) {
      loadVoice();
      
      const voicesChangedHandler = () => {
        logMessage("Voices changed event");
        loadVoice();
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
      
      return () => {
        isMounted = false;
        window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        
        // נקה כל פעילות סינתזה כשהקומפוננטה מתפרקת
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      logMessage("Speech synthesis not available");
    }
  }, []);

  // לא צריך את הרענון באנדרואיד, הוא גורם לבעיה
  useEffect(() => {
    let intervalId;
    
    if (isPlaying && window.speechSynthesis && !isAndroidRef.current) {
      intervalId = setInterval(() => {
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
          logMessage("Refreshing speech synthesis");
        } catch (err) {
          logMessage(`Refresh error: ${err.message}`);
        }
      }, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);

  const speak = () => {
    logMessage("Button clicked");
    
    if (!text) {
      logMessage("No text to speak");
      return;
    }
    
    if (!window.speechSynthesis) {
      logMessage("Speech synthesis not available");
      return;
    }

    // נקה כל דיבור נוכחי
    window.speechSynthesis.cancel();
    
    // מעדכן את מצב הניגון לפי הלוגיקה הקיימת
    setPlaybackState(current => {
      switch(current) {
        case 'normal': return 'slow';
        case 'slow': return 'mute';
        case 'mute': return 'normal';
        default: return 'normal';
      }
    });
    
    // אם הוא במצב השתקה, פשוט צא
    if (playbackState === 'mute') {
      logMessage("Mute state - not playing");
      setIsPlaying(false);
      return;
    }
    
    // נסה להשתמש בקול הקיים או למצוא חדש
    let currentVoice = voice;
    if (!currentVoice) {
      try {
        const voices = window.speechSynthesis.getVoices();
        
        if (isAndroidRef.current) {
          // באנדרואיד ננסה למצוא קול מקומי
          currentVoice = voices.find(v => !v.localService === false) || voices[0];
        } else {
          const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
          currentVoice = englishVoices.find(v => 
            v.name.includes('Enhanced') || v.name.includes('Neural')
          ) || englishVoices[0] || voices[0];
        }
        
        if (currentVoice) {
          setVoice(currentVoice);
          logMessage(`Using voice: ${currentVoice.name}`);
        } else {
          logMessage("No voice available");
        }
      } catch (err) {
        logMessage(`Error selecting voice: ${err.message}`);
      }
    }

    try {
      // אם אנדרואיד, נשתמש בגישה קצת שונה
      if (isAndroidRef.current) {
        logMessage("Using Android-specific approach");
        
        // ניצור אובייקט חדש כל פעם
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        if (currentVoice) {
          utterance.voice = currentVoice;
        }
        
        utterance.rate = playbackState === 'slow' ? 0.6 : 1;
        utterance.pitch = 1;
        utterance.volume = 1.0;
        
        // לא נשתמש בתכונת onend באנדרואיד (גורמת לבעיות)
        utterance.onend = null;
        
        utterance.onerror = (e) => {
          logMessage(`Speech error: ${e.error}`);
          setIsPlaying(false);
        };
        
        setIsPlaying(true);
        
        // מריץ בגוש קוד נפרד כדי לא להיתקע בפעולות אסינכרוניות
        setTimeout(() => {
          try {
            window.speechSynthesis.cancel(); // נקה קודם
            window.speechSynthesis.speak(utterance);
            logMessage("Android speaking started");
            
            // יוצר טיימר כדי לסיים ידנית את הניגון אחרי זמן משוער
            // מבוסס על אורך הטקסט (הערכה גסה - 5 תווים לשנייה)
            const estimatedDuration = (text.length / 5) * 1000;
            setTimeout(() => {
              if (isPlaying) {
                setIsPlaying(false);
                logMessage("Estimated speech end time reached");
              }
            }, Math.max(2000, estimatedDuration));
          } catch (err) {
            logMessage(`Android speak error: ${err.message}`);
            setIsPlaying(false);
          }
        }, 100);
      } 
      // גישה רגילה למכשירים שאינם אנדרואיד
      else {
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        if (currentVoice) {
          utterance.voice = currentVoice;
        }
        
        utterance.rate = playbackState === 'slow' ? 0.6 : 1;
        utterance.pitch = 1;
        utterance.volume = 1.0;
        
        utterance.onend = () => {
          logMessage("Speech ended");
          setIsPlaying(false);
          
          // רק חוזר למהירות רגילה אם היינו במצב איטי
          if (playbackState === 'slow') {
            setPlaybackState('normal');
          }
        };
        
        utterance.onerror = (e) => {
          logMessage(`Speech error: ${e.error}`);
          setIsPlaying(false);
        };
        
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
        logMessage("Speaking started");
      }
    } catch (err) {
      logMessage(`Utterance error: ${err.message}`);
      setIsPlaying(false);
    }
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
    switch(playbackState) {
      case 'normal': return 'Click for normal speed';
      case 'slow': return 'Click to slow down';
      case 'mute': return 'Click to mute';
      default: return 'Click for normal speed';
    }
  };

  return (
    <>
      <button 
        onClick={speak} 
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
          playbackState !== 'normal' ? 'bg-gray-100' : ''
        }`} 
        title={getButtonTitle()}
      >
        {getIcon()}
      </button>
      
      {/* Debug panel - can be removed in production */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs" style={{zIndex: 9999}}>
        {debugLog.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </>
  );
};

export default AudioButton;