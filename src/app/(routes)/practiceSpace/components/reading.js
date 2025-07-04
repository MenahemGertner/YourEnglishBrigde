import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWords } from '../providers/wordsProvider';
import AudioButton from '@/components/features/AudioButton';
import Tooltip from '@/components/features/Tooltip';
import underLine from '@/components/features/UnderLine';
import { BookOpen, Info, RefreshCw, Wand2 } from 'lucide-react';
import { generateStoryFromWords } from '../services/generateStory';

const Reading = () => {
    const { wordsData, isLoading: wordsLoading, error: wordsError } = useWords();
    const [activeIndex, setActiveIndex] = useState(null);
    const [sentences, setSentences] = useState([]);
    const [isGeneratingStory, setIsGeneratingStory] = useState(false);
    const [storyError, setStoryError] = useState(null);
    const [hasGeneratedStory, setHasGeneratedStory] = useState(false);

    // Generate story when words are loaded
    useEffect(() => {
    // רק כאשר סיום טעינת המילים התרחש
    if (!wordsLoading && !hasGeneratedStory) {
        const hasWords = wordsData?.words?.length > 0;

        if (hasWords) {
            generateNewStory();
        }
        // אפשר להוסיף כאן else אם בעתיד תרצה ליצור סיפור גנרי כשאין מילים
    }
}, [wordsLoading, wordsData, hasGeneratedStory]);

    const generateNewStory = async () => {
    const words = wordsData?.words || [];

    if (words.length === 0) {
        console.warn('No words available for story generation');
        return;
    }

    setIsGeneratingStory(true);
    setStoryError(null);

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


    const fullStory = sentences.map(s => s.english).join(" ");
    const allWordsForUnderLine = [...(wordsData?.words || []), ...(wordsData?.inflections || [])];

    const handleRegenerateStory = () => {
        setHasGeneratedStory(false);
        generateNewStory();
    };

    if (wordsError) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-500 text-center p-4 bg-red-50 rounded-lg"
            >
                שגיאה בטעינת המילים: {wordsError}
            </motion.div>
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
                        {wordsData?.words && wordsData.words.length > 0 
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
                            {wordsData?.words && wordsData.words.length > 0 && (
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
                    {wordsLoading || isGeneratingStory ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="mt-2 text-gray-600">
                                {wordsLoading ? 'טוען מילים...' : 'יוצר סיפור מותאם אישית...'}
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