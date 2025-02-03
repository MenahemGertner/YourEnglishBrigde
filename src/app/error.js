'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // דוגמה לתיעוד שגיאות בשירות חיצוני
    logErrorToService(error);
  }, [error]);

  // פונקציה לתיעוד שגיאות
  const logErrorToService = (error) => {
    // כאן יכול להיות חיבור ל-Sentry או שירות אחר
    console.error('Error logged:', error);
  };

  // פונקציה לניתוח סוג השגיאה והצגת תוכן מותאם
  const getErrorContent = () => {
    // שגיאת אימות
    if (error.name === 'AuthError' || error.message?.includes('unauthorized')) {
      return {
        title: 'שגיאת הרשאות',
        message: 'נא להתחבר מחדש למערכת',
        action: () => router.push('/login')
      };
    }

    // שגיאת רשת
    if (error.name === 'NetworkError' || !window.navigator.onLine) {
      return {
        title: 'שגיאת תקשורת',
        message: 'נא לבדוק את חיבור האינטרנט',
        action: reset
      };
    }

    // שגיאה כללית
    return {
      title: 'שגיאה לא צפויה',
      message: 'אירעה שגיאה במערכת',
      action: reset
    };
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {errorContent.title}
        </h2>
        <div className="mb-4">
          <p className="text-gray-700">
            {errorContent.message}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                {error.stack}
              </pre>
              <p className="mt-2 text-sm text-gray-600">
                Error Type: {error.name}<br />
                Status: {error.status || 'N/A'}
              </p>
            </div>
          )}
        </div>
        <div className="space-x-4 rtl:space-x-reverse">
          <button
            onClick={errorContent.action}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {errorContent.action === reset ? 'נסה שוב' : 'חזור לדף הבית'}
          </button>
          {errorContent.action !== reset && (
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              נסה שוב
            </button>
          )}
        </div>
      </div>
    </div>
  );
}