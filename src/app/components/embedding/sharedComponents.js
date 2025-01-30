// sharedComponents.js
import { motion } from 'framer-motion';

export const createLearningSection = ({
    icon: Icon,
    title,
    description,
    mainContent,
    headerContent,
    footerTips
}) => {
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
                    <Icon className="w-6 h-6 text-indigo-600" />
                </motion.div>
                
                <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {title}
                </h1>
                
                <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
                    {description}
                </p>
            </div>

            {/* Main Card */}
            <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    {headerContent}
                </div>

                {/* Card Content */}
                <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                    {mainContent}
                </div>

                {/* Card Footer */}
                {footerTips && (
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex flex-wrap justify-center gap-4">
                            {footerTips.map((tip, index) => (
                                <div key={index} className="flex items-center space-x-2 text-gray-600">
                                    <span className="text-sm">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};