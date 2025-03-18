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
    handleStartTest,
    handleAnswerSelection
  } = useQuizEngine(quizData);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 items-center justify-center space-y-6 text-center p-4 my-8">
      <h1 className="text-3xl font-bold mb-16">מבדק רמת אנגלית</h1>
      
      {showIntro && !testActive && !showResult && (
        <div className="space-y-6">
          <p className="text-lg mb-4 px-20">להלן שאלון קצר ומקצועי. השאלון כולל מספר שאלות אמריקאיות, שבסיומן תוכל כבר להתחיל ללמוד ולשפר את האנגלית שלך!</p>
          <button
            onClick={handleStartTest}
            className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 hover:shadow-lg text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            התחל שאלון
          </button>
        </div>
      )}
      
      {testActive && currentQuestion && (
        <div className="w-full max-w-2xl space-y-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">שאלה {questionNumber} </span>
            <span className="text-gray-600">רמה {currentQuestion.level}</span>
          </div>
          
          {/* כאן השינוי - השתמש בפונקצית העיצוב במקום להציג ישירות את השאלה */}
          <h2 className="text-xl font-semibold mb-4 text-left" dir="ltr">
            {formatQuestionText(currentQuestion.question)}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(index)}
                className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-blue-50 transition-colors"
                dir="ltr"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showResult && (
        <div className="space-y-6 max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">השאלון הסתיים!</h2>
          
          
          {(() => {
  let message = "";
  let linkUrl = "";
  
  if (userLevel === 0) {
    message = "נראה שאתה מתחיל. נתחיל מיסודות השפה.";
    linkUrl = "/underConstruction";
  } else if (userLevel > 0 && userLevel < 6) {
    message = `יש לך בסיס טוב! נעזור לך להתקדם לרמה הבאה.`;
    linkUrl = `/words?index=${userLevel*500-499}&category=${userLevel*500}`;
  } else if (userLevel === 6) {
    message = "מעולה! יש לך שליטה מצוינת באנגלית, תוכל להמשיך לרמת 'מתקדמים'!";
    linkUrl = "/underConstruction";
  }
  
  return (
    <div>
      <p className="text-xl mb-6">
        {userLevel === 0 
          ? "הרמה שלך היא רמת 'מתחילים'" 
          : userLevel === 6 
            ? "הרמה שלך היא רמת 'מתקדמים'" 
            : `הרמה שלך היא רמה ${userLevel}`}
      </p>
      <p className="text-gray-600 mb-6">{message}</p>
      <Link
        href={linkUrl}
        className="inline-block bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 hover:shadow-lg text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
      >
        התחל בלימוד
      </Link>
    </div>
  );
})()}
        </div>
      )}
    </div>
  );
};

export default CheckYourLevel;