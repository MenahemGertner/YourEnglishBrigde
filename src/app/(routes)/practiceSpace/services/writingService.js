// writingService.js - גרסה משופרת
class WritingService {
    /**
     * בדיקת טקסט אנגלית
     */
    static isEnglishText(text) {
        const englishRegex = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
        return englishRegex.test(text);
    }

    /**
     * ולידציה של הקלט
     */
    static validateInput(value) {
        if (!value.trim()) {
            return '';
        }

        if (!this.isEnglishText(value)) {
            return 'אנא כתוב באנגלית בלבד';
        }

        if (!/^[A-Z]/.test(value.trim())) {
            return 'המשפט צריך להתחיל באות גדולה';
        }

        return '';
    }

    /**
     * בדיקת התשובה דרך API
     */
    static async checkWriting(sentence, difficultWords = []) {
        if (!sentence.trim()) {
            throw new Error('אנא כתוב משפט לפני הבדיקה');
        }

        try {
            const response = await fetch('/practiceSpace/api/check-writing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sentence: sentence.trim(),
                    difficultWords: difficultWords
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.feedback || !result.feedback.feedback) {
                throw new Error('Invalid response format from API');
            }

            return result.feedback;

        } catch (error) {
            console.error('Error checking writing:', error);
            
            let errorMessage = 'אירעה שגיאה בבדיקת התשובה. נסה שוב.';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'בעיה בחיבור לשרת. אנא בדוק את החיבור לאינטרנט ונסה שוב.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'הבדיקה נמשכת יותר מדי זמן. נסה שוב.';
            } else if (error.message.startsWith('אנא')) {
                errorMessage = error.message;
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * קביעת סוג הפידבק על בסיס התשובה - מערכת 3 רמות משופרת
     */
    static getFeedbackType(apiResponse) {
        const { score, hasErrors, errorCount = 0, positivePoints = 0 } = apiResponse;

        // אם המשפט מצוין (ללא שגיאות או עם שגיאה קטנה אחת בלבד)
        if (score === 'excellent' || (score === 'good' && (!hasErrors || errorCount <= 1))) {
            return 'success';
        }
        
        // אם יש כמה שגיאות אבל גם דברים חיוביים
        if ((score === 'good' || score === 'fair') && hasErrors && errorCount <= 3) {
            return 'warning';
        }
        
        // בכל מקרה אחר - צריך שיפור משמעותי
        return 'info';
    }

    /**
     * בדיקה מלאה של המשפט
     */
    static async performFullCheck(sentence, difficultWords = []) {
        const validationError = this.validateInput(sentence);
        if (validationError) {
            throw new Error(validationError);
        }

        const apiResponse = await this.checkWriting(sentence, difficultWords);
        const feedbackType = this.getFeedbackType(apiResponse);

        return {
            feedback: apiResponse.feedback,
            feedbackType: feedbackType,
            apiResponse: apiResponse
        };
    }
}

export default WritingService;