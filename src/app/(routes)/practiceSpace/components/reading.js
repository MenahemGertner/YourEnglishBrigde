'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioButton from '@/components/features/AudioButton';
import Tooltip from '@/components/features/Tooltip';
import underLine from '@/components/features/UnderLine';
import ReadingComprehension from './readingComprehension';
import StoryLevelSelector from './StoryLevelSelector';
import { BookOpen, Info, RefreshCw, Wand2, CheckCircle } from 'lucide-react';
import { generateStoryFromWords } from '../services/generateStory';
import questionService from '../services/questionService';

const Reading = ({ words, inflections, onPracticeCompleted, userId }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [sentences, setSentences] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [showComprehension, setShowComprehension] = useState(false);
    
    // מצב רמת הקושי
    const [storyLevel, setStoryLevel] = useState(null);
    const [isLoadingLevel, setIsLoadingLevel] = useState(true);
    
    // מצב השאלה
    const [question, setQuestion] = useState(null);
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [questionError, setQuestionError] = useState(null);

    // טעינת רמת המשתמש המועדפת בטעינה ראשונית
    useEffect(() => {
        async function loadUserPreferredLevel() {
            if (!userId) {
                setStoryLevel(3);
                setIsLoadingLevel(false);
                return;
            }

            try {
                // קריאה ישירה מהשרת (מסד הנתונים) - לא מ-localStorage!
                const { getStoryLevel } = await import('@/lib/userPreferences');
                const level = await getStoryLevel(userId);
                setStoryLevel(level);
            } catch (error) {
                console.error('Error loading preferred story level:', error);
                setStoryLevel(3);
            } finally {
                setIsLoadingLevel(false);
            }
        }

        loadUserPreferredLevel();
    }, [userId]);

    // Generate story
    const generateStory = async () => {
        if (!words?.length || storyLevel === null) return;

        setIsGenerating(true);
        setError(null);
        setShowComprehension(false);
        setQuestion(null);
        setQuestionError(null);

        try {
            const storyData = await generateStoryFromWords(words, { level: storyLevel });
            setSentences(storyData.sentences);
            setHasGenerated(true);
        } catch (error) {
            setError('שגיאה ביצירת הסיפור. נסה שוב מאוחר יותר.');
            console.error('Error generating story:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // יצירת השאלה
    const generateQuestion = async (storyData) => {
        setIsGeneratingQuestion(true);
        setQuestionError(null);
        
        try {
            const englishSentences = storyData.sentences.map(sentence => ({
                english: sentence.english
            }));
            
            const validation = questionService.validateStory({ sentences: englishSentences });
            if (!validation.isValid) {
                throw new Error(validation.message);
            }
            
            const extractedSentences = questionService.extractEnglishSentences({ sentences: englishSentences });
            const newQuestion = await questionService.generateQuestion(extractedSentences);
            setQuestion(newQuestion);
        } catch (error) {
            setQuestionError(error.message || 'שגיאה ביצירת השאלה');
            console.error('Error generating question:', error);
        } finally {
            setIsGeneratingQuestion(false);
        }
    };

    // Auto-generate on mount
    useEffect(() => {
        if (!isLoadingLevel && !hasGenerated && words?.length > 0 && storyLevel !== null) {
            generateStory();
        }
    }, [isLoadingLevel, hasGenerated, words, storyLevel]);

    // יצירת השאלה כאשר הסיפור מוכן
    useEffect(() => {
        if (sentences.length > 0 && !question && !isGeneratingQuestion) {
            generateQuestion({ sentences });
        }
    }, [sentences, question, isGeneratingQuestion]);

    // Regenerate story when level changes
    useEffect(() => {
        if (hasGenerated && storyLevel !== null) {
            generateStory();
        }
    }, [storyLevel]);

    // Regenerate story
    const handleRegenerateStory = () => {
        setHasGenerated(false);
        generateStory();
    };

    // ✨ הפתרון: טיפול בשינוי רמה - רק ב-state, БЕЗ localStorage!
    const handleLevelChange = (newLevel) => {
        // עדכון ה-state בלבד - זו בחירה זמנית רק לסשן הנוכחי
        setStoryLevel(newLevel);
        
        // אם כבר יש סיפור, נגנרט מחדש
        if (hasGenerated) {
            setHasGenerated(false);
        }
    };

    // מעבר לשאלה
    const handleShowComprehension = () => {
        setShowComprehension(true);
    };

    // Computed values
    const fullStory = sentences.map(s => s.english).join(" ");
    const allWordsForUnderLine = [...(words || []), ...(inflections || [])];

    // סיפור לקומפוננטת הבנת הנקרא
    const storyForComprehension = {
        sentences: sentences.map(sentence => ({
            english: sentence.english
        })),
        title: hasGenerated ? 'סיפור מותאם אישית' : 'Story Time'
    };

    // Show comprehension if active
    if (showComprehension && sentences.length > 0) {
        return (
            <ReadingComprehension 
                story={storyForComprehension} 
                onBackToReading={() => setShowComprehension(false)}
                preGeneratedQuestion={question}
                onPracticeCompleted={onPracticeCompleted}
            />
        );
    }

    // הצגת טעינה
    if (isLoadingLevel) {
        return (
            <div className="max-w-3xl mx-auto my-12 px-4">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">טוען הגדרות...</p>
                </div>
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
                        {words?.length > 0 
                            ? 'סיפור מותאם אישית המכיל את המילים המאתגרות שלך!'
                            : 'כדאי לשים לב למילים המאתגרות שסימנת, ולהבנת ההקשר שלהן מתוך הטקסט!'
                        }
                    </p>
                    <div className="absolute -top-1 -right-6">
                        <Info className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* בורר רמת הקושי */}
            {words?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <StoryLevelSelector
                        selectedLevel={storyLevel}
                        onLevelChange={handleLevelChange}
                        disabled={isGenerating}
                        userId={userId}
                    />
                </motion.div>
            )}

            <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">
                                {hasGenerated ? 'סיפור מותאם אישית' : 'Story Time'}
                            </span>
                            {hasGenerated && <Wand2 className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex items-center space-x-2">
                            {words?.length > 0 && (
                                <button
                                    onClick={handleRegenerateStory}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 bg-white/20 text-white px-3 py-2 rounded-full hover:bg-white/30 transition-all duration-200 border-2 border-white/60 disabled:opacity-50"
                                >
                                    <span className="text-sm">סיפור חדש</span>
                                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                </button>
                            )}
                            <div className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200 border-2 border-white/60">                               
                                <span className="text-sm">השמע את כל הסיפור</span>
                                <AudioButton text={fullStory} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                    {isGenerating ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="mt-2 text-gray-600">יוצר סיפור מותאם אישית...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-800 text-sm text-center">{error}</p>
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
                                        <div className={`p-4 rounded-lg transition-all duration-200 ${
                                            activeIndex === index ? 'bg-indigo-50 shadow-md' : 'hover:bg-gray-50'
                                        }`}>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <Tooltip content={sentence.hebrew}>
                                                        <div className="text-lg leading-relaxed text-gray-800 text-left" dir="ltr" style={{ direction: 'ltr' }}>
                                                            {underLine(sentence.english, allWordsForUnderLine)}
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <AudioButton text={sentence.english}/>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {sentences.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 text-center"
                                >
                                    <button
                                        onClick={handleShowComprehension}
                                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span>סיימתי לקרוא!!</span>
                                    </button>
                                    <p className="text-sm text-gray-500 mt-2">
                                        מוכן לבדוק את ההבנה שלך?
                                    </p>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">לחץ על המשפטים לתרגום ועל הרמקול להשמעה</span>
                        <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Reading;