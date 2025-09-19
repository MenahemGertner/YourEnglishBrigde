'use client'

import React from 'react';
import Link from 'next/link';
import quizData from './_data/quizData';
import { useQuizEngine } from './hooks/quizEngine';
import formatQuestionText from './helpers/formatQuestionText'

const CheckYourLevel = () => {
  const {
    showIntro,
    testActive,
    showResult,
    currentQuestion,
    questionNumber,
    userLevel,
    levelSuccesses,
    levelFailures,
    handleStartTest,
    handleAnswerSelection
  } = useQuizEngine(quizData);

  // חישוב אחוז ההתקדמות המתוקן
  const calculateProgress = () => {
    // נמצא את מספר ההצלחות וכשלונות המקסימליים באותה רמה
    let maxSuccessesInAnyLevel = 0;
    let maxFailuresInAnyLevel = 0;
    
    for (let level = 1; level <= 6; level++) {
      maxSuccessesInAnyLevel = Math.max(maxSuccessesInAnyLevel, levelSuccesses[level]);
      maxFailuresInAnyLevel = Math.max(maxFailuresInAnyLevel, levelFailures[level]);
    }
    
    // 5 הצלחות = 100%, כל הצלחה שווה 20%
    // 4 כשלונות = 100%, כל כשלון שווה 25%
    const successProgress = Math.min(maxSuccessesInAnyLevel * 20, 100);
    const failureProgress = Math.min(maxFailuresInAnyLevel * 25, 100);
    
    // לוקח את הערך הגבוה מבין השניים (לא מצטבר)
    return Math.max(successProgress, failureProgress);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center">מבדק רמת אנגלית</h1>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-10 space-y-6">
          {showIntro && !testActive && !showResult && (
            <div className="text-center space-y-6">
              <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                להלן שאלון קצר חכם ומקצועי. השאלון כולל מספר שאלות אמריקאיות, שבסיומן תוכל כבר להתחיל ללמוד ולשפר את האנגלית שלך!
              </p>
              <button
                onClick={handleStartTest}
                className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-600 hover:via-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                התחל שאלון
              </button>
            </div>
          )}
          
          {testActive && currentQuestion && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              {/* <span className="text-gray-600">רמה {currentQuestion.level}</span> */}
              {/* Question Section */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 text-left" dir="ltr">
                  {formatQuestionText(currentQuestion.question)}
                </h2>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelection(index)}
                      className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 ease-in-out text-gray-700 hover:text-blue-700 shadow-sm hover:shadow-md"
                      dir="ltr"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {showResult && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">השאלון הסתיים!</h2>
              
              {(() => {
                let message = "";
                let linkUrl = "";
                
                if (userLevel === 0) {
                  message = "נראה שאתה מתחיל. נתחיל מיסודות השפה.";
                  linkUrl = "/underConstruction";
                } else if (userLevel > 0 && userLevel < 6) {
                  message = `יש לך בסיס טוב! נעזור לך להתקדם לרמה הבאה.`;
                  linkUrl = `/words?index=${userLevel*300-299}&category=${userLevel*300}`;
                } else if (userLevel === 6) {
                  message = "מעולה! יש לך שליטה מצוינת באנגלית, תוכל להמשיך לרמת 'מתקדמים'!";
                  linkUrl = "/underConstruction";
                }
                
                return (
                  <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                    <p className="text-xl font-semibold mb-4 text-gray-800">
                      {userLevel === 0 
                        ? "הרמה שלך היא רמת 'מתחילים'" 
                        : userLevel === 6 
                          ? "הרמה שלך היא רמת 'מתקדמים'" 
                          : `הרמה שלך היא רמה ${userLevel}`}
                    </p>
                    <p className="text-gray-600 mb-4">{message}</p>
                    
                    {/* הערה על גמישות בבחירת רמה */}
                    <div className="bg-blue-50 border-r-4 border-blue-400 p-4 mb-6 rounded">
                      <p className="text-sm text-blue-700">
                        {userLevel === 0 
                          ? "רמת 'מתחילים' היא המומלצת עבורך, אך תוכל בהמשך להחליף רמה בכל עת."
                          : userLevel === 6 
                            ? "רמת 'מתקדמים' היא המומלצת עבורך, אך תוכל בהמשך להחליף רמה בכל עת."
                            : `רמה ${userLevel} היא המומלצת עבורך, אך תוכל בהמשך להחליף רמה בכל עת.`}
                      </p>
                    </div>
                    
                    <Link
                      href={linkUrl}
                      className="inline-block bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-600 hover:via-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                      התחל בלימוד
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckYourLevel;