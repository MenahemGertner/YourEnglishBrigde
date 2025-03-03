// utils.js - פונקציות עזר למדריך
export const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      // גלילה חלקה אל האלמנט
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  export const highlightElement = (elementId) => {
    // הסרת הדגשה מכל האלמנטים הקודמים
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // הוספת הדגשה לאלמנט הנוכחי
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('tour-highlight');
    }
  };
  
  export const saveCurrentStep = (tourId, stepIndex) => {
    localStorage.setItem(`tour_progress_${tourId}`, stepIndex.toString());
  };
  
  export const getCurrentStep = (tourId) => {
    const saved = localStorage.getItem(`tour_progress_${tourId}`);
    return saved ? parseInt(saved, 10) : 0;
  };
  
  export const markTourAsCompleted = (tourId) => {
    localStorage.setItem(`tour_completed_${tourId}`, 'true');
  };
  
  export const isTourCompleted = (tourId) => {
    return localStorage.getItem(`tour_completed_${tourId}`) === 'true';
  };