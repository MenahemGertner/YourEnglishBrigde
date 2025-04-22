'use client'
import React, { useState, useEffect } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { useResponsiveVoice } from '@/app/providers/ResponsiveVoiceProvider';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackState, setPlaybackState] = useState('normal');
  const { isReady, speak, cancel } = useResponsiveVoice();

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (isPlaying) {
        cancel();
      }
    };
  }, [isPlaying, cancel]);

  const handleSpeechEnd = () => {
    setIsPlaying(false);
    // Only reset to normal speed if currently in slow mode
    if (playbackState === 'slow') {
      setPlaybackState('normal');
    }
  };

  const handleSpeak = () => {
  if (!text || !isReady) return;
  
  // Always cancel previous speech
  cancel();
  
  // Next state logic - keep this separate and immediate
  if (playbackState === 'normal') {
    // Calculate the rate based on current state - normal
    const options = {
      rate: 1,
      pitch: 1,
      onend: handleSpeechEnd,
      onerror: () => setIsPlaying(false)
    };
    
    // Only set playing if we're actually going to speak
    setIsPlaying(true);
    
    // Immediate function to ensure speak happens with right parameters
    (function(speakOptions) {
      // Small delay to ensure cancel completes
      setTimeout(() => {
        speak(text, speakOptions);
      }, 10);
    })(options);
    
    // Change state after setting up speech
    setPlaybackState('slow');
  }
  else if (playbackState === 'slow') {
    // Calculate the rate based on current state - slow
    const options = {
      rate: 0.6,
      pitch: 1,
      onend: handleSpeechEnd,
      onerror: () => setIsPlaying(false)
    };
    
    // Only set playing if we're actually going to speak
    setIsPlaying(true);
    
    // Immediate function to ensure speak happens with right parameters  
    (function(speakOptions) {
      // Small delay to ensure cancel completes
      setTimeout(() => {
        speak(text, speakOptions);
      }, 10);
    })(options);
    
    // Change state after setting up speech
    setPlaybackState('mute');
  }
  else {
    // We're in mute state, just change to normal
    setIsPlaying(false);
    setPlaybackState('normal');
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
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
        playbackState !== 'normal' ? 'bg-gray-100' : ''
      } ${!isReady ? 'opacity-50' : ''}`}
      title={getButtonTitle()}
      disabled={!isReady}
    >
      {getIcon()}
    </button>
  );
};

export default AudioButton;