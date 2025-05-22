'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const GoogleTtsPlayer = ({ text }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackState, setPlaybackState] = useState('normal');
  const [loadingDots, setLoadingDots] = useState('');
  const audioRef = useRef(null);
  
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
    };
  }, []);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const handlePlay = async () => {
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
      
      // שימוש בAbortController לביטול בקשות עם timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 שניות מקסימום
      
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
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to get audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // הגדרת preload לטעינה מהירה יותר
      audio.preload = 'auto';
      
      const currentPlaybackState = playbackState;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
        
        if (currentPlaybackState === 'slow') {
          setPlaybackState('normal');
        }
      };
      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
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
      }
    } finally {
      setIsLoading(false);
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

  const getButtonTitle = () => {
    switch (playbackState) {
      case 'normal': return 'Click for normal speed';
      case 'slow': return 'Click to slow down';
      case 'mute': return 'Click to mute';
      default: return 'Click for normal speed';
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 transition-colors ${
        playbackState !== 'normal' ? 'bg-gray-100' : ''
      } ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
      title={isLoading ? `Loading audio${loadingDots}` : getButtonTitle()}
    >
      {isLoading ? (
        <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        getIcon()
      )}
    </button>
  );
};

export default GoogleTtsPlayer;