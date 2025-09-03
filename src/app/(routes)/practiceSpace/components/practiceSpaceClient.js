// app/practiceSpace/components/PracticeSpaceClient.js - Updated Client Component
'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PracticeLogic from './practiceLogic';
import ChallengingWords from './challengingWords';
import Reading from './reading';
import Writing from './writing';
import AIVoiceChatComponent from './AIVoiceChatComponent'
import { ChevronDown, ChevronLeft, Book, PenTool, Headphones } from 'lucide-react';

const PracticeSpaceClient = ({ wordsData }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('reading');
    
    // Track completion status for each tab
    const [completionStatus, setCompletionStatus] = useState({
        reading: false,
        writing: false,
        speaking: false
    });

    // Track completion status for ChallengingWords (outside tabs)
    const [challengingWordsCompleted, setChallengeWordsCompleted] = useState(false);

    // State for button press effect
    const [isReturning, setIsReturning] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Tab configuration
    const tabs = [
        { id: 'reading', label: 'קריאה', icon: Book },
        { id: 'writing', label: 'כתיבה', icon: PenTool },
        { id: 'speaking', label: 'דיבור ושמיעה', icon: Headphones }
    ];

    // Find current tab index
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

    // Check if this is the last tab
    const isLastTab = currentTabIndex === tabs.length - 1;

    // Handle practice completion
    const handlePracticeCompleted = (tabId) => {
        setCompletionStatus(prev => ({
            ...prev,
            [tabId]: true
        }));
    };

    // Handle ChallengingWords completion
    const handleChallengingWordsCompleted = () => {
        setChallengeWordsCompleted(true);
    };

    // Reset completion status when changing tabs
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Reset completion status for the new tab
        setCompletionStatus(prev => ({
            ...prev,
            [tabId]: false
        }));
    };

    // Navigation functions
    const goToNextTab = () => {
        if (currentTabIndex < tabs.length - 1) {
            const nextTab = tabs[currentTabIndex + 1];
            handleTabChange(nextTab.id);
        }
    };

    // Extract specific data for each component
    const challengingWordsData = {
        challengingWords: wordsData.challengingWords,
        wordTranslations: wordsData.wordTranslations
    };

    const readingData = {
        words: wordsData.words,
        inflections: wordsData.inflections
    };

    // Check if current tab is completed
    const isCurrentTabCompleted = completionStatus[activeTab];

    // Render active tab content
    const renderActiveTabContent = () => {
        const commonProps = {
            onPracticeCompleted: () => handlePracticeCompleted(activeTab)
        };

        switch (activeTab) {
            case 'reading':
                return (
                    <Reading 
                        words={readingData.words}
                        inflections={readingData.inflections}
                        {...commonProps}
                    />
                );
            case 'writing':
                return (
                    <Writing 
                        {...commonProps}
                    />
                );
            case 'speaking':
                return (
                    <div className="space-y-8">
                        <AIVoiceChatComponent
                        words={readingData.words}
                        inflections={readingData.inflections}
                        {...commonProps}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <PracticeLogic>
            {({ handleReturn: originalHandleReturn }) => {
                // Create wrapper function for handleReturn with loading state
                const handleReturn = () => {
                    setIsReturning(true);
                    originalHandleReturn(); // Call the original function
                };

                return (
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
                                {/* ChallengingWords Section - Outside tabs, always visible */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="mb-12"
                                >
                                        <ChallengingWords 
                                            challengingWords={challengingWordsData.challengingWords}
                                            wordTranslations={challengingWordsData.wordTranslations}
                                            onPracticeCompleted={handleChallengingWordsCompleted}
                                        />
                                </motion.div>

                                {/* Tab Navigation */}
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="mb-0"
                                >
                                    <div className="flex justify-center">
                                        <div className="flex">
                                            {tabs.map((tab) => {
                                                const IconComponent = tab.icon;
                                                const isActive = activeTab === tab.id;
                                                const isCompleted = completionStatus[tab.id];
                                                
                                                return (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => handleTabChange(tab.id)}
                                                        className={`relative flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                                                            isActive 
                                                                ? 'bg-white text-gray-600 border-t border-l border-r border-gray-100 rounded-t-lg -mb-px z-10' 
                                                                : 'text-gray-400 hover:text-gray-600 bg-gray-50 border-t border-l border-r border-transparent hover:border-gray-100 rounded-t-lg'
                                                        }`}
                                                        style={{
                                                            marginLeft: tab.id !== tabs[0].id ? '-1px' : '0'
                                                        }}
                                                    >
                                                        <IconComponent className="w-4 h-4" />
                                                        <span>{tab.label}</span>
                                                        {isCompleted && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tab Content */}
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="min-h-[400px] bg-white border border-gray-100 rounded-lg rounded-tl-none p-8"
                                >
                                    {renderActiveTabContent()}
                                </motion.div>

                                {/* Navigation Buttons - Only show when practice is completed */}
                                {isCurrentTabCompleted && !isLastTab && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="mt-12 flex justify-end items-center"
                                    >
                                        <button
                                            onClick={goToNextTab}
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                                        >
                                            <span>תרגול הבא</span>
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}

                                {/* Return Button - Enhanced style when last tab is completed */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="mt-16 text-center"
                                >
                                    <p className={`mb-6 text-sm ${isLastTab && isCurrentTabCompleted ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                                        {isLastTab && isCurrentTabCompleted ? 'מעולה! סיימת את כל התרגולים!' : 'סיימת לתרגל? מוכן להמשיך הלאה?'}
                                    </p>
                                    <button
                                        onClick={handleReturn}
                                        disabled={isReturning}
                                        className={`px-6 py-3 rounded-md text-sm transition-all duration-200 border ${
                                            isLastTab && isCurrentTabCompleted
                                                ? `bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-transparent font-medium shadow-sm hover:shadow-md ${
                                                    isReturning ? 'transform scale-95 opacity-75 pointer-events-none' : ''
                                                  }`
                                                : `bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 ${
                                                    isReturning ? 'transform scale-95 opacity-75 bg-gray-200 pointer-events-none' : ''
                                                  }`
                                        }`}
                                    >
                                        {isReturning ? 'טוען...' : 'חזרה לרשימת המילים'}
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                );
            }}
        </PracticeLogic>
    );
};

export default PracticeSpaceClient;