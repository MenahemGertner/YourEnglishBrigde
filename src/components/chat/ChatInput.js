// components/ChatInput.js
'use client'
import { useState } from 'react';
import { useChat } from '@/app/hooks/useChat';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const { sendMessage, isLoading, error } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const result = await sendMessage(input);
    if (result) {
      setResponse(result);
    }
    setInput('');
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="שאל את AI..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? 'שולח...' : 'שלח'}
        </button>
      </form>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          {response}
        </div>
      )}
    </div>
  );
}