'use client';

import React from 'react';
import { Cat } from 'lucide-react';

function SequenceReset() {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef(null);

    const handleCatClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        // Add click event listener
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="fixed bottom-4 right-4 z-50">
            <div 
                role="button"
                tabIndex={0}
                onClick={handleCatClick}
                onKeyDown={(e) => e.key === 'Enter' && handleCatClick(e)}
                className="relative cursor-pointer"
            >
                <Cat 
                    size={56}  // גודל מפורש
                    className={`transition-all duration-300 text-blue-900 hover:text-blue-700
                        ${isOpen ? 'scale-150' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute bottom-full mb-2 right-1/2 transform translate-x-1/2 bg-white rounded-lg shadow-lg p-4 w-64 border border-gray-200">
                    <div className="space-y-3">
                        <button 
                            className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-900 transition-colors duration-200 text-sm font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            התחל מההתחלה
                        </button>
                        
                        <button 
                            className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-900 transition-colors duration-200 text-sm font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            בחר נקודת התחלה ברשימה
                        </button>
                    </div>
                    
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-r border-b border-gray-200" />
                </div>
            )}
        </div>
    );
}

export default SequenceReset;