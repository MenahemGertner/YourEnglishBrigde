// app/(routes)/(games)/prepositions/components/FeedbackModal.jsx

export default function FeedbackModal({ feedback, onContinue }) {
  if (!feedback) return null;

  const { isCorrect, message, explanation, earnedPoints } = feedback;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`
          bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8
          transform transition-all duration-300
          ${isCorrect ? 'border-4 border-green-500' : 'border-4 border-red-500'}
        `}
      >
        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {isCorrect ? '✅' : '❌'}
          </div>
          <h2
            className={`text-3xl font-bold ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? 'נכון!' : 'לא נכון'}
          </h2>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-xl text-gray-700 mb-2">{message}</p>
          
          {/* Points earned (if correct) */}
          {isCorrect && earnedPoints > 0 && (
            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-lg mt-2">
              +{earnedPoints} נקודות
            </div>
          )}
        </div>

        {/* Explanation (if wrong) */}
        {!isCorrect && explanation && (
          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 mb-6 text-right">
            <p className="text-gray-800 leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className={`
            w-full py-4 rounded-xl font-bold text-lg
            transition-all duration-200
            ${
              isCorrect
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            hover:scale-105 active:scale-95 shadow-lg
          `}
        >
          המשך →
        </button>
      </div>
    </div>
  );
}