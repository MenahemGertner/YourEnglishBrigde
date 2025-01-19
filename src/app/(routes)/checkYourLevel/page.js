'use client'
import React, { useState } from 'react';
import Link from 'next/link';

const CheckYourLevel = () => {
    const [showResult, setShowResult] = useState(false);
    
    const handleCheck = () => {
        setShowResult(true);
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-3xl font-bold mb-8">בדוק את רמת האנגלית שלך</h1>
            
            {!showResult ? (
                <button 
                    onClick={handleCheck}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
                >
                    התחל בבדיקה
                </button>
            ) : (
                <div className="space-y-4">
                    <p className="text-xl mb-24">הרמה שלך היא רמה 1</p>
                    <Link 
                        href="/startLearn?level=1"
                        className="text-blue-500 hover:text-blue-600 underline text-lg"
                    >
                        להתחיל בלימוד
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CheckYourLevel;