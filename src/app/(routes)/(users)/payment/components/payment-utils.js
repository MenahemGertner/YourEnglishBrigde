// payment-utils.js
// פונקציות חישוב מרכזיות למערכת התשלומים

/**
 * הגדרות תשלומים לכל תכנית
 * ניתן לשנות בקלות את מספר התשלומים המקסימלי
 */
export const PAYMENT_CONFIG = {
  'Intensive': {
    maxInstallments: 3,
    options: [1, 2, 3]
  },
  'Premium': {
    maxInstallments: 6,
    options: [1, 2, 3, 4, 5, 6]
  },
  'Free Trial': {
    maxInstallments: 1,
    options: [1]
  }
};

/**
 * חישוב מדויק של פירוט תשלומים
 * @param {number} basePrice - המחיר הבסיסי המלא
 * @param {number} numInstallments - מספר התשלומים
 * @returns {object} פירוט מלא של התשלומים
 */
export function calculatePayments(basePrice, numInstallments = 1) {
  // תשלום מלא
  if (numInstallments === 1) {
    return {
      firstPayment: basePrice,
      regularPayment: 0,
      totalPayments: numInstallments,
      totalAmount: basePrice,
      breakdown: [basePrice]
    };
  }

  // פריסה למספר תשלומים
  // התשלומים 2-n יהיו שווים (עיגול למטה)
  const regularPayment = Math.floor(basePrice / numInstallments);
  
  // התשלום הראשון מקבל את השארית כדי להגיע למחיר מדויק
  const totalRegularPayments = regularPayment * (numInstallments - 1);
  const firstPayment = basePrice - totalRegularPayments;

  // יצירת מערך עם כל התשלומים
  const breakdown = [firstPayment, ...Array(numInstallments - 1).fill(regularPayment)];

  return {
    firstPayment,
    regularPayment,
    totalPayments: numInstallments,
    totalAmount: basePrice,
    breakdown
  };
}

/**
 * קבלת אפשרויות תשלום עבור תכנית
 * @param {string} planType - סוג התכנית
 * @returns {object} הגדרות התשלום
 */
export function getPaymentOptions(planType) {
  return PAYMENT_CONFIG[planType] || PAYMENT_CONFIG['Free Trial'];
}

/**
 * אימות שמספר התשלומים תקין לתכנית
 * @param {string} planType - סוג התכנית
 * @param {number} numInstallments - מספר התשלומים
 * @returns {boolean}
 */
export function isValidInstallmentCount(planType, numInstallments) {
  const config = getPaymentOptions(planType);
  return config.options.includes(numInstallments);
}

/**
 * פורמט מחיר לתצוגה
 * @param {number} price - המחיר
 * @returns {string} מחיר מפורמט
 */
export function formatPrice(price) {
  return `₪${price.toLocaleString('he-IL')}`;
}

/**
 * יצירת תיאור תשלום
 * @param {number} numInstallments - מספר התשלומים
 * @returns {string}
 */
export function getPaymentDescription(numInstallments) {
  if (numInstallments === 1) {
    return 'תשלום מלא - חיוב חד פעמי';
  }
  return `פריסה ל-${numInstallments} תשלומים - ללא ריבית`;
}

/**
 * חישוב תאריכי תשלומים עתידיים
 * @param {number} numInstallments - מספר התשלומים
 * @returns {array} מערך של תאריכים
 */
export function calculatePaymentDates(numInstallments) {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < numInstallments; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() + i);
    dates.push(date);
  }
  
  return dates;
}