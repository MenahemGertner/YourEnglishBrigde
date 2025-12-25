// app/(routes)/(games)/prepositions/components/SentenceDisplay.jsx

export default function SentenceDisplay({ sentence, currentBlankIndex = 0, selectedAnswers = [] }) {
  if (!sentence) return null;

  // Split sentence by the blank (___) and render with highlighted gap
  const parts = sentence.split('___');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="text-center">
        <p className="text-3xl font-medium text-gray-800 leading-relaxed">
          {parts.map((part, index) => (
            <span key={index}>
              {part}
              {index < parts.length - 1 && (
                <span 
                  className={`inline-block mx-2 px-6 py-2 border-b-4 min-w-[80px] transition-all
                    ${index === currentBlankIndex 
                      ? 'border-blue-500 border-dashed animate-pulse' 
                      : index < currentBlankIndex
                        ? 'border-green-500 border-solid bg-green-50'
                        : 'border-gray-300 border-dashed'
                    }
                  `}
                >
                  {selectedAnswers[index] || '___'}
                </span>
              )}
            </span>
          ))}
        </p>
        
        {/* Progress indicator for multiple blanks */}
        {parts.length > 2 && (
          <div className="mt-4 text-sm text-gray-600">
            ממלא חלל {currentBlankIndex + 1} מתוך {parts.length - 1}
          </div>
        )}
      </div>
    </div>
  );
}