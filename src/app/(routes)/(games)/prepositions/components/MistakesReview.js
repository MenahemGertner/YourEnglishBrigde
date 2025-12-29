// app/(routes)/(games)/prepositions/components/MistakesReview.jsx

import { getExplanation } from '../lib/explanations';

export default function MistakesReview({ mistakes, levelCompleted }) {
  // ✅ תיקון: הצג "מושלם" רק אם אין טעויות והמשחק הושלם
  if ((!mistakes || mistakes.length === 0) && levelCompleted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="text-2xl font-bold text-green-700 mb-2">מושלם!</h3>
        <p className="text-gray-700">לא עשית אף טעות במשחק הזה!</p>
      </div>
    );
  }

  // ✅ אם אין טעויות אבל המשחק לא הושלם - אל תציג כלום
  if (!mistakes || mistakes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📚</span>
        <span>הטעויות שלך - למידה לעתיד</span>
      </h3>
      <p className="text-gray-600 mb-6">
        סקור את הטעויות הבאות כדי לשפר את הידע שלך:
      </p>

      <div className="space-y-4">
        {mistakes.map((mistake, index) => {
          // Only get detailed explanation for single blank mistakes
          const detailedExplanation = !Array.isArray(mistake.correctAnswer)
            ? getExplanation(mistake.correctAnswer, mistake.category)
            : null;

          return (
            <div
              key={index}
              className="border-r-4 border-red-500 bg-red-50 p-4 rounded-lg"
            >
             {/* Sentence with mistake crossed out and correct answer highlighted */}
              <div className="mb-3" dir='ltr'>
                <p className="text-lg text-gray-800 font-medium leading-relaxed">
                  {Array.isArray(mistake.wrongAnswer) ? (
                    // For multiple blanks, show original sentence
                    mistake.sentence
                  ) : (
                    // For single blank, show crossed-out mistake and highlighted correct answer
                    <>
                      {mistake.sentence.split('___')[0]}
                      <span className="inline-flex items-center gap-2 mx-1">
                        <span className="line-through text-red-500 text-sm opacity-75">
                          {mistake.wrongAnswer}
                        </span>
                        <span className="font-bold text-green-600 text-xl px-2 py-0.5 bg-green-50 rounded">
                          {mistake.correctAnswer}
                        </span>
                      </span>
                      {mistake.sentence.split('___')[1]}
                    </>
                  )}
                </p>
              </div>

              {/* Wrong vs Correct */}
              <div className="flex flex-col gap-2 mb-3 text-sm">
                {Array.isArray(mistake.wrongAnswer) ? (
                  // Multiple blanks
                  mistake.wrongAnswer.map((wrong, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="text-gray-600">חלל {idx + 1}:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">❌ בחרת:</span>
                        <span className="font-bold text-red-700">{wrong}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅ נכון:</span>
                        <span className="font-bold text-green-700">
                          {Array.isArray(mistake.correctAnswer) 
                            ? mistake.correctAnswer[idx] 
                            : mistake.correctAnswer}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Single blank
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">❌ בחרת:</span>
                      <span className="font-bold text-red-700">{mistake.wrongAnswer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅ נכון:</span>
                      <span className="font-bold text-green-700">{mistake.correctAnswer}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 border-r-2 border-blue-400 p-3 rounded">
                <p className="text-gray-700 mb-2">{mistake.explanation}</p>
                
                {/* Additional detailed explanation - only for single blank */}
                {!Array.isArray(mistake.correctAnswer) && detailedExplanation && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>כלל:</strong> {detailedExplanation.rule}
                    </p>
                    {detailedExplanation.examples && (
                      <p className="text-sm text-gray-600">
                        <strong>דוגמאות:</strong> {detailedExplanation.examples.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}