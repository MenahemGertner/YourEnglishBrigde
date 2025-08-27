import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, AlertCircle, CheckCircle2, Loader2, Lightbulb, RotateCcw } from 'lucide-react';
import WritingService from '../services/writingService';

const Writing = ({ onPracticeCompleted }) => {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackType, setFeedbackType] = useState(''); // 'success', 'warning', 'info'
    const [validationError, setValidationError] = useState('');
    const [hasCompletedPractice, setHasCompletedPractice] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUserInput(value);
        setShowFeedback(false);
        setFeedback('');

        // שימוש בשירות לולידציה
        const error = WritingService.validateInput(value);
        setValidationError(error);
    };

    const checkAnswer = async () => {
        if (!userInput.trim()) {
            setFeedback('אנא כתוב משפט לפני הבדיקה');
            setFeedbackType('info');
            setShowFeedback(true);
            return;
        }

        setIsLoading(true);
        setShowFeedback(false);

        try {
            // שימוש בשירות לבדיקה המלאה
            const result = await WritingService.performFullCheck(userInput, []);
            
            setFeedback(result.feedback);
            setFeedbackType(result.feedbackType);
            setShowFeedback(true);

            // סימון השלמת התרגול
            if (!hasCompletedPractice) {
                setHasCompletedPractice(true);
                if (onPracticeCompleted) {
                    onPracticeCompleted();
                }
            }

        } catch (error) {
            console.error('Error in checkAnswer:', error);
            
            setFeedback(error.message);
            setFeedbackType('info');
            setShowFeedback(true);

            // סימון השלמת התרגול גם במקרה של שגיאה
            if (!hasCompletedPractice) {
                setHasCompletedPractice(true);
                if (onPracticeCompleted) {
                    onPracticeCompleted();
                }
            }

        } finally {
            setIsLoading(false);
        }
    };

    const resetText = () => {
        setUserInput('');
        setFeedback('');
        setShowFeedback(false);
        setFeedbackType('');
        setValidationError('');
    };

    const getFeedbackIcon = () => {
        switch (feedbackType) {
            case 'success':
                return <CheckCircle2 className="w-5 h-5" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5" />;
            case 'info':
                return <Lightbulb className="w-5 h-5" />;
            default:
                return <Lightbulb className="w-5 h-5" />;
        }
    };

    const getFeedbackStyles = () => {
        switch (feedbackType) {
            case 'success':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'warning':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'info':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto my-12 px-4"
        >
            {/* Header Section */}
            <div className="text-center mb-12">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4"
                >
                    <Edit className="w-6 h-6 text-indigo-600" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    תרגול כתיבה באנגלית
                </h1>
                
                <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
                    נסה לכתוב משפט תקני באנגלית, שיכלול לפחות מילה אחת מתוך רשימת המילים המאתגרות שלך.
                </p>
            </div>

            {/* Main Content Card */}
            <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                dir='ltr'
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                    <h3 className="text-white text-lg font-medium text-center">
                        כתוב משפט באנגלית עם המילים הקשות שלך
                    </h3>
                </div>

                {/* Input Section */}
                <div className="p-8">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-full max-w-2xl">
                            <textarea
                                value={userInput}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                        checkAnswer();
                                    }
                                }}
                                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none transition-colors resize-none ${
                                    validationError 
                                        ? 'border-red-300 focus:border-red-500' 
                                        : 'border-gray-300 focus:border-indigo-500'
                                }`}
                                placeholder="Write your sentence in English here..."
                                rows="4"
                                disabled={isLoading}
                            />
                            {validationError && (
                                <p className="text-red-500 text-sm mt-2">{validationError}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Ctrl + Enter לבדיקה מהירה
                            </p>
                        </div>

                        <motion.button
                            onClick={checkAnswer}
                            dir='rtl'
                            disabled={isLoading || validationError}
                            whileHover={{ scale: (isLoading || validationError) ? 1 : 1.05 }}
                            whileTap={{ scale: (isLoading || validationError) ? 1 : 0.95 }}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>בודק תשובה...</span>
                                </>
                            ) : (
                                <span>בדוק תשובה</span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full max-w-2xl space-y-4"
                                >
                                    {/* משוב */}
                                    <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 ${getFeedbackStyles()}`}>
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getFeedbackIcon()}
                                        </div>
                                        <div className="flex-1" dir='rtl'>
                                            <p className="text-sm leading-relaxed">{feedback}</p>
                                        </div>
                                    </div>
                                    
                                    {/* כפתור איפוס */}
                                    <div className="flex justify-center">
                                        <motion.button
                                            onClick={resetText}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                            dir="rtl"
                                        >
                                            <RotateCcw className="w-4 h-4 ml-2" />
                                            <span>נסה משפט חדש</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Enhanced Tips Section */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                    {/* טיפ חדש למילים קשות */}
                    
                    
                    {/* טיפים כלליים */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">✍️ השתמש בלפחות מילה אחת מהרשימה</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">📖 שים לב לדקדוק ולמבנה המשפט</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">🎯 נסה להיות יצירתי וברור</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">⏰ התנסה בזמנים שונים</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Writing;