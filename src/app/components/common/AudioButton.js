'use client'
import React, { useState, useEffect } from 'react';
import { Volume2, Volume1 } from 'lucide-react';

const AudioButton = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);
  const [isSlowSpeed, setIsSlowSpeed] = useState(false);

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

    // נסיון ראשון לטעינת הקולות
    loadVoice();

    // הגדרת מאזין לשינויים בקולות
    const voicesChangedHandler = () => {
      loadVoice();
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);

    // ניקוי
    return () => {
      isMounted = false;
      window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
    };
  }, []);

  const speak = () => {
    if (!text) return;

    // נסה לטעון את הקולות שוב אם הם לא נטענו
    if (!voice) {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      const bestVoice = englishVoices.find(v => 
        v.name.includes('Enhanced') || v.name.includes('Neural')
      ) || englishVoices[0];
    }

    window.speechSynthesis.cancel();
    setIsSlowSpeed(!isSlowSpeed);
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
    }
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
      title={!isSlowSpeed ? 'Click for normal speed' : 'Click to slow down'}
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