// app/practiceSpace/components/PracticeSpaceClient.js - Client Component
'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PracticeLogic from './practiceLogic';
import ChallengingWords from './challengingWords';
import Reading from './reading';
import Writing from './writing';
import Hearing from './hearing';
import Speaking from './speaking';
import { ChevronDown } from 'lucide-react';

const PracticeSpaceClient = ({ wordsData }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Extract specific data for each component
    const challengingWordsData = {
        challengingWords: wordsData.challengingWords,
        wordTranslations: wordsData.wordTranslations
    };

    const readingData = {
        words: wordsData.words,
        inflections: wordsData.inflections
    };

    return (
        <PracticeLogic>
            {({ handleReturn }) => (
                    <div className="min-h-screen">
                        {/* Hero Section with Gradient */}
                        <div className="mt-2 relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0 flex flex-col items-center justify-center px-4"
                            >
                                <div className="text-center max-w-4xl mx-auto">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="mb-6"
                                    >
                                        <span className="bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                                            כל הכבוד! למדת מילים חדשות נוספות!
                                        </span>
                                    </motion.div>
                                    
                                    <motion.h1 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="text-5xl font-bold text-indigo-700 mb-8"
                                    >
                                        בואו נתרגל את מה שלמדנו
                                    </motion.h1>
                                    
                                    <motion.p 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                        className="text-xl text-gray-600 leading-relaxed"
                                    >
                                        כאן באזור התרגול נעבוד יחד על פיתוח המיומנויות השונות שלך בשפה.
                                        <br />
                                        נתמקד במיוחד במילים החדשות שזה עתה למדת!
                                    </motion.p>
                                </div>
                                
                                {/* Floating scroll indicator */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, y: [0, 10, 0] }}
                                    transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
                                    className="absolute bottom-8 cursor-pointer"
                                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                                >
                                    <ChevronDown className="w-8 h-8 text-blue-900" />
                                    <span className="text-sm text-blue-900">גלול למטה כדי להתחיל</span>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Practice Section */}
                        <div className="py-16 px-4">
                            <div className="max-w-6xl mx-auto">
                                <div className="grid gap-8 md:grid-cols-1 lg:gap-12">
                                    {/* Pass only relevant data to each component */}
                                    <ChallengingWords 
                                        challengingWords={challengingWordsData.challengingWords}
                                        wordTranslations={challengingWordsData.wordTranslations}
                                    />
                                    <Reading 
                                        words={readingData.words}
                                        inflections={readingData.inflections}
                                    />
                                    {/* <Writing wordsData={wordsData} /> */}
                                    {/* <Hearing wordsData={wordsData} /> */}
                                    {/* <Speaking wordsData={wordsData} /> */}
                                </div>
                                <div>
                                    
                                </div>
                                
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="mt-16 text-center"
                                >
                                    <p className='mb-12 font-semibold text-gray-700'>סיימת לתרגל? מוכן להמשיך הלאה?</p>
                                    <button
                                        onClick={handleReturn}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 duration-300 hover:bg-purple-800 hover:scale-105 text-white font-bold py-4 px-8 rounded text-xl shadow-lg hover:shadow-xl"
                                    >
                                        חזרה לרשימת המילים
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
            )}
        </PracticeLogic>
    );
};

export default PracticeSpaceClient;