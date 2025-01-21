'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const PracticeSpace = () => {
    const router = useRouter();
    const [showResult, setShowResult] = useState(false);

    const handleComplete = () => {
        setShowResult(true);
    };

    const handleReturn = async () => {
        const lastPosition = localStorage.getItem('lastPosition');
        const isEndOfList = localStorage.getItem('isEndOfList') === 'true';

        if (lastPosition) {
            try {
                if (isEndOfList) {
                    const reviewResponse = await fetch('/api/nextAndPrevious/endOfListReview');
                    if (!reviewResponse.ok) {
                        throw new Error('Failed to get review words');
                    }
                    
                    const reviewWords = await reviewResponse.json();
                    const remainingWords = reviewWords.filter(word => word.word_id !== parseInt(lastPosition));

                    if (remainingWords.length > 0) {
                        router.push(`/words?index=${remainingWords[0].word_id}&category=500&isEndOfList=true`);
                    } else {
                        router.push('/words'); // אם אין יותר מילים לחזרה
                    }
                } else {
                    // במצב רגיל - קבלת המילה הבאה
                    const nextResponse = await fetch(
                        `/api/nextAndPrevious?category=500&direction=next&index=${lastPosition}`
                    );
                    
                    if (!nextResponse.ok) {
                        throw new Error('Failed to get next word');
                    }
                    
                    const nextWord = await nextResponse.json();
                    if (!nextWord.completed) {
                        router.push(`/words?index=${nextWord.index}&category=500`);
                    } else {
                        // אם אין מילה הבאה, נבדוק אם יש מילים לחזרה
                        const reviewResponse = await fetch('/api/nextAndPrevious/endOfListReview');
                        if (!reviewResponse.ok) {
                            throw new Error('Failed to get review words');
                        }
                        
                        const reviewWords = await reviewResponse.json();
                        const remainingWords = reviewWords.filter(word => word.word_id !== parseInt(lastPosition));

                        if (remainingWords.length > 0) {
                            router.push(`/words?index=${remainingWords[0].word_id}&category=500&isEndOfList=true`);
                        } else {
                            router.push('/words'); // אם אין יותר מילים לחזרה
                        }
                    }
                }
            } catch (error) {
                console.error('Navigation error:', error);
                router.push('/words');
            }
            
            localStorage.removeItem('lastPosition');
            localStorage.removeItem('isEndOfList');
        } else {
            router.push('/words');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-3xl font-bold mb-8">תרגול והטמעה בכל רבדי השפה!</h1>
            
            {!showResult ? (
                <button
                    onClick={handleComplete}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
                >
                    התחל תרגול
                </button>
            ) : (
                <button
                    onClick={handleReturn}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
                >
                    חזור למילים
                </button>
            )}
        </div>
    );
};

export default PracticeSpace;