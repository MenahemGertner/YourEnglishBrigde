'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PracticeLogic = ({ children }) => {
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
                    const reviewResponse = await fetch('/api/reviewManagement/endOfListReview');
                    if (!reviewResponse.ok) {
                        throw new Error('Failed to get review words');
                    }
                    
                    const reviewWords = await reviewResponse.json();
                    const remainingWords = reviewWords.filter(word => word.word_id !== parseInt(lastPosition));

                    if (remainingWords.length > 0) {
                        router.push(`/words?index=${remainingWords[0].word_id}&category=500&isEndOfList=true`);
                    } else {
                        router.push('/words');
                    }
                } else {
                    const nextResponse = await fetch(
                        `/api/wordNavigation?category=500&direction=next&index=${lastPosition}`
                    );
                    
                    if (!nextResponse.ok) {
                        throw new Error('Failed to get next word');
                    }
                    
                    const nextWord = await nextResponse.json();
                    if (!nextWord.completed) {
                        router.push(`/words?index=${nextWord.index}&category=500`);
                    } else {
                        const reviewResponse = await fetch('/api/reviewManagement/endOfListReview');
                        if (!reviewResponse.ok) {
                            throw new Error('Failed to get review words');
                        }
                        
                        const reviewWords = await reviewResponse.json();
                        const remainingWords = reviewWords.filter(word => word.word_id !== parseInt(lastPosition));

                        if (remainingWords.length > 0) {
                            router.push(`/words?index=${remainingWords[0].word_id}&category=500&isEndOfList=true`);
                        } else {
                            router.push('/words');
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

    return children({ handleReturn, handleComplete, showResult });
};

export default PracticeLogic;