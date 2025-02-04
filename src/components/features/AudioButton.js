'use client'
import React, { useState, useEffect } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);
  const [playbackState, setPlaybackState] = useState('normal');

  useEffect(() => {
    let isMounted = true;

    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && isMounted) {
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        const bestVoice = englishVoices.find(v => 
          v.name.includes('Enhanced') || v.name.includes('Neural')
        ) || englishVoices[0];

        setVoice(bestVoice);
      }
    };

    loadVoice();

    const voicesChangedHandler = () => {
      loadVoice();
    };

    window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);

    return () => {
      isMounted = false;
      window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
    };
  }, []);

  const speak = () => {
    if (!text) return;

    if (!voice) {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      const bestVoice = englishVoices.find(v => 
        v.name.includes('Enhanced') || v.name.includes('Neural')
      ) || englishVoices[0];
    }

    window.speechSynthesis.cancel();

    setPlaybackState(current => {
      switch(current) {
        case 'normal': return 'slow';
        case 'slow': return 'mute';
        case 'mute': return 'normal';
        default: return 'normal';
      }
    });

    if (playbackState === 'mute') {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = playbackState === 'slow' ? 0.6 : 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
      // Only reset to normal speed if currently in slow mode
      if (playbackState === 'slow') {
        setPlaybackState('normal');
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
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
      onClick={speak}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
        playbackState !== 'normal' ? 'bg-gray-100' : ''
      }`}
      title={getButtonTitle()}
    >
      {getIcon()}
    </button>
  );
};

export default AudioButton;