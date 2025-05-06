'use client'
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [wordNumber, setWordNumber] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState(''); // 'success' או 'error'
  const [wordNumberError, setWordNumberError] = useState('');
  
  // יצירת רפרנס לחלונית המשוב
  const feedbackPanelRef = useRef(null);
  
  // טיפול בלחיצות מחוץ לחלונית
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen && 
        feedbackPanelRef.current && 
        !feedbackPanelRef.current.contains(event.target) &&
        // לוודא שהלחיצה לא הייתה על כפתור הפתיחה/סגירה עצמו
        !event.target.closest('button[data-feedback-toggle]')
      ) {
        setIsOpen(false);
      }
    }
    
    // הוספת מאזין לאירועי לחיצה בחלון
    document.addEventListener('mousedown', handleClickOutside);
    
    // ניקוי המאזין בעת פירוק הקומפוננטה
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleFeedback = () => {
    setIsOpen(!isOpen);
    // איפוס הודעות פידבק בפתיחה מחדש
    if (!isOpen) {
      setFeedbackMessage('');
      setFeedbackStatus('');
      setWordNumberError('');
    }
  };

  // פונקציה לבדיקת תקינות מספר המילה
  const validateWordNumber = (value) => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      return 'יש להזין מספר בלבד';
    }
    
    if (numValue < 1 || numValue > 2500) {
      return 'המספר חייב להיות בין 1 ל-2500';
    }
    
    return '';
  };

  // טיפול בשינוי ערך בשדה מספר המילה
  const handleWordNumberChange = (e) => {
    const value = e.target.value;
    
    // מאפשר רק מספרים והשארת שדה ריק
    if (value === '' || /^[0-9]+$/.test(value)) {
      setWordNumber(value);
      // בדיקת תקינות רק אם יש ערך
      if (value) {
        setWordNumberError(validateWordNumber(value));
      } else {
        setWordNumberError('');
      }
    }
  };

  const handleSubmit = async () => {
    // בדיקת תקינות מספר המילה
    const wordNumberValidationError = validateWordNumber(wordNumber);
    if (wordNumberValidationError) {
      setWordNumberError(wordNumberValidationError);
      return;
    }
    
    // בדיקה שכל השדות מלאים
    if (!wordNumber.trim() || !errorDesc.trim()) {
      setFeedbackMessage('נא למלא את כל השדות');
      setFeedbackStatus('error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/words/card/feedbackButton/api/reportError', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordNumber: wordNumber.trim(),
          errorDescription: errorDesc.trim()
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFeedbackMessage(data.message);
        setFeedbackStatus('success');
        
        // איפוס הטופס לאחר שליחה מוצלחת
        setWordNumber('');
        setErrorDesc('');
        setWordNumberError('');
        
        // סגירת החלון לאחר הצלחה (אופציונלי - אפשר להוריד אם רוצים להציג את הודעת ההצלחה)
        setTimeout(() => {
          setIsOpen(false);
          setFeedbackMessage('');
        }, 3000);
      } else {
        setFeedbackMessage(data.message || 'אירעה שגיאה בשליחת הדיווח');
        setFeedbackStatus('error');
      }
    } catch (error) {
      console.error('שגיאה בשליחת דיווח הטעות:', error);
      setFeedbackMessage('אירעה שגיאה בשליחת הדיווח');
      setFeedbackStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-0 z-50 font-sans" dir="rtl">
      {/* כפתור המשוב הקבוע */}
      <button
        onClick={toggleFeedback}
        data-feedback-toggle="true"
        className={`flex items-center justify-center rounded-r p-3 shadow-lg transition-all ${
          isOpen ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-blue-400 to-purple-400 text-white'
        }`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageSquare size={20} className="ml-2" />
            <span className="text-sm font-medium">מצאת טעות?</span>
          </>
        )}
      </button>

      {/* חלונית המשוב */}
      {isOpen && (
        <div 
          ref={feedbackPanelRef}
          className="absolute bottom-16 left-0 w-64 rounded-lg bg-white p-4 shadow-xl"
        >
          <h3 className="mb-3 text-lg font-bold text-gray-800">דיווח על טעות</h3>
          
          {feedbackMessage && (
            <div 
              className={`mb-3 rounded-md p-2 text-sm ${
                feedbackStatus === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {feedbackMessage}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="wordNumber" className="mb-1 block text-sm font-medium text-gray-700">
              מה מספר המילה? 
            </label>
            <input
              type="text"
              id="wordNumber"
              value={wordNumber}
              onChange={handleWordNumberChange}
              className={`w-full rounded-md border p-2 text-sm focus:outline-none ${
                wordNumberError 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              disabled={isSubmitting}
              placeholder="הזן מספר בין 1 ל-2500"
            />
            {wordNumberError && (
              <p className="mt-1 text-xs text-red-600">{wordNumberError}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="errorDesc" className="mb-1 block text-sm font-medium text-gray-700">
              מה הטעות שמצאת?
            </label>
            <textarea
              id="errorDesc"
              value={errorDesc}
              onChange={(e) => setErrorDesc(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !!wordNumberError}
            className={`w-full rounded-md py-2 text-sm font-medium text-white focus:outline-none ${
              isSubmitting || !!wordNumberError
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
          >
            {isSubmitting ? 'שולח...' : 'שלח'}
          </button>
        </div>
      )}
    </div>
  );
}