'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StoryLevelSelector = ({ selectedLevel, onLevelChange, disabled = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const levels = [1, 2, 3, 4, 5];

    const handleLevelSelect = (level) => {
        if (!disabled) {
            onLevelChange(level);
        }
    };

    const toggleExpanded = () => {
        if (!disabled) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="flex items-center justify-start gap-1 mb-4 relative w-full">
            {/* המסגרת הוירטואלית שמכסה את כל האזור */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    left: isExpanded ? '-200px' : '0',
                    transition: 'left 0.3s ease-out'
                }}
                onMouseEnter={() => !disabled && setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            />

            <motion.button 
                className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    border border-gray-200 bg-white shadow-sm absolute right-0 z-10 flex items-center gap-2
                    ${disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer'
                    }
                    ${isExpanded ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'text-gray-600'}
                `}
                onClick={toggleExpanded}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
            >
                <span>רמת קושי:</span>
                <AnimatePresence>
                    {selectedLevel && (
                        <motion.span 
                            className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold"
                            initial={{ scale: 1, opacity: 1, width: 24 }}
                            animate={{ 
                                scale: isExpanded ? 0 : 1, 
                                opacity: isExpanded ? 0 : 1,
                                width: isExpanded ? 0 : 24
                            }}
                            transition={{ 
                                duration: 0.4, 
                                ease: "easeInOut",
                                delay: isExpanded ? 0 : 0.2,
                                width: { duration: 0.3, delay: isExpanded ? 0.1 : 0.2 }
                            }}
                            style={{
                                marginRight: isExpanded ? 0 : undefined
                            }}
                        >
                            {selectedLevel}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
                     
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="flex gap-1 absolute right-full top-0 mr-2 items-center h-full z-10"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
                        style={{ transformOrigin: 'right', right: '120px' }}
                    >
                        {levels.map((level) => (
                            <motion.button
                                key={level}
                                onClick={() => handleLevelSelect(level)}
                                disabled={disabled}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{duration: 0.2 }}
                                whileHover={!disabled ? { scale: 1.1 } : {}}
                                whileTap={!disabled ? { scale: 0.9 } : {}}
                                className={`
                                    w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
                                    ${selectedLevel === level
                                        ? 'bg-indigo-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                                    }
                                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                            >
                                {level}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StoryLevelSelector;