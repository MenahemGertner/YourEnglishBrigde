'use client';

import React from 'react';
import { motion } from 'framer-motion';

const StoryLevelSelector = ({ selectedLevel, onLevelChange, disabled = false }) => {
    const levels = [1, 2, 3, 4, 5];

    const handleLevelSelect = (level) => {
        if (!disabled) {
            onLevelChange(level);
        }
    };

    return (
        <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-sm text-gray-600 ml-2">רמת קושי:</span>
            {levels.map((level) => (
                <motion.button
                    key={level}
                    onClick={() => handleLevelSelect(level)}
                    disabled={disabled}
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
        </div>
    );
};

export default StoryLevelSelector;