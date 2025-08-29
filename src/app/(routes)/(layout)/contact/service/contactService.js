// פונקציות ולידציה
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Zא-ת\s]+$/;
  if (!name.trim()) {
    return 'שדה השם הוא חובה';
  }
  if (!nameRegex.test(name) || name.trim().length < 2) {
    return 'שדה השם אינו תקין';
  }
  return '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.trim()) {
    return 'שדה האימייל הוא חובה';
  }
  const parts = email.split('@');
  if (!emailRegex.test(email) || (parts[1] && (parts[1].startsWith('.') || parts[1].endsWith('.') || parts[1].includes('..')))) {
    return 'שדה האימייל אינו תקין';
  }
  return '';
};

export const validateSubject = (subject) => {
  if (!subject.trim()) {
    return 'שדה הנושא הוא חובה';
  }
  if (subject.trim().length < 3) {
    return 'שדה הנושא אינו תקין';
  }
  return '';
};

export const validateMessage = (message) => {
  if (!message.trim()) {
    return 'שדה ההודעה הוא חובה';
  }
  if (message.trim().length < 10) {
    return 'שדה ההודעה אינו תקין';
  }
  return '';
};

// פונקציה לוולידציה מלאה של הטופס
export const validateForm = (formData) => {
  const errors = {
    name: validateName(formData.name),
    email: validateEmail(formData.email),
    subject: validateSubject(formData.subject),
    message: validateMessage(formData.message)
  };

  const hasErrors = Object.values(errors).some(error => error !== '');
  return { errors, hasErrors };
};

// פונקציה לסינון תווים לא תקינים
export const filterInput = (name, value) => {
  switch (name) {
    case 'name':
      return value.replace(/[^a-zA-Zא-ת\s]/g, '');
    case 'email':
      return value.replace(/[^a-zA-Z0-9@._-]/g, '');
    default:
      return value;
  }
};

// פונקציה לבדיקת אותיות עברית באימייל
export const hasHebrewInEmail = (value) => {
  return /[א-ת]/.test(value);
};

// פונקציה לשליחת הטופס ל-API
export const submitContactForm = async (formData) => {
  try {
    const response = await fetch('/contact/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: 'ההודעה נשלחה בהצלחה!'
      };
    } else {
      throw new Error(data.message || 'אירעה שגיאה בשליחת ההודעה');
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// פונקציה לוולידציה של שדה יחיד
export const validateField = (name, value) => {
  switch (name) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'subject':
      return validateSubject(value);
    case 'message':
      return validateMessage(value);
    default:
      return '';
  }
};