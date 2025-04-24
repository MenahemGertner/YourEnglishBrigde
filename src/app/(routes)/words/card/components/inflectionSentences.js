'use client'
import React, { useState } from "react"
import { ChevronDown, Book, PlayCircle } from 'lucide-react';
import InflectionRenderer from "./InflectionRenderer";
import partOfSpeechInflection from '../helpers/partOfSpeechInflection.js';

const InflectionSentences = ({ infl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSentenceId, setActiveSentenceId] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  // שינוי ברירת המחדל ל'practice' במקום 'default'
  const [viewMode, setViewMode] = useState('practice');
  const maxItems = 5;
  const [visibleDefaultItems, setVisibleDefaultItems] = useState(maxItems);
  const [visiblePracticeItems, setVisiblePracticeItems] = useState(maxItems);
  const [visibleTranslations, setVisibleTranslations] = useState({});

  // בדיקה שיש נתונים בפורמט החדש (מערך)
  const hasInflData = infl && Array.isArray(infl) && infl.length > 0;
  
  if (!hasInflData) {
    return null;
  }

  const generateItemsFromData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item, index) => {
      // קבל את פרטי ההטיה כולל התיאור
      const inflectionDetails = partOfSpeechInflection(item.ps);
      
      return {
        id: `infl-${index}`,
        word: item.form,
        inflec: inflectionDetails.abbreviation,
        translateInflection: item.tr,
        Inflections: item.ps,
        // קח את המשפט הראשון מרשימת הדוגמאות אם קיים
        sentence: item.examples && item.examples.length > 0 ? item.examples[0].sen : '',
        translateSentence: item.examples && item.examples.length > 0 ? item.examples[0].trn : '',
        type: inflectionDetails.type,
        // שמור את תיאור ההטיה
        inflectionDescription: inflectionDetails.description,
        // שמור את כל הדוגמאות
        examples: item.examples || []
      };
    });
  };

  const inflItems = generateItemsFromData(infl);
  const hasMore = inflItems.length > maxItems;
  
  const toggleSentence = (id) => {
    setActiveSentenceId(activeSentenceId === id ? null : id);
  };

  const loadMoreDefaultItems = () => {
    setVisibleDefaultItems(prev => Math.min(prev + maxItems, inflItems.length));
  };

  const loadMorePracticeItems = () => {
    setVisiblePracticeItems(prev => Math.min(prev + maxItems, inflItems.length));
  };

  const goToNextInflection = () => {
    const currentIndex = inflItems.findIndex(item => item.id === activeSentenceId);
    
    // Check if the next item would be outside currently visible items
    if (currentIndex + 1 >= visibleDefaultItems && currentIndex + 1 < inflItems.length) {
      // Load more items before proceeding to next one
      loadMoreDefaultItems();
    }
    
    if (currentIndex < inflItems.length - 1) {
      setActiveSentenceId(inflItems[currentIndex + 1].id);
    } else {
      setActiveSentenceId(inflItems[0].id);
    }
  };

  // Function to check if current inflection is the last one
  const isLastInflection = () => {
    const currentIndex = inflItems.findIndex(item => item.id === activeSentenceId);
    return currentIndex === inflItems.length - 1;
  };

  // Function to toggle translation visibility
  const toggleTranslation = (translationId) => {
    setVisibleTranslations(prev => ({
      ...prev,
      [translationId]: !prev[translationId]
    }));
  };

  return (
    <div 
      className={`max-h-[75vh] window-content fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-lg bg-white shadow-xl overflow-auto ${
        viewMode === 'default' 
          ? 'w-[85%] md:w-[380px]'  // Mobile-friendly width for default view
          : 'w-[85%] md:w-[380px]'  // Consistent width for both mobile and desktop
      }`}
      dir="ltr"
    >
      <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-lg p-4 border-b border-blue-100 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center bg-white/20 rounded-lg">
          {/* שינוי סדר הכפתורים - לימוד והבנה בצד שמאל */}
          <button 
            onClick={() => setViewMode('default')}
            className={`px-2 py-1 text-sm rounded-l-md transition ${
              viewMode === 'default' ? 'bg-white text-blue-700' : 'text-white'
            }`}
          >
            <div className="flex items-center gap-1">
              <Book size={14} />
              <span>הסבר והרחבה</span>
            </div>
          </button>
          {/* משפטים ברצף בצד ימין */}
          <button 
            onClick={() => setViewMode('practice')}
            className={`px-2 py-1 text-sm rounded-r-md transition ${
              viewMode === 'practice' ? 'bg-white text-blue-700' : 'text-white'
            }`}
          >
            <div className="flex items-center gap-1">
              <PlayCircle size={14} />
              <span>משפטים ברצף</span>
            </div>
          </button>
        </div>
        <p className="font-semibold text-lg text-white" dir="rtl">משפטי תרגול</p>
      </div>
      
      {/* כותרת משנה שמשתנה לפי מצב התצוגה */}
      <p className="text-white text-sm text-center bg-gradient-to-r from-blue-400 to-purple-400 py-3" dir="rtl">
        {viewMode === 'practice' ? 'תרגל לפחות 5 משפטים!' : 'הבנת השימושים השונים של המילה'}
      </p>

      {viewMode === 'default' ? (
        // מצב ברירת מחדל - הטיות עם משפטים
        <div className="p-4 relative" dir="ltr">
          <div>
            <InflectionRenderer
              viewMode={viewMode}
              items={inflItems.slice(0, visibleDefaultItems)}
              activeSentenceId={activeSentenceId}
              toggleSentence={toggleSentence}
              showExplanation={showExplanation}
              setShowExplanation={setShowExplanation}
              visibleTranslations={visibleTranslations}
              toggleTranslation={toggleTranslation}
              isLastInflection={isLastInflection}
              goToNextInflection={goToNextInflection}
            />
            
            {visibleDefaultItems < inflItems.length && (
              <button
                onClick={loadMoreDefaultItems}
                className="flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm px-2 py-1 mt-2 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors mx-auto"
              >
                <ChevronDown size={16} />
                <span>הצג עוד</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        // מצב תרגול - רק משפטים ברצף
        <div className="p-4 max-w-2xl mx-auto">
          <InflectionRenderer
            viewMode={viewMode}
            items={inflItems.slice(0, visiblePracticeItems)}
            activeSentenceId={activeSentenceId}
            toggleSentence={toggleSentence}
            showExplanation={showExplanation}
            setShowExplanation={setShowExplanation}
            visibleTranslations={visibleTranslations}
            toggleTranslation={toggleTranslation}
            isLastInflection={isLastInflection}
            goToNextInflection={goToNextInflection}
          />
          
          {visiblePracticeItems < inflItems.length && (
            <button
              onClick={loadMorePracticeItems}
              className="flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm px-2 py-1 mt-2 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors mx-auto"
            >
              <ChevronDown size={16} />
              <span>הצג עוד</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InflectionSentences;