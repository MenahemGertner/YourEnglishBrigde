'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { useResponsiveVoice } from '@/app/providers/ResponsiveVoiceProvider';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackState, setPlaybackState] = useState('normal');
  const { isReady, speak, cancel } = useResponsiveVoice();
  const processingClick = useRef(false);

  // ניקוי בסיום
  useEffect(() => {
    return () => {
      if (isPlaying) {
        cancel();
      }
    };
  }, [isPlaying, cancel]);

  // טיפול בסיום הדיבור
  const handleSpeechEnd = () => {
    setIsPlaying(false);
    // רק אם במצב איטי, נאפס למצב רגיל
    if (playbackState === 'slow') {
      setPlaybackState('normal');
    }
  };

  // טיפול בלחיצה - עם הגנה מפני לחיצות כפולות
  const handleSpeak = async () => {
    if (!text || !isReady || processingClick.current) return;
    
    processingClick.current = true;
    
    try {
      // בודקים האם אנחנו במצב השתקה - אם כן, רק משנים מצב בלי להפעיל דיבור
      if (playbackState === 'mute') {
        setPlaybackState('normal');
        setIsPlaying(false);
        processingClick.current = false;
        return;
      }
      
      // אחרת, מבטלים דיבור נוכחי אם יש
      cancel();
      
      // מעדכנים את ה-UI למצב ניגון
      setIsPlaying(true);
      
      // קובעים את מהירות ההשמעה לפי המצב הנוכחי
      const rate = playbackState === 'normal' ? 1 : 0.6;
      
      // מפעילים את הדיבור
      await speak(text, {
        rate,
        pitch: 1,
        onend: handleSpeechEnd,
        onerror: () => {
          setIsPlaying(false);
        }
      });
      
      // מעדכנים את המצב הבא
      if (playbackState === 'normal') {
        setPlaybackState('slow');
      } else if (playbackState === 'slow') {
        setPlaybackState('mute');
      }
    } catch (error) {
      console.error('Speech error:', error);
      setIsPlaying(false);
    } finally {
      // תמיד מאפסים את הדגל בסוף הפעולה
      setTimeout(() => {
        processingClick.current = false;
      }, 300); // מניעת לחיצות כפולות למשך 300ms
    }
  };

  // הפונקציות לממשק המשתמש - ללא שינוי
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
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
        playbackState !== 'normal' ? 'bg-gray-100' : ''
      } ${!isReady || processingClick.current ? 'opacity-50' : ''}`}
      title={getButtonTitle()}
      disabled={!isReady || processingClick.current}
    >
      {getIcon()}
    </button>
  );
};

export default AudioButton;