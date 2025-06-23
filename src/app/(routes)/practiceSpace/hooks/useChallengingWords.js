'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getChallengingWords } from '../actions/getChallengingWords';

export const useChallengingWords = () => {
  const { data: session, status } = useSession();
  const [userWords, setUserWords] = useState([]);
  const [wordInflections, setWordInflections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      setUserWords([]);
      setWordInflections([]);
      setIsLoading(false);
      return;
    }

    const fetchUserWords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getChallengingWords();

        const allWords = [...result.level2, ...result.level3, ...result.level4];

        const baseWords = [];
        const inflections = [];
                
        allWords.forEach(({ word, inf }) => {
          if (word) baseWords.push(word);
          if (Array.isArray(inf)) inflections.push(...inf);
        });

        const uniqueWords = [...new Set(baseWords)];
        const uniqueInflections = [...new Set(inflections)];
                
        setUserWords(uniqueWords);
        setWordInflections(uniqueInflections);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserWords();
  }, [session, status]);

  return {
    userWords,
    wordInflections,
    allWords: [...userWords, ...wordInflections], // לנוחות - כל המילים יחד כמערך של strings
    isLoading,
    error,
    refetch: () => {
      setError(null);
      if (session?.user?.id) getChallengingWords();
    }
  };
};