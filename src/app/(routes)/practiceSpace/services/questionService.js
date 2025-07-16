// questionService.js
class QuestionService {
    constructor() {
        this.apiEndpoint = '/practiceSpace/api/generate-question';
    }

    // פונקציה לערבוב מערך
    shuffleArray(array) {
        const shuffled = [...array];
        
        for (let round = 0; round < 5; round++) {
            for (let i = 0; i < shuffled.length; i++) {
                const randomIndex = Math.floor(Math.random() * shuffled.length);
                [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
            }
        }
        
        return shuffled;
    }

    // פונקציה לעיבוד השאלה וערבוב התשובות
    processQuestion(questionData) {
        if (!questionData || !questionData.options || !questionData.correctAnswer) {
            return questionData;
        }

        const correctAnswer = questionData.correctAnswer;
        const shuffledOptions = this.shuffleArray(questionData.options);
        
        return {
            ...questionData,
            options: shuffledOptions,
            correctAnswer: correctAnswer
        };
    }

    // פונקציה ליצירת שאלה חדשה
    async generateQuestion(sentences) {
        if (!sentences || !Array.isArray(sentences) || sentences.length === 0) {
            throw new Error('משפטים לא תקינים');
        }

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentences }),
            });

            if (!response.ok) {
                throw new Error('שגיאה ביצירת השאלה');
            }

            const data = await response.json();
            return this.processQuestion(data.question);
        } catch (error) {
            throw new Error(`שגיאה ביצירת השאלה: ${error.message}`);
        }
    }

    // פונקציה לבדיקת תשובה
    checkAnswer(selectedAnswer, correctAnswer) {
        if (!selectedAnswer || !correctAnswer) {
            return {
                isCorrect: false,
                message: 'אנא בחר תשובה'
            };
        }

        const isCorrect = selectedAnswer === correctAnswer;
        
        return {
            isCorrect,
            message: isCorrect 
                ? 'כל הכבוד! התשובה נכונה' 
                : `התשובה שגויה. התשובה הנכונה היא: ${correctAnswer}`
        };
    }

    // פונקציה לוולידציה של הסיפור
    validateStory(story) {
        if (!story || !story.sentences || !Array.isArray(story.sentences)) {
            return {
                isValid: false,
                message: 'אנא קרא קודם את הסיפור כדי להמשיך לתרגיל הבנת הנקרא'
            };
        }

        if (story.sentences.length === 0) {
            return {
                isValid: false,
                message: 'הסיפור ריק'
            };
        }

        return {
            isValid: true,
            message: 'הסיפור תקין'
        };
    }

    // פונקציה להמרת משפטים לאנגלית
    extractEnglishSentences(story) {
        if (!story || !story.sentences) {
            return [];
        }

        return story.sentences.map(sentence => sentence.english).filter(Boolean);
    }
}

// יצירת instance יחיד של השירות
const questionService = new QuestionService();

export default questionService;