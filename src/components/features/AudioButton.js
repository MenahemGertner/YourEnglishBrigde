'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);
  const [playbackState, setPlaybackState] = useState('normal');
  // מערך לוגים שיוצג בעמוד
  const [logs, setLogs] = useState([]);
  // מידע על API נתמך
  const [apiInfo, setApiInfo] = useState({
    speechSynthesisSupported: false,
    voicesAvailable: 0,
    userAgent: '',
    platform: ''
  });

  // פונקציית עזר להוספת לוג
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [
      { message, timestamp, type }, 
      ...prevLogs.slice(0, 19)  // שמור רק 20 לוגים אחרונים
    ]);
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  };

  // בדיקת תמיכה ב-API
  useEffect(() => {
    const checkSpeechSupport = () => {
      const isSpeechSupported = 'speechSynthesis' in window;
      
      setApiInfo({
        speechSynthesisSupported: isSpeechSupported,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        voicesAvailable: isSpeechSupported ? window.speechSynthesis.getVoices().length : 0
      });

      if (!isSpeechSupported) {
        addLog('Speech synthesis API is not supported in this browser!', 'error');
      } else {
        addLog('Speech synthesis API is supported', 'success');
      }
    };

    checkSpeechSupport();
  }, []);

  // טעינת קולות ובדיקת מצב
  useEffect(() => {
    if (!apiInfo.speechSynthesisSupported) return;

    let isMounted = true;
    
    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0 && isMounted) {
        addLog(`Loaded ${voices.length} voices`, 'info');
        
        // חפש קולות באנגלית
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        addLog(`Found ${englishVoices.length} English voices`, 'info');
        
        // חפש את הקול הטוב ביותר
        const bestVoice = englishVoices.find(v => 
          v.name.includes('Enhanced') || v.name.includes('Neural')
        ) || englishVoices[0];
        
        if (bestVoice) {
          setVoice(bestVoice);
          addLog(`Selected voice: ${bestVoice.name} (${bestVoice.lang})`, 'success');
        } else if (voices.length > 0) {
          setVoice(voices[0]);
          addLog(`No English voice found, using default: ${voices[0].name}`, 'warning');
        } else {
          addLog('No voices available despite API being supported', 'error');
        }
        
        // הדפס פרטים על כל הקולות
        addLog(`Available voices: ${voices.map(v => v.name).join(', ')}`, 'debug');
      } else {
        addLog('No voices available yet, waiting...', 'warning');
      }
    };

    loadVoice();

    // הוסף מאזין לאירוע שינוי קולות
    const voicesChangedHandler = () => {
      addLog('Voices changed event triggered', 'info');
      loadVoice();
      
      // עדכן את מספר הקולות הזמינים
      setApiInfo(prev => ({
        ...prev,
        voicesAvailable: window.speechSynthesis.getVoices().length
      }));
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
    
    // בדיקה תקופתית לקולות (עבור דפדפנים שלא מפעילים את האירוע)
    const checkInterval = setInterval(() => {
      const currentVoices = window.speechSynthesis.getVoices().length;
      if (currentVoices > 0 && currentVoices !== apiInfo.voicesAvailable) {
        addLog(`Voices detected outside event: ${currentVoices}`, 'info');
        loadVoice();
        setApiInfo(prev => ({ ...prev, voicesAvailable: currentVoices }));
      }
    }, 1000);

    return () => {
      isMounted = false;
      window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
      clearInterval(checkInterval);
      
      // נקה את התור בעת עזיבת הקומפוננטה
      if (apiInfo.speechSynthesisSupported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        addLog('Cleaned up speech synthesis on unmount', 'info');
      }
    };
  }, [apiInfo.speechSynthesisSupported]);

  const speak = () => {
    if (!text || !apiInfo.speechSynthesisSupported) {
      addLog('Cannot speak: no text or API not supported', 'error');
      return;
    }

    window.speechSynthesis.cancel();
    addLog('Canceled any ongoing speech', 'info');

    // עדכן את מצב ההשמעה
    setPlaybackState(current => {
      let nextState;
      
      switch(current) {
        case 'normal': nextState = 'slow'; break;
        case 'slow': nextState = 'mute'; break;
        case 'mute': nextState = 'normal'; break;
        default: nextState = 'normal';
      }
      
      addLog(`Switching playback state: ${current} -> ${nextState}`, 'info');
      
      if (nextState === 'mute') {
        setIsPlaying(false);
        addLog('Muted - not playing audio', 'info');
        return nextState;
      }
      
      try {
        // יצירת אובייקט השמעה חדש
        const utterance = new SpeechSynthesisUtterance(text);
        
        // הגדרת קול אם זמין
        if (voice) {
          utterance.voice = voice;
          addLog(`Using voice: ${voice.name}`, 'info');
        } else {
          addLog('No voice selected, using browser default', 'warning');
        }
        
        // הגדרת מהירות ההשמעה
        utterance.rate = nextState === 'slow' ? 0.6 : 1;
        utterance.pitch = 1;
        addLog(`Speech rate set to: ${utterance.rate}`, 'info');
        
        // טיפול באירועים
        utterance.onstart = () => {
          addLog('Speech started', 'success');
        };
        
        utterance.onend = () => {
          addLog('Speech ended normally', 'success');
          setIsPlaying(false);
        };
        
        utterance.onerror = (event) => {
          addLog(`Speech error: ${event.error}`, 'error');
          setIsPlaying(false);
        };
        
        utterance.onpause = () => addLog('Speech paused', 'info');
        utterance.onresume = () => addLog('Speech resumed', 'info');
        utterance.onboundary = (event) => addLog(`Speech boundary at ${event.charIndex}`, 'debug');
        
        // ניסיון להשמיע
        addLog('Attempting to speak...', 'info');
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        
        // בדוק האם התחיל לדבר
        setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            addLog('Confirmed speech is active', 'success');
          } else {
            addLog('Speech didn\'t start despite no error', 'warning');
          }
        }, 500);
        
        // פתרון עוקף לבעיות דפדפני אנדרואיד - חדש דיבור כל 10 שניות
        if (/Android/i.test(navigator.userAgent)) {
          addLog('Android device detected, applying workaround', 'info');
          
          const keepAliveInterval = setInterval(() => {
            if (window.speechSynthesis.speaking) {
              addLog('Applying Android keep-alive fix', 'debug');
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            } else {
              clearInterval(keepAliveInterval);
            }
          }, 10000);
        }
      } catch (error) {
        addLog(`Exception during speech attempt: ${error.message}`, 'error');
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
    switch(playbackState) {
      case 'normal': return 'Click for normal speed';
      case 'slow': return 'Click to slow down';
      case 'mute': return 'Click to mute';
      default: return 'Click for normal speed';
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs cleared', 'info');
  };

  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={speak}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
            playbackState !== 'normal' ? 'bg-gray-100' : ''
          }`}
          title={getButtonTitle()}
          disabled={!apiInfo.speechSynthesisSupported}
        >
          {getIcon()}
        </button>
        {isPlaying && <span className="ml-2 text-sm text-green-600">Playing...</span>}
      </div>
      
      {/* חלק עם פרטי API - יוצג תמיד */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm">
        <h3 className="font-bold mb-2">Speech API Status:</h3>
        <ul>
          <li><span className="font-semibold">API Supported:</span> {apiInfo.speechSynthesisSupported ? '✅ Yes' : '❌ No'}</li>
          <li><span className="font-semibold">Voices Available:</span> {apiInfo.voicesAvailable}</li>
          <li><span className="font-semibold">Selected Voice:</span> {voice ? `${voice.name} (${voice.lang})` : 'None'}</li>
          <li><span className="font-semibold">User Agent:</span> {apiInfo.userAgent}</li>
          <li><span className="font-semibold">Platform:</span> {apiInfo.platform}</li>
        </ul>
      </div>
      
      {/* אזור לוגים עם אפשרות ניקוי */}
      <div className="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-60 overflow-y-auto text-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Debug Logs:</h3>
          <button 
            onClick={clearLogs}
            className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
          >
            Clear Logs
          </button>
        </div>
        
        {logs.length === 0 ? (
          <p className="text-gray-500 italic">No logs yet...</p>
        ) : (
          <ul className="space-y-1">
            {logs.map((log, index) => (
              <li 
                key={index} 
                className={`py-1 border-b border-gray-100 ${
                  log.type === 'error' ? 'text-red-600' : 
                  log.type === 'warning' ? 'text-orange-600' : 
                  log.type === 'success' ? 'text-green-600' : 
                  log.type === 'debug' ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                <span className="text-xs text-gray-500">{log.timestamp}</span>: {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AudioButton;