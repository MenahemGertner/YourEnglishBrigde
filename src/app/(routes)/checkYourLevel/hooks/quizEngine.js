'use client'

import { useState, useEffect } from 'react';

export const useQuizEngine = (quizData) => {
  // States for test management
  const [showIntro, setShowIntro] = useState(true);
  const [testActive, setTestActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userLevel, setUserLevel] = useState(null);
  
  // Test logic state
  const [currentLevel, setCurrentLevel] = useState(3); // Start at level 3
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  
  // Track success and failure counts for each level
  const [levelSuccesses, setLevelSuccesses] = useState({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});
  const [levelFailures, setLevelFailures] = useState({1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0});

  // Start the test
  const handleStartTest = () => {
    setShowIntro(false);
    setTestActive(true);
    getNextQuestion();
  };

  // Get a new question based on current level
  const getNextQuestion = (level = currentLevel) => {
    const levelKey = `level${level}`;
    const questionsAtLevel = quizData[levelKey];
    
    // Filter out questions that have already been asked
    const availableQuestions = questionsAtLevel.filter((_, index) => 
      !askedQuestions.has(`${levelKey}-${index}`)
    );
    
    // If all questions at this level have been asked, choose a random one anyway
    let questionIndex;
    if (availableQuestions.length === 0) {
      questionIndex = Math.floor(Math.random() * questionsAtLevel.length);
    } else {
      // Choose a random question from available ones
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      questionIndex = questionsAtLevel.indexOf(randomQuestion);
    }
    
    // Update asked questions
    const newAskedQuestions = new Set(askedQuestions);
    newAskedQuestions.add(`${levelKey}-${questionIndex}`);
    setAskedQuestions(newAskedQuestions);
    
    // Set the current question
    setCurrentQuestion({
      ...questionsAtLevel[questionIndex],
      level: level,
      questionId: `${levelKey}-${questionIndex}`
    });
    
    setQuestionNumber(prev => prev + 1);
  };

  // Check if test should end based on the new criteria
  const checkTestCompletion = (updatedSuccesses, updatedFailures) => {
    // Check if any level has 3 successes
    for (let level = 1; level <= 6; level++) {
      if (updatedSuccesses[level] >= 5) {
        setUserLevel(level);
        setTestActive(false);
        setShowResult(true);
        return true;
      }
    }
    
    // Check if any level has 4 failures
    for (let level = 1; level <= 6; level++) {
      if (updatedFailures[level] >= 4) {
        // Set level to one below the failed level (minimum is 0)
        setUserLevel(Math.max(0, level - 1));
        setTestActive(false);
        setShowResult(true);
        return true;
      }
    }
    
    return false; // Test should continue
  };

  // Handle when user selects an answer
  const handleAnswerSelection = (selectedIndex) => {
    // Check if answer is correct
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    const questionLevel = currentQuestion.level;
    
    // Create updated copies of the success and failure counts
    const updatedSuccesses = { ...levelSuccesses };
    const updatedFailures = { ...levelFailures };
    
    // Update success or failure count for this level
    if (isCorrect) {
      updatedSuccesses[questionLevel] = updatedSuccesses[questionLevel] + 1;
      setLevelSuccesses(updatedSuccesses);
    } else {
      updatedFailures[questionLevel] = updatedFailures[questionLevel] + 1;
      setLevelFailures(updatedFailures);
    }
    
    // Check if test should end based on criteria BEFORE changing the level
    const testShouldEnd = checkTestCompletion(updatedSuccesses, updatedFailures);
    
    // If test should end, don't continue
    if (testShouldEnd) {
      return;
    }
    
    // Calculate the new level for the next question based on the answer
    let newLevel = questionLevel;
    if (isCorrect) {
      // If correct, move to higher level (unless at max)
      if (questionLevel < 6) {
        newLevel = questionLevel + 1;
      }
    } else {
      // If incorrect, move to lower level (unless at min)
      if (questionLevel > 1) {
        newLevel = questionLevel - 1;
      }
    }
    
    // Set the new level for the next question
    setCurrentLevel(newLevel);
    
    // Get the next question
    getNextQuestion(newLevel);
  };

  return {
    showIntro,
    testActive,
    showResult,
    currentQuestion,
    questionNumber,
    userLevel,
    currentLevel,
    handleStartTest,
    handleAnswerSelection
  };
};