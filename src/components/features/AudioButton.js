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
          const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
          const bestVoice = englishVoices.find(v => 
            v.name.includes('Enhanced') || v.name.includes('Neural')
          ) || englishVoices[0];
          
          setVoice(bestVoice);
          logMessage(`Selected voice: ${bestVoice?.name || 'None'}`);
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
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      logMessage("Speech synthesis not available");
    }
  }, []);

  // לא משתמשים במנגנון הרענון (גורם להפרעות באנדרואיד)
  // useEffect לריק במקום המנגנון הקודם
  useEffect(() => {
    // לא עושים רענון - מסירים את הרענון שהיה קודם
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

    window.speechSynthesis.cancel();
    
    // שומר על הלוגיקה המקורית של מצבי ההשמעה
    setPlaybackState(current => {
      switch(current) {
        case 'normal': return 'slow';
        case 'slow': return 'mute';
        case 'mute': return 'normal';
        default: return 'normal';
      }
    });
    
    // אם במצב השתק - לא מנגנים
    if (playbackState === 'mute') {
      logMessage("Mute state - not playing");
      setIsPlaying(false);
      return;
    }
    
    // נסה לקבל קול אם אין
    let currentVoice = voice;
    if (!currentVoice) {
      try {
        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        currentVoice = englishVoices.find(v => 
          v.name.includes('Enhanced') || v.name.includes('Neural')
        ) || englishVoices[0] || voices[0];
        
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
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (currentVoice) {
        utterance.voice = currentVoice;
      }
      
      utterance.rate = playbackState === 'slow' ? 0.6 : 1;
      utterance.pitch = 1;
      
      // טיפול שונה לאנדרואיד לעומת מכשירים אחרים
      if (isAndroidRef.current) {
        logMessage("Using Android approach");
        // במקום להשתמש באירוע onend, משתמשים בטיימר מבוסס-אורך-טקסט
        const estimatedDuration = (text.length / 5) * 1000; // משוער - 5 תווים לשנייה
        
        utterance.onend = null; // מבטל את האירוע המקורי
        utterance.onerror = (e) => {
          logMessage(`Android speech error: ${e.error}`);
          setIsPlaying(false);
        };
        
        // מגדיר טיימר שיסיים את הנגינה אחרי זמן משוער
        setTimeout(() => {
          if (isPlaying) {
            setIsPlaying(false);
            logMessage("Android estimated speech end");
            
            // עדכון חזרה למצב נורמלי אם היינו במצב איטי
            if (playbackState === 'slow') {
              setPlaybackState('normal');
            }
          }
        }, Math.max(2000, estimatedDuration));
      } else {
        // התנהגות רגילה למכשירים שאינם אנדרואיד
        utterance.onend = () => {
          logMessage("Speech ended");
          setIsPlaying(false);
          
          // עדכון חזרה למצב נורמלי אם היינו במצב איטי
          if (playbackState === 'slow') {
            setPlaybackState('normal');
          }
        };
        
        utterance.onerror = (e) => {
          logMessage(`Speech error: ${e.error}`);
          setIsPlaying(false);
        };
      }
      
      setIsPlaying(true);
      
      // השהיה קצרה לפני ההשמעה - עוזר במכשירי אנדרואיד
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
          logMessage("Speaking started");
        } catch (err) {
          logMessage(`Speak error: ${err.message}`);
          setIsPlaying(false);
        }
      }, 50);
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