// writingService.js
class WritingService {
    /**
     * בדיקת טקסט אנגלית
     * @param {string} text - הטקסט לבדיקה
     * @returns {boolean} - האם הטקסט באנגלית
     */
    static isEnglishText(text) {
        // בדיקה בסיסית - רק תווים לטיניים, מספרים, רווחים וסימני פיסוק
        const englishRegex = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
        return englishRegex.test(text);
    }

    /**
     * ולידציה של הקלט
     * @param {string} value - הערך לולידציה
     * @returns {string} - הודעת שגיאה או מחרוזת רק אם יש שגיאה
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
     * @param {string} sentence - המשפט לבדיקה
     * @param {Array} difficultWords - מילים קשות (אופציונלי)
     * @returns {Promise<Object>} - תוצאת הבדיקה
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
            
            // טיפול בשגיאות ספציפיות
            let errorMessage = 'אירעה שגיאה בבדיקת התשובה. נסה שוב.';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'בעיה בחיבור לשרת. אנא בדוק את החיבור לאינטרנט ונסה שוב.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'הבדיקה נמשכת יותר מדי זמן. נסה שוב.';
            } else if (error.message.startsWith('אנא')) {
                // זו שגיאת ולידציה שלנו
                errorMessage = error.message;
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * קביעת סוג הפידבק על בסיס התשובה
     * @param {Object} apiResponse - התשובה מה-API
     * @returns {string} - סוג הפידבק: 'success', 'error', 'info'
     */
    static getFeedbackType(apiResponse) {
        if (apiResponse.score === 'good' && !apiResponse.hasErrors) {
            return 'success';
        } else if (apiResponse.hasErrors) {
            return 'error';
        } else {
            return 'info';
        }
    }

    /**
     * בדיקה מלאה של המשפט - משלבת ולידציה ובדיקה
     * @param {string} sentence - המשפט לבדיקה
     * @param {Array} difficultWords - מילים קשות
     * @returns {Promise<Object>} - תוצאת הבדיקה המלאה
     */
    static async performFullCheck(sentence, difficultWords = []) {
        // בדיקת ולידציה מקדימה
        const validationError = this.validateInput(sentence);
        if (validationError) {
            throw new Error(validationError);
        }

        // בדיקה דרך API
        const apiResponse = await this.checkWriting(sentence, difficultWords);
        
        // קביעת סוג הפידבק
        const feedbackType = this.getFeedbackType(apiResponse);

        return {
            feedback: apiResponse.feedback,
            feedbackType: feedbackType,
            apiResponse: apiResponse
        };
    }
}

export default WritingService;