import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AudioButton from '@/components/features/AudioButton';
import Tooltip from '@/components/features/Tooltip';
import underLine from '@/components/features/UnderLine';
import { BookOpen, Info } from 'lucide-react';

const Reading = () => {
    const [userWords, setUserWords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const sentences = [
        {
            english: "The beautiful child glows with happiness where the water flows free.",
            hebrew: "הילדה היפה קורנת מאושר במקום בו המים זורמים בחופשיות."
        },
        {
            english: "Day by day, her strong self develops and grows in important ways.",
            hebrew: "יום אחר יום, העצמי החזק שלה מתפתח וגדל בדרכים חשובות."
        },
        {
            english: "Time takes its course as love increases, making her good heart glow.",
            hebrew: "הזמן עושה את שלו כשהאהבה גדלה, גורמת ללבה הטוב לזהור."
        },
        {
            english: "She happily develops herself where the beautiful waters flow.",
            hebrew: "היא מתפתחת בשמחה במקום בו המים היפים זורמים."
        },
        {
            english: "Taking strong steps forward, she freely grows into who she'll be.",
            hebrew: "צועדת צעדים חזקים קדימה, היא גדלה בחופשיות אל מי שתהיה."
        }
    ];

    useEffect(() => {
        const fetchUserWords = async () => {
            try {
                const response = await fetch('/practiceSpace/api/wordAndInflections');
                if (!response.ok) {
                    throw new Error('Failed to fetch words');
                }
                const data = await response.json();
                
                // מיזוג המילים וההטיות מרמות 3 ו-4
                const combinedWords = [
                    ...data.words.level2,
                    ...data.words.level3,
                    ...data.words.level4,
                    ...data.inflections.level2,
                    ...data.inflections.level3,
                    ...data.inflections.level4
                ];
                
                setUserWords(combinedWords);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserWords();
    }, []);

    const fullStory = sentences.map(s => s.english).join(" ");

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-500 text-center p-4 bg-red-50 rounded-lg"
            >
                {error}
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
                        כדאי לשים לב למילים המאתגרות שסימנת, ולהבנת ההקשר שלהן מתוך הטקסט!
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
                        <span className="text-white font-medium">Story Time</span>
                        <div className="flex items-center space-x-2">
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
                                        <span className="text-lg leading-relaxed text-gray-800">
                                            {underLine(sentence.english, userWords)}
                                        </span>
                                    </div>
                                </Tooltip>
                            </motion.div>
                        ))}
                    </div>
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