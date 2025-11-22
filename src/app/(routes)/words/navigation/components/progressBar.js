import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

const ProgressBar = ({ progress, onOpenSettings }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      .animate-slideDown {
        animation: slideDown 0.3s ease-out;
      }
      
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full p-2 sm:p-4 space-y-2">
      {/* Progress Bar עם אינדיקטור - עטוף ברוחב מוגבל */}
      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <div className="flex items-center gap-2">
          
          <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* אפקט ברק/זוהר */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
           {/* כפתור מידע */}
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
            title={isInfoOpen ? "הסתר מידע" : "הצג מידע"}
          >
            {isInfoOpen ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* פאנל הסבר מתרחב */}
{isInfoOpen && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2 animate-slideDown max-w-xs sm:max-w-sm md:max-w-md mx-auto">
    {/* כותרת */}
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <h4 className="text-sm font-semibold text-blue-900">
        התקדמות לאזור התרגול
      </h4>
    </div>

    {/* הסבר */}
    <p className="text-xs text-blue-800 leading-relaxed">
      סרגל זה משקף את התקדמותך לקראת המעבר לאזור התרגול האקטיבי. 
      למילים קשות יותר משקל רב יותר.
      כמו כן, ניתן להגדיר קצב מעבר אישי בהגדרות האישיות שלך.
    </p>

    {/* קישור להגדרות */}
    <div className="flex justify-center py-2">
      <button
        onClick={onOpenSettings}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md group"
      >
        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        <span>להגדרות האישיות</span>
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default ProgressBar;