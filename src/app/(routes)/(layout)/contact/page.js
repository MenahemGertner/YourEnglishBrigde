'use client'

import { useState } from 'react';

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
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null, message: '' });
    
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
        // איפוס הטופס לאחר שליחה מוצלחת
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus({
          submitting: false,
          success: true,
          message: 'ההודעה נשלחה בהצלחה!'
        });
      } else {
        throw new Error(data.message || 'אירעה שגיאה בשליחת ההודעה');
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        message: error.message
      });
    }
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
    רוצים לשתף חוויות מהאתר? יש לכם רעיונות מגניבים?<br/>
    ספרו לנו איך האתר עוזר לכם ללמוד אנגלית!<br/>
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
              <label htmlFor="name" className="block text-right text-gray-700">
                שם מלא
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-right text-gray-700">
                אימייל
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-right text-gray-700">
                נושא
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-right text-gray-700">
                תוכן ההודעה
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={status.submitting}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 ${status.submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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