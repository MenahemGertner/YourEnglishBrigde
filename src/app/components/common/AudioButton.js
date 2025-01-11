'use client'

import React, { useState, useEffect } from 'react';
import { Volume2, Volume1 } from 'lucide-react';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);
  const [isSlowSpeed, setIsSlowSpeed] = useState(false);
  
  useEffect(() => {
    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      const bestVoice = englishVoices.find(v => 
        v.name.includes('Enhanced') || v.name.includes('Neural')
      ) || englishVoices[0];
      
      setVoice(bestVoice);
    };

    window.speechSynthesis.onvoiceschanged = loadVoice;
    loadVoice();
  }, []);

  const speak = () => {
    if (!text || !voice) return;

    window.speechSynthesis.cancel();
    setIsSlowSpeed(!isSlowSpeed);
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = isSlowSpeed ? 0.6 : 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1 ${
        isSlowSpeed ? 'bg-gray-100' : ''
      }`}
      title={!isSlowSpeed ? 'Click to slow down' : 'Click for normal speed'}
      disabled={!voice}
    >
      {!isSlowSpeed ? (
        <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />
      ) : (
        <Volume1 className="h-4 w-4 text-gray-600 hover:text-gray-800" />
      )}
    </button>
  );
};

export default AudioButton;