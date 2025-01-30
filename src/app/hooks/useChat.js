// hooks/useChat.js
import { useState } from 'react';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // hooks/useChat.js
const sendMessage = async (message) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      return data.message;
    } catch (err) {
      console.error("Error in sendMessage:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
}