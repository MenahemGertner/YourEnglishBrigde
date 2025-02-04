'use client';
import React, { useState, useEffect } from 'react';
import { Volume2} from 'lucide-react';

const SequentialAudioButton = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      const bestVoice = englishVoices.find(v => 
        v.name.includes('Enhanced') || v.name.includes('Neural')
      ) || englishVoices[0];
      
      setVoice(bestVoice);
    };

    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoice;
      loadVoice();
    }
  }, []);

  const speak = async () => {
    if (!voice || !words.length) return;

    setIsPlaying(true);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(words[currentIndex]);
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
      // עובר למילה הבאה, או חוזר להתחלה אם הגענו לסוף
      setCurrentIndex((prev) => (prev + 1) % words.length);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="text-center flex items-center gap-2 justify-center">
        
      <p>
        {words.map((word, index) => (
          <span 
            key={index}
            className={currentIndex === index ? 'text-blue-900 font-medium' : ''}
          >
            {word}
            {index < words.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      <button
        onClick={speak}
        disabled={isPlaying}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
        title={`Play "${words[currentIndex]}"`}
      >
        <Volume2 className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};

const Inflections = ({ inf}) => {
  return <SequentialAudioButton words={inf} />;
};

export default Inflections;