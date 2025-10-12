'use client'

import { User, Bell, Lock, Palette, Globe, Shield, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPracticeThreshold, updatePracticeThreshold } from '@/lib/userPreferences';

export default function PersonalSettings({ userId }) {
  const [practiceThreshold, setPracticeThreshold] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // טעינת ההגדרה הנוכחית
  useEffect(() => {
    async function loadThreshold() {
      try {
        const threshold = await getPracticeThreshold(userId);
        setPracticeThreshold(threshold);
      } catch (error) {
        console.error('Error loading threshold:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadThreshold();
  }, [userId]);

  // שמירת ההגדרה
  const handleSaveThreshold = async (newValue) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updatePracticeThreshold(userId, newValue);
      
      if (result.success) {
        setPracticeThreshold(newValue);
        setMessage({ type: 'success', text: 'ההגדרות נשמרו בהצלחה!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'שגיאה בשמירת ההגדרות' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בשמירת ההגדרות' });
    } finally {
      setIsSaving(false);
      // הסתרת ההודעה אחרי 3 שניות
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* הודעת פתיחה */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          כאן תוכל להתאים את ההגדרות האישיות שלך למערכת
        </p>
      </div>

      {/* הודעת הצלחה/שגיאה */}
      {message && (
        <div className={`border rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* הגדרות תרגול */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">הגדרות תרגול</h3>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">טוען...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תדירות מעבר לתרגול אקטיבי
              </label>
              <p className="text-xs text-gray-500 mb-4">
                בחר באיזו תדירות תרצה לעבור לתרגול מעמיק של שמיעה, דיבור, קריאה וכתיבה על המילים שלמדת
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleSaveThreshold(15)}
                  disabled={isSaving}
                  className={`
                    w-full text-right px-5 py-4 rounded-lg border-2 transition-all
                    ${practiceThreshold === 15
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    }
                    ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold mb-1 ${
                        practiceThreshold === 15 ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        תרגול תכוף
                      </div>
                      <div className="text-sm text-gray-600">
                        מעבר מהיר לתרגול מעמיק
                      </div>
                    </div>
                    {practiceThreshold === 15 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => handleSaveThreshold(25)}
                  disabled={isSaving}
                  className={`
                    w-full text-right px-5 py-4 rounded-lg border-2 transition-all
                    ${practiceThreshold === 25
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    }
                    ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold mb-1 ${
                        practiceThreshold === 25 ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        תרגול מאוזן
                      </div>
                      <div className="text-sm text-gray-600">
                        איזון אידיאלי בין למידה לתרגול
                      </div>
                    </div>
                    {practiceThreshold === 25 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => handleSaveThreshold(40)}
                  disabled={isSaving}
                  className={`
                    w-full text-right px-5 py-4 rounded-lg border-2 transition-all
                    ${practiceThreshold === 40
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    }
                    ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold mb-1 ${
                        practiceThreshold === 40 ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        תרגול מרווח
                      </div>
                      <div className="text-sm text-gray-600">
                        למידה מרובה לפני תרגול
                      </div>
                    </div>
                    {practiceThreshold === 40 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* פרופיל */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">פרופיל אישי</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
            <input 
              type="text" 
              placeholder="הזן שם מלא"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
            <input 
              type="email" 
              placeholder="example@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
      </section>

      {/* התראות */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">התראות</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">התראות אימייל</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">התראות SMS</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* פרטיות ואבטחה */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">פרטיות ואבטחה</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full text-right px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
            <span className="text-gray-700">שנה סיסמה</span>
            <Lock className="w-4 h-4 text-gray-500" />
          </button>
          <button className="w-full text-right px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-gray-700">אימות דו-שלבי</span>
          </button>
        </div>
      </section>

      {/* העדפות תצוגה */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">העדפות תצוגה</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ערכת צבעים</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
              <option>בהיר</option>
              <option>כהה</option>
              <option>אוטומטי</option>
            </select>
          </div>
        </div>
      </section>

      {/* שפה ואזור */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">שפה ואזור</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שפת ממשק</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
              <option>עברית</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}