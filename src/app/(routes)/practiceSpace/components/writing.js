import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import WritingService from '../services/writingService';

const Writing = ({ onPracticeCompleted }) => {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackType, setFeedbackType] = useState(''); // 'success', 'error', 'info'
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
            setFeedbackType('error');
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
            setFeedbackType('error');
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

    const getFeedbackIcon = () => {
        switch (feedbackType) {
            case 'success':
                return <CheckCircle2 className="w-5 h-5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getFeedbackStyles = () => {
        switch (feedbackType) {
            case 'success':
                return 'bg-green-50 text-green-600';
            case 'error':
                return 'bg-red-50 text-red-600';
            default:
                return 'bg-blue-50 text-blue-600';
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
                    כתוב משפט באנגלית שיכלול לפחות 2 מילים מתוך רשימת המילים הקשות שלך
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
                                    className={`flex items-start space-x-3 p-4 rounded-lg w-full max-w-2xl ${getFeedbackStyles()}`}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getFeedbackIcon()}
                                    </div>
                                    <div className="flex-1" dir='rtl'>
                                        <p className="text-sm leading-relaxed">{feedback}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">✍️ השתמש בלפחות 2 מילים מהרשימה</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">📖 שים לב לדקדוק ולמבנה המשפט</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">🎯 נסה להיות יצירתי וברור</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Writing;