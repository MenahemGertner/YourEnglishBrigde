'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { getAudioCache } from '@/utils/audioCache';

const AudioButton = ({ text }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackState, setPlaybackState] = useState('normal');
  const [loadingDots, setLoadingDots] = useState('');
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  // קבלת instance של ה-Cache
  const audioCache = getAudioCache();
  
  // אנימציה לנקודות טעינה
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
    } else {
      setLoadingDots('');
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handlePlay = async () => {
    // שינוי מצב ההשמעה
    setPlaybackState((current) => {
      switch (current) {
        case 'normal': return 'slow';
        case 'slow': return 'mute';
        case 'mute': return 'normal';
        default: return 'normal';
      }
    });
    
    if (playbackState === 'mute') {
      stopCurrentAudio();
      setIsPlaying(false);
      return;
    }

    if (!text) return;

    stopCurrentAudio();

    try {
      setIsLoading(true);
      
      const speakingRate = playbackState === 'slow' ? 0.7 : 1.0;
      const cacheKey = `${text}-${speakingRate}`;
      
      // בדיקה בCache - Memory + Persistent
      console.log('Checking cache for:', cacheKey);
      const cachedItem = await audioCache.get(cacheKey);
      
      if (cachedItem) {
        console.log('Playing from cache:', cacheKey);
        
        const audio = new Audio(cachedItem.url);
        audioRef.current = audio;
        
        const currentPlaybackState = playbackState;
        
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
          
          if (currentPlaybackState === 'slow') {
            setPlaybackState('normal');
          }
        };
        audio.onerror = () => {
          setIsPlaying(false);
          audioRef.current = null;
        };
        
        setIsLoading(false);
        await audio.play();
        return;
      }
      
      console.log('Fetching from server:', cacheKey);
      
      // שימוש בAbortController עם timeout
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 10000); // 10 שניות מקסימום
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          languageCode: 'en-US',
          voiceName: 'en-US-Neural2-A',
          speakingRate
        }),
        signal: abortControllerRef.current.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      
      // שמירה בCache (Memory + Persistent)
      const cacheItem = await audioCache.set(cacheKey, audioBlob, { 
        speakingRate,
        textLength: text.length,
        voiceName: 'en-US-Neural2-A'
      });
      
      const audio = new Audio(cacheItem.url);
      audioRef.current = audio;
      
      // הגדרת preload לטעינה מהירה יותר
      audio.preload = 'auto';
      
      const currentPlaybackState = playbackState;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        
        if (currentPlaybackState === 'slow') {
          setPlaybackState('normal');
        }
      };
      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      
      // שימוש ב-promise כדי לחכות לטעינה
      audio.addEventListener('canplaythrough', () => {
        audio.play();
      });
      
      // טעינת האודיו
      audio.load();
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error playing audio:', error);
        
        // הצגת שגיאה ידידותית למשתמש
        if (error.message.includes('Server error')) {
          console.error('Server is currently unavailable');
        } else if (error.message.includes('Failed to fetch')) {
          console.error('Network connection problem');
        }
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const getIcon = () => {
    switch (playbackState) {
      case 'normal': return <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
      case 'slow': return <Volume1 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
      case 'mute': return <VolumeX className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
      default: return <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />;
    }
  };

  const getButtonTitle = async () => {
    // הצגת סטטיסטיקות בסביבת פיתוח
    const isDev = process.env.NODE_ENV === 'development';
    let cacheInfo = '';
    
    if (isDev) {
      try {
        const stats = await audioCache.getStats();
        cacheInfo = ` (Cache: ${stats.hitRate}% hit rate, ${stats.memory.items} items, ${stats.memory.sizeMB}MB)`;
      } catch (error) {
        cacheInfo = ' (Cache stats unavailable)';
      }
    }
    
    switch (playbackState) {
      case 'normal': return `Click for normal speed${cacheInfo}`;
      case 'slow': return `Click to slow down${cacheInfo}`;
      case 'mute': return `Click to mute${cacheInfo}`;
      default: return `Click for normal speed${cacheInfo}`;
    }
  };

  // שימוש ב-state עבור ה-title כדי לא לעשות async בתוך הרינדר
  const [buttonTitle, setButtonTitle] = useState('Click to play audio');
  
  useEffect(() => {
    getButtonTitle().then(setButtonTitle);
  }, [playbackState]);

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 transition-colors ${
        playbackState !== 'normal' ? 'bg-gray-100' : ''
      } ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
      title={isLoading ? `Loading audio${loadingDots}` : buttonTitle}
    >
      {isLoading ? (
        <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        getIcon()
      )}
    </button>
  );
};

export default AudioButton;