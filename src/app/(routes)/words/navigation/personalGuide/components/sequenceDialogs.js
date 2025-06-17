'use client';

import React, { useEffect } from 'react';

export function ResetDialog({ isOpen, onClose, onConfirm, error }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Enter') {
        onConfirm();
      } else if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-right">איפוס הרשימה ומעבר לתחילת הרשימה הנוכחית!</h2>
        <p className="text-gray-600 mb-6 text-right">
          פעולה זו תמחק את כל המילים שנשמרו לך, ואת הקצב האישי שלך! האם ברצונך להמשיך?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors duration-200"
          >
            ביטול
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white transition-colors duration-200"
          >
            המשך
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-right">{error}</p>}
      </div>
    </div>
  );
}

export function PositionDialog({ isOpen, onClose, onSubmit, position, setPosition, error }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Enter' && position && parseInt(position) >= 1 && parseInt(position) <= 1500) {
        onSubmit();
      } else if (isOpen && e.key === 'Escape') {
        onClose();
        setPosition('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSubmit, onClose, position, setPosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-right">בחר מיקום ברשימה</h2>
        <p className="text-gray-600 mb-4 text-right">
          עליך לבחור את המיקום ברשימה שאליו תרצה לנווט! <br/> (המעבר לא יפגע במילים שכבר דרגת) <br/>*יש לבחור מיקום בין 1 - 1500
        </p>
        <input
          type="number"
          min="1"
          max="1500"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-6 text-right"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              onClose();
              setPosition('');
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors duration-200"
          >
            ביטול
          </button>
          <button
            onClick={onSubmit}
            disabled={!position || parseInt(position) < 1 || parseInt(position) > 1500}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            המשך
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-right">{error}</p>}
      </div>
    </div>
  );
}