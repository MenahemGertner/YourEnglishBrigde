import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, PlayCircle, Info, Volume2 } from 'lucide-react';

const Hearing = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mx-auto my-12 px-4 md:px-8 lg:px-12"
        >
            {/* Header Section */}
            <div className="text-center mb-12">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4"
                >
                    <Headphones className="w-6 h-6 text-indigo-600" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    שיפור כישורי השמיעה
                </h1>
                
                <div className="relative inline-block group">
                    <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
                    שים לב לקצב ולהדגשים בדיבור, הם חלק חשוב מהבנת השפה!
                    </p>
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="absolute -top-1 -right-6 cursor-help"
                    >
                        <Info className="w-4 h-4 text-gray-400" />
                    </motion.div>
                </div>
            </div>

            {/* Video Container */}
            <motion.div 
                className="relative max-w-4xl mx-auto"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Video Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Volume2 className="w-5 h-5 text-white" />
                                <span className="text-white font-medium">Practice Session</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-white/80 text-sm">Interactive Learning</span>
                            </div>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                        {!isPlaying && (
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-b from-gray-900/10 to-gray-900/30 flex items-center justify-center cursor-pointer"
                                onClick={handlePlayClick}
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white/30 p-4 rounded-full backdrop-blur-sm"
                                >
                                    <PlayCircle className="w-12 h-12 text-white" />
                                </motion.div>
                            </motion.div>
                        )}
                        <iframe 
                            src="https://share.synthesia.io/embeds/videos/0d4ee4be-f45a-4e1e-ac1e-593b1fcaeedc"
                            loading="lazy"
                            title="Synthesia video player - Your AI video"
                            allowFullScreen
                            allow="encrypted-media; fullscreen"
                            className="absolute top-0 left-0 w-full h-full border-0 m-0 p-0 overflow-hidden rounded-b-lg"
                        />
                    </div>

                    {/* Video Footer */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">לחץ על הוידאו להפעלה</span>
                            <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                            <span className="text-sm font-medium">טיפ #1</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            נסה לחזור על המשפטים אחרי הדובר, זה יעזור לשפר את המבטא שלך!
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-2 text-purple-600 mb-2">
                            <span className="text-sm font-medium">טיפ #2</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            שים לב, שניתן לשנות את קצב הדיבור לקצב שלך!
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Hearing;