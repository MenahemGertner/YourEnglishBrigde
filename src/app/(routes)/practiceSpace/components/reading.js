'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioButton from '@/components/features/AudioButton';
import Tooltip from '@/components/features/Tooltip';
import underLine from '@/components/features/UnderLine';
import ReadingComprehension from './readingComprehension';
import { BookOpen, Info, RefreshCw, Wand2, CheckCircle } from 'lucide-react';
import { generateStoryFromWords } from '../services/generateStory';

const Reading = ({ words, inflections }) => {
    
    const [activeIndex, setActiveIndex] = useState(null);
    const [sentences, setSentences] = useState([]);
    const [isGeneratingStory, setIsGeneratingStory] = useState(false);
    const [storyError, setStoryError] = useState(null);
    const [hasGeneratedStory, setHasGeneratedStory] = useState(false);
    const [showComprehension, setShowComprehension] = useState(false);
    
    // New states for question pre-generation
    const [preGeneratedQuestion, setPreGeneratedQuestion] = useState(null);
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [questionError, setQuestionError] = useState(null);

    // Generate story when component mounts
    useEffect(() => {
        if (!hasGeneratedStory && words?.length > 0) {
            generateNewStory();
        }
    }, [hasGeneratedStory, words]);

    // Generate question when story is ready
    useEffect(() => {
        if (sentences.length > 0 && !preGeneratedQuestion && !isGeneratingQuestion) {
            generateQuestionInBackground();
        }
    }, [sentences, preGeneratedQuestion, isGeneratingQuestion]);

    const generateNewStory = async () => {
        if (!words || words.length === 0) {
            console.warn('No words available for story generation');
            return;
        }

        setIsGeneratingStory(true);
        setStoryError(null);
        setShowComprehension(false);
        // Reset question when generating new story
        setPreGeneratedQuestion(null);
        setQuestionError(null);

        try {
            const storyData = await generateStoryFromWords(words);
            if (storyData && storyData.sentences) {
                setSentences(storyData.sentences);
                setHasGeneratedStory(true);
            } else {
                throw new Error('Invalid story format received');
            }
        } catch (error) {
            console.error('Error generating story:', error);
            setStoryError('שגיאה ביצירת הסיפור. נסה שוב מאוחר יותר.');
        } finally {
            setIsGeneratingStory(false);
        }
    };

    const generateQuestionInBackground = async () => {
        if (!sentences || sentences.length === 0) return;

        setIsGeneratingQuestion(true);
        setQuestionError(null);

        try {
            const englishSentences = sentences.map(sentence => sentence.english);
            
            const response = await fetch('/practiceSpace/api/generate-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentences: englishSentences }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate question');
            }

            const data = await response.json();
            setPreGeneratedQuestion(data.question);
        } catch (error) {
            console.error('Error generating question:', error);
            setQuestionError('שגיאה ביצירת השאלה');
        } finally {
            setIsGeneratingQuestion(false);
        }
    };

    const fullStory = sentences.map(s => s.english).join(" ");
    const allWordsForUnderLine = [...(words || []), ...(inflections || [])];

    const handleRegenerateStory = () => {
        setHasGeneratedStory(false);
        setShowComprehension(false);
        generateNewStory();
    };

    const handleStartComprehension = () => {
        setShowComprehension(true);
    };

    const handleBackToReading = () => {
        setShowComprehension(false);
    };

    // Create story object for ReadingComprehension component
    const storyForComprehension = {
        sentences: sentences,
        title: hasGeneratedStory ? 'סיפור מותאם אישית' : 'Story Time'
    };

    // Show comprehension if active
    if (showComprehension && sentences.length > 0) {
        return (
            <div>
                <ReadingComprehension 
                    story={storyForComprehension} 
                    onBackToReading={handleBackToReading}
                    preGeneratedQuestion={preGeneratedQuestion}
                    questionError={questionError}
                    isGeneratingQuestion={isGeneratingQuestion}
                />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto my-12 px-4"
        >
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    שיפור יכולות הקריאה
                </h1>
                <div className="relative inline-block group">
                    <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
                        {words && words.length > 0 
                            ? 'סיפור מותאם אישית המכיל את המילים המאתגרות שלך!'
                            : 'כדאי לשים לב למילים המאתגרות שסימנת, ולהבנת ההקשר שלהן מתוך הטקסט!'
                        }
                    </p>
                    <div className="absolute -top-1 -right-6">
                        <Info className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">
                                {hasGeneratedStory ? 'סיפור מותאם אישית' : 'Story Time'}
                            </span>
                            {hasGeneratedStory && (
                                <Wand2 className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {words && words.length > 0 && (
                                <button
                                    onClick={handleRegenerateStory}
                                    disabled={isGeneratingStory}
                                    className="flex items-center gap-2 bg-white/20 text-white px-3 py-2 rounded-full hover:bg-white/30 active:bg-white/40 transition-all duration-200 border-2 border-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isGeneratingStory ? 'animate-spin' : ''}`} />
                                    <span className="text-sm">סיפור חדש</span>
                                </button>
                            )}
                            <div className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 active:bg-white/80 transition-all duration-200 border-2 border-white/60">
                                <AudioButton 
                                    text={fullStory}
                                    className="text-white"
                                />
                                <span className="text-sm">השמע</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                    {isGeneratingStory ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="mt-2 text-gray-600">
                                יוצר סיפור מותאם אישית...
                            </p>
                        </div>
                    ) : (
                        <>
                            {storyError && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-800 text-sm text-center">
                                        {storyError}
                                    </p>
                                </div>
                            )}
                            <div className="space-y-6">
                                {sentences.map((sentence, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onHoverStart={() => setActiveIndex(index)}
                                        onHoverEnd={() => setActiveIndex(null)}
                                    >
                                        <Tooltip content={sentence.hebrew}>
                                            <div 
                                                className={`p-4 rounded-lg transition-all duration-200 ${
                                                    activeIndex === index 
                                                    ? 'bg-indigo-50 shadow-md' 
                                                    : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <span 
                                                    className="text-lg leading-relaxed text-gray-800 block text-left"
                                                    dir="ltr"
                                                >
                                                    {underLine(sentence.english, allWordsForUnderLine)}
                                                </span>
                                            </div>
                                        </Tooltip>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Comprehension Button - Only show if story is loaded */}
                            {sentences.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 text-center"
                                >
                                    <button
                                        onClick={handleStartComprehension}
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span>סיימתי לקרוא - בוא נבדוק הבנה</span>
                                    </button>
                                    <p className="text-sm text-gray-500 mt-2">
                                        מוכן לבדוק כמה הבנת מהסיפור?
                                    </p>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">לחץ על המשפטים לתרגום</span>
                        <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Reading;