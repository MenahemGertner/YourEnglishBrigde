import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, AlertCircle, CheckCircle2 } from 'lucide-react';

const Writing = () => {
    const [userInput, setUserInput] = useState('');
    const [showError, setShowError] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    const sentence = "The beautiful child glows with happiness where the water flows free";
    const correctWord = "beautiful";
    const incompleteSentence = sentence.replace(correctWord, "_____");

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
        setShowError(false);
        setIsCorrect(false);
    };

    const checkAnswer = () => {
        if (userInput.toLowerCase() === correctWord.toLowerCase()) {
            setIsCorrect(true);
            setShowError(false);
        } else if (userInput.toLowerCase() === correctWord.toLowerCase().slice(0, userInput.length)) {
            // Word is correct so far but incomplete
            setShowError(false);
            setIsCorrect(false);
        } else {
            setShowError(true);
            setIsCorrect(false);
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
                    שיפור יכולות הכתיבה
                </h1>
                
                <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
                    השלם את המילה החסרה במשפט
                </p>
            </div>

            {/* Main Content Card */}
            <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                {/* Sentence Display */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                    <p className="text-white text-xl font-medium text-center">
                        {incompleteSentence}
                    </p>
                </div>

                {/* Input Section */}
                <div className="p-8">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-full max-w-md">
                            <input
                                type="text"
                                value={userInput}
                                onChange={handleInputChange}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        checkAnswer();
                                    }
                                }}
                                className="w-full px-4 py-2 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                                placeholder="הקלד את המילה החסרה..."
                            />
                        </div>

                        <motion.button
                            onClick={checkAnswer}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                        >
                            בדוק תשובה
                        </motion.button>

                        <AnimatePresence>
                            {showError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center space-x-2 p-4 bg-red-50 text-red-600 rounded-lg w-full max-w-md"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <span>נסה שוב! המילה אינה נכונה</span>
                                </motion.div>
                            )}

                            {isCorrect && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center space-x-2 p-4 bg-green-50 text-green-600 rounded-lg w-full max-w-md"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>כל הכבוד! התשובה נכונה</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">✍️ שים לב לאיות הנכון</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">📖 קרא את המשפט כולו להבנת ההקשר</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">🎯 נסה להיזכר במילים דומות</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Writing;