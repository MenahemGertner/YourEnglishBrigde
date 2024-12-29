'use client'
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);

  // Load the best available English voice once when component mounts
  useEffect(() => {
    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      // Try to find a neural/enhanced voice first, otherwise use the first English voice
      const bestVoice = englishVoices.find(v => 
        v.name.includes('Enhanced') || v.name.includes('Neural')
      ) || englishVoices[0];
      
      setVoice(bestVoice);
    };

    // Chrome needs this event
    window.speechSynthesis.onvoiceschanged = loadVoice;
    loadVoice();
  }, []);

  const speak = async () => {
    // If already playing, stop current speech
    window.speechSynthesis.cancel();
    
    if (!text || !voice) return;

    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <button
      onClick={isPlaying ? stopSpeaking : speak}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 pt-1"
      title={isPlaying ? "Stop" : "Play"}
      disabled={!voice}
    >
      {isPlaying ? (
        <VolumeX className="h-4 w-4 text-gray-500" />
      ) : (
        <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />
      )}
    </button>
  );
};

export default AudioButton;