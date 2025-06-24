// components/WordsProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const WordsContext = createContext();

export const useWords = () => {
    const context = useContext(WordsContext);
    if (!context) {
        throw new Error('useWords must be used within WordsProvider');
    }
    return context;
};

const WordsProvider = ({ children }) => {
    const [wordsData, setWordsData] = useState({
        words: [], // המילים הבסיסיות
        inflections: [], // ההטיות
        challengingWords: { // מילים מקובצות לפי רמה - עבור ChallengingWords
            level2: [],
            level3: [],
            level4: []
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllWords = async () => {
            try {
                // קריאה אחת שמביאה הכל מעובד ומוכן
                const response = await fetch('/practiceSpace/api/allWords');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch words');
                }
                
                const data = await response.json();
                setWordsData({
                    words: data.words || [], // המילים הבסיסיות
                    inflections: data.inflections || [], // ההטיות
                    challengingWords: data.challengingWords
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllWords();
    }, []);

    const value = {
        wordsData,
        isLoading,
        error
    };

    return (
        <WordsContext.Provider value={value}>
            {children}
        </WordsContext.Provider>
    );
};

export default WordsProvider;