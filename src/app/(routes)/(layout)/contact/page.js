'use client';

import { useState } from 'react';
import {
  validateField,
  validateForm,
  filterInput,
  hasHebrewInEmail,
  submitContactForm
} from './service/contactService';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = filterInput(name, value);

    if (name === 'email' && hasHebrewInEmail(value)) {
      setWarnings({
        ...warnings,
        email: 'יש להזין אותיות באנגלית בלבד'
      });

      setTimeout(() => {
        setWarnings(prev => ({
          ...prev,
          email: ''
        }));
      }, 3000);
    } else if (name === 'email') {
      setWarnings({
        ...warnings,
        email: ''
      });
    }

    setFormData({
      ...formData,
      [name]: filteredValue
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors: newErrors, hasErrors } = validateForm(formData);
    setErrors(newErrors);

    if (hasErrors) {
      setStatus({
        submitting: false,
        success: false,
        message: 'נא לתקן את השגיאות בטופס'
      });
      return;
    }

    setStatus({ submitting: true, success: null, message: '' });

    const result = await submitContactForm(formData);

    if (result.success) {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setWarnings({});
    }

    setStatus({
      submitting: false,
      success: result.success,
      message: result.message
    });
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="flex justify-center items-center text-3xl font-bold text-center mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">צור קשר</span>
            <span className="mr-2">👋</span>
          </h1>
          <div className="text-center mb-8 leading-relaxed text-gray-700">
            <p className="font-semibold p-2">האתר עדיין בשלבי פיתוח! 🚀</p>
            <p>
              רוצים לשתף חוויות מהאתר? יש לכם רעיונות מגניבים?<br />
              ספרו לנו איך האתר עוזר לכם ללמוד אנגלית!<br />
              כל הערה, שאלה או סתם לומר שלום - אנחנו כאן בשבילכם! 😊
            </p>
          </div>

          {status.message && (
            <div className={`text-center p-3 mb-4 rounded-md ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-right text-gray-700">שם מלא</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-sm text-right">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-right text-gray-700">אימייל</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                dir="ltr"
              />
              {warnings.email && <p className="text-orange-500 text-sm text-right">{warnings.email}</p>}
              {errors.email && <p className="text-red-500 text-sm text-right">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-right text-gray-700">נושא</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.subject && <p className="text-red-500 text-sm text-right">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-right text-gray-700">תוכן ההודעה</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                rows="5"
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm text-right">{errors.message}</p>}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={status.submitting || Object.values(errors).some(error => error !== '')}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 ${status.submitting || Object.values(errors).some(error => error !== '') ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {status.submitting ? 'שולח...' : 'שלח הודעה'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
