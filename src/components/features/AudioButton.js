'use client'
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

const DebugTtsPlayer = ({ text }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePlay = async () => {
    if (!text) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      console.log('Starting TTS request for:', text);
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Response error:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!contentType || !contentType.includes('audio')) {
        const textResponse = await response.text();
        console.error('Unexpected response:', textResponse);
        throw new Error('Response is not audio');
      }

      const audioBlob = await response.blob();
      console.log('Audio blob size:', audioBlob.size);
      
      if (audioBlob.size === 0) {
        throw new Error('Empty audio file');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.oncanplaythrough = () => {
        console.log('Audio can play through');
        audio.play();
      };
      
      audio.onplay = () => {
        console.log('Audio started playing');
        setSuccess(true);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Audio playback failed');
      };
      
      audio.onended = () => {
        console.log('Audio finished');
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.load();
      
    } catch (error) {
      console.error('TTS Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start">
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        {isLoading ? (
          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Volume2 className="h-4 w-4 text-gray-600 hover:text-gray-800" />
        )}
      </button>
      
      {/* Debug info */}
      {error && (
        <div className="text-xs text-red-600 mt-1 max-w-xs">
          Error: {error}
        </div>
      )}
      
      {success && (
        <div className="text-xs text-green-600 mt-1">
          ✓ Playing
        </div>
      )}
    </div>
  );
};

export default DebugTtsPlayer;