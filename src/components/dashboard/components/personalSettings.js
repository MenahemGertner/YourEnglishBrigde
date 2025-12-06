'use client'

import { Target, BookOpen, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { 
  getPracticeThreshold, 
  updatePracticeThreshold, 
  getStoryLevel, 
  updateStoryLevel,
  getInflectionViewMode,
  updateInflectionViewMode 
} from '@/lib/userPreferences';

export default function PersonalSettings({ userId, scrollToStoryLevel, onScrollComplete }) {
  const [practiceThreshold, setPracticeThreshold] = useState(25);
  const [storyLevel, setStoryLevel] = useState(3);
  const [inflectionViewMode, setInflectionViewMode] = useState('practice');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const storyLevelRef = useRef(null);

  // טעינת ההגדרות הנוכחיות
  useEffect(() => {
    async function loadSettings() {
      try {
        const [threshold, level, viewMode] = await Promise.all([
          getPracticeThreshold(userId),
          getStoryLevel(userId),
          getInflectionViewMode(userId)
        ]);
        setPracticeThreshold(threshold);
        setStoryLevel(level);
        setInflectionViewMode(viewMode);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [userId]);

  // גלילה לאזור רמת הסיפור
  useEffect(() => {
    if (scrollToStoryLevel && !isLoading && storyLevelRef.current) {
      const timer = setTimeout(() => {
        storyLevelRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        onScrollComplete?.();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [scrollToStoryLevel, isLoading, onScrollComplete]);

  // שמירת סף תרגול
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
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // שמירת רמת סיפור
  const handleSaveStoryLevel = async (newLevel) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateStoryLevel(userId, newLevel);
      
      if (result.success) {
        setStoryLevel(newLevel);
        localStorage.setItem(`story_level_${userId}`, newLevel.toString());
        setMessage({ type: 'success', text: 'רמת הסיפור עודכנה בהצלחה!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'שגיאה בשמירת ההגדרות' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בשמירת ההגדרות' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // שמירת מצב תצוגת הטיות
  const handleSaveInflectionMode = async (newMode) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateInflectionViewMode(userId, newMode);
      
      if (result.success) {
        setInflectionViewMode(newMode);
        setMessage({ type: 'success', text: 'מצב תצוגת ההטיות עודכן בהצלחה!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'שגיאה בשמירת ההגדרות' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בשמירת ההגדרות' });
    } finally {
      setIsSaving(false);
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
                תדירות הצגת אזור התרגול האקטיבי
              </label>
              <p className="text-xs text-gray-500 mb-4">
                בחר באיזו תדירות תרצה לעבור מלימוד מילים חדשות, לתרגול מעמיק של שמיעה, דיבור, קריאה וכתיבה על המילים שלמדת.
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
                        תרגול אינטנסיבי להטמעה מירבית
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
                        שינון מילים ומעבר לתרגול באופן מאוזן (מומלץ!)
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
                        למידה רציפה יותר של מילים חדשות ופחות תרגול
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

      {/* הגדרות תצוגת הטיות - חדש! */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">תצוגת הטיות ומשפטים</h3>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">טוען...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מצב תצוגה מועדף
              </label>
              <p className="text-xs text-gray-500 mb-4">
                בחר איך תרצה לראות את ההטיות והמשפטים כברירת מחדל כשאתה פותח כרטיס מילה.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleSaveInflectionMode('practice')}
                  disabled={isSaving}
                  className={`
                    w-full text-right px-5 py-4 rounded-lg border-2 transition-all
                    ${inflectionViewMode === 'practice'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                    }
                    ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold mb-1 ${
                        inflectionViewMode === 'practice' ? 'text-indigo-700' : 'text-gray-900'
                      }`}>
                        משפטים ברצף
                      </div>
                      <div className="text-sm text-gray-600">
                        תרגול מהיר ואינטנסיבי עם משפטים רצופים
                      </div>
                    </div>
                    {inflectionViewMode === 'practice' && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => handleSaveInflectionMode('default')}
                  disabled={isSaving}
                  className={`
                    w-full text-right px-5 py-4 rounded-lg border-2 transition-all
                    ${inflectionViewMode === 'default'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                    }
                    ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold mb-1 ${
                        inflectionViewMode === 'default' ? 'text-indigo-700' : 'text-gray-900'
                      }`}>
                        להבין יותר
                      </div>
                      <div className="text-sm text-gray-600">
                        למידה מעמיקה עם הסברים והטיות מפורטות
                      </div>
                    </div>
                    {inflectionViewMode === 'default' && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
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

      {/* הגדרות רמת סיפור */}
      <section 
        ref={storyLevelRef}
        className="bg-white border border-gray-200 rounded-lg p-5 scroll-mt-4"
        data-setting="story-level"
      >
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">רמת סיפור מועדפת</h3>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">טוען...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                רמת קושי לסיפורים
              </label>
              <p className="text-xs text-gray-500 mb-4">
                בחר את רמת הקושי המועדפת עליך של יצירת סיפורים באזור התרגול. ניתן תמיד לשנות את הרמה בעמוד הסיפור עצמו.
              </p>
              
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleSaveStoryLevel(level)}
                    disabled={isSaving}
                    className={`
                      relative px-4 py-6 rounded-lg border-2 transition-all
                      ${storyLevel === level
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                      }
                      ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-1 ${
                        storyLevel === level ? 'text-purple-700' : 'text-gray-900'
                      }`}>
                        {level}
                      </div>
                      <div className="text-xs text-gray-600">
                        {level === 1 && 'מתחיל'}
                        {level === 2 && 'קל'}
                        {level === 3 && 'בינוני'}
                        {level === 4 && 'מאתגר'}
                        {level === 5 && 'מתקדם'}
                      </div>
                    </div>
                    {storyLevel === level && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}