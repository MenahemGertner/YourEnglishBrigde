import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const ReadingComprehension = ({ 
    story, 
    onBackToReading, 
    preGeneratedQuestion, 
    questionError, 
    isGeneratingQuestion 
}) => {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // פונקציה לערבוב מערך (approach חדש)
    const shuffleArray = (array) => {
        const shuffled = [...array];
        
        // ערבוב מספר פעמים עם delay קטן
        for (let round = 0; round < 5; round++) {
            for (let i = 0; i < shuffled.length; i++) {
                // יצירת אינדקס רנדומלי
                const randomIndex = Math.floor(Math.random() * shuffled.length);
                [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
            }
        }
        
        return shuffled;
    };

    // פונקציה לעיבוד השאלה וערבוב התשובות
    const processQuestion = (questionData) => {
        if (!questionData || !questionData.options || !questionData.correctAnswer) {
            return questionData;
        }

        // שמירה על התשובה הנכונה
        const correctAnswer = questionData.correctAnswer;
        const originalIndex = questionData.options.indexOf(correctAnswer);
        
        // ערבוב התשובות
        const shuffledOptions = shuffleArray(questionData.options);
        const newIndex = shuffledOptions.indexOf(correctAnswer);
        
        return {
            ...questionData,
            options: shuffledOptions,
            correctAnswer: correctAnswer // התשובה הנכונה נשארת כמו שהיא
        };
    };

    // Use pre-generated question if available, otherwise generate new one
    useEffect(() => {
        if (preGeneratedQuestion) {
            setQuestion(processQuestion(preGeneratedQuestion));
            setError('');
            setLoading(false);
        } else if (questionError) {
            setError(questionError);
            setLoading(false);
        } else if (isGeneratingQuestion) {
            setLoading(true);
            setError('');
        } else if (story && story.sentences && !question) {
            // Fallback: generate question if no pre-generated one available
            generateQuestion();
        }
    }, [preGeneratedQuestion, questionError, isGeneratingQuestion, story]);

    const generateQuestion = async () => {
        if (!story || !story.sentences) return;
        
        setLoading(true);
        setError('');
        
        try {
            const englishSentences = story.sentences.map(sentence => sentence.english);
            
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
            setQuestion(processQuestion(data.question));
        } catch (err) {
            setError('שגיאה ביצירת השאלה. אנא נסה שוב.');
            console.error('Error generating question:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answer) => {
        if (showResult) return;
        setSelectedAnswer(answer);
    };

    const checkAnswer = () => {
        if (!selectedAnswer || !question) return;
        
        const correct = selectedAnswer === question.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);
    };

    const resetQuestion = () => {
        setSelectedAnswer('');
        setShowResult(false);
        setIsCorrect(false);
        setQuestion(null);
        generateQuestion();
    };

    if ((!story || !story.sentences || story.sentences.length === 0) && !loading && !question) {
        return (
            <div className="w-full max-w-4xl mx-auto my-12 px-4">
                <div className="text-center text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4" />
                    <p>אנא קרא קודם את הסיפור כדי להמשיך לתרגיל הבנת הנקרא</p>
                </div>
            </div>
        );
    }

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
                    className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4"
                >
                    <BookOpen className="w-6 h-6 text-blue-600" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    הבנת הנקרא
                </h1>
                
                <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
                    ענה על השאלה בהתבסס על הסיפור שקראת
                </p>

                {/* Back to Reading Button */}
                {onBackToReading && (
                    <motion.button
                        onClick={onBackToReading}
                        className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>חזור לקריאה</span>
                    </motion.button>
                )}
            </div>

            {/* Main Content Card */}
            <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                {/* Story Display */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 text-right">הסיפור:</h3>
                        <div className="space-y-2 text-left" dir="ltr">
                            {story.sentences.map((sentence, index) => (
                                <p key={index} className="text-white/90 text-sm">
                                    {sentence.english}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="p-8">
                    {loading && (
                        <div className="flex items-center justify-center space-x-2 text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>
                                {preGeneratedQuestion ? 'טוען שאלה...' : 'יוצר שאלה...'}
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                            <button
                                onClick={generateQuestion}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                נסה שוב
                            </button>
                        </div>
                    )}

                    {question && !loading && !error && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                    {question.question}
                                </h3>
                            </div>

                            {/* Answer Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        disabled={showResult}
                                        whileHover={{ scale: showResult ? 1 : 1.02 }}
                                        whileTap={{ scale: showResult ? 1 : 0.98 }}
                                        className={`
                                            p-4 rounded-lg border-2 text-left transition-all
                                            ${selectedAnswer === option 
                                                ? showResult 
                                                    ? isCorrect 
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                            ${showResult && option === question.correctAnswer && selectedAnswer !== option
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : ''
                                            }
                                            ${showResult ? 'cursor-default' : 'cursor-pointer'}
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showResult && option === question.correctAnswer && (
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4">
                                {!showResult ? (
                                    <motion.button
                                        onClick={checkAnswer}
                                        disabled={!selectedAnswer}
                                        whileHover={{ scale: selectedAnswer ? 1.05 : 1 }}
                                        whileTap={{ scale: selectedAnswer ? 0.95 : 1 }}
                                        className={`
                                            px-8 py-3 rounded-full font-medium transition-colors
                                            ${selectedAnswer 
                                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        בדוק תשובה
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={resetQuestion}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        שאלה חדשה
                                    </motion.button>
                                )}
                            </div>

                            {/* Result Message */}
                            <AnimatePresence>
                                {showResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`
                                            flex items-center justify-center space-x-2 p-4 rounded-lg
                                            ${isCorrect 
                                                ? 'bg-green-50 text-green-600' 
                                                : 'bg-red-50 text-red-600'
                                            }
                                        `}
                                    >
                                        {isCorrect ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>כל הכבוד! התשובה נכונה</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-5 h-5" />
                                                <span>התשובה שגויה. התשובה הנכונה היא: {question.correctAnswer}</span>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Tips Section */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">📖 קרא את הסיפור שוב במידת הצורך</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">🎯 שים לב לפרטים בטקסט</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm">💭 חשוב על ההיגיון של כל תשובה</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ReadingComprehension;