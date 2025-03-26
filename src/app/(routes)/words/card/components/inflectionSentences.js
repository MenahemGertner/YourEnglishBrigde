'use client'
import React, { useState } from "react"
import { ChevronDown, ChevronUp, Volume2, CircleHelp, Book, PlayCircle, ArrowLeft } from 'lucide-react';
import AudioButton from "@/components/features/AudioButton";
import PartOfSpeech, {partOfSpeechMap} from "../helpers/partOfSpeech.js";
import partOfSpeechInflection from '../helpers/partOfSpeechInflection.js';
import Link from "next/link";
import underLine from "@/components/features/UnderLine";

const InflectionSentences = ({ 
  infl, // הטיות
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSentenceId, setActiveSentenceId] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [viewMode, setViewMode] = useState('default'); // 'default' או 'practice'
  const maxItems = 5;

  const hasInflData = infl && Object.keys(infl).length > 0;
  
  if (!hasInflData) {
    return null;
  }

  const generateItemsFromData = (data) => {
    if (!data) return [];
    
    return Object.entries(data).map(([word, details], index) => ({
      id: `infl-${index}`,
      word,
      inflec: partOfSpeechInflection(details.ps).abbreviation,
      translateInflection: details.tr,
      Inflections: details.ps,
      sentence: details.sen,
      translateSentence: details.trn,
      type: partOfSpeechInflection(details.ps).type
    }));
  };

  const inflItems = generateItemsFromData(infl);
  const hasMore = inflItems.length > maxItems;
  
  const toggleSentence = (id) => {
    setActiveSentenceId(activeSentenceId === id ? null : id);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'default' ? 'practice' : 'default');
  };

  const goToNextInflection = () => {
    const currentIndex = inflItems.findIndex(item => item.id === activeSentenceId);
    if (currentIndex < inflItems.length - 1) {
      setActiveSentenceId(inflItems[currentIndex + 1].id);
    } else {
      setActiveSentenceId(inflItems[0].id);
    }
  };

  const renderDefaultItem = (item) => (
    <div 
      key={item.id} 
      className={`mb-4 rounded-lg transition-all duration-300 ${
        activeSentenceId === item.id ? 'bg-gradient-to-r from-blue-50 to-purple-50 p-3' : 'hover:bg-gray-50 p-2'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <button 
          onClick={() => toggleSentence(item.id)}
          className="text-blue-600 hover:text-blue-800"
          aria-label={activeSentenceId === item.id ? "Hide details" : "Show details"}
        >
          {activeSentenceId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <span className="font-medium text-gray-800 truncate max-w-[150px]">{item.word}</span>
        <AudioButton text={item.word}>
          <Volume2 size={16} className="text-blue-600 hover:text-blue-800" />
        </AudioButton>
        <div className="flex items-center">
          <PartOfSpeech ps={item.inflec} variant="compact" /> 
        </div>
      </div>
  
      {activeSentenceId === item.id ? (
        <div className="mt-2 pl-6 border-l-2 border-blue-200">
          <div className="mb-2 text-sm text-gray-600 flex justify-between items-center" dir="rtl">
            <span>{item.translateInflection}</span>
            <div className="flex items-center gap-2">
              <span>{item.Inflections}</span>
              <button 
                onClick={() => setShowExplanation(prev => !prev)}
                className="text-blue-500 hover:text-blue-700 rounded-full w-4 h-4 flex items-center justify-center"
                aria-label="הסבר על הטיה"
              >
                <CircleHelp size={14} />
              </button>
            </div>
          </div>
          
          {showExplanation && (
            <div className="mb-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 text-sm rounded border border-blue-100">
              <p className="text-gray-700" dir="rtl">
                הצורה <strong>grew</strong> היא צורת העבר הפשוט (Past Simple) של הפועל <strong>grow</strong>. 
                משתמשים בה לתיאור פעולות שהתרחשו והסתיימו בעבר.
                <Link 
                  href={`/explainInflection?type=${partOfSpeechMap[item.inflec]?.type || 'other'}&inflection=${item.Inflections}`}
                  className="mr-1 text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>למידע נוסף</span>
                  <ChevronDown size={12} />
                </Link>
              </p>
            </div>
          )}
          
          <div className="p-2 bg-white rounded border border-gray-200">
            <p className="mb-1">{underLine(item.sentence, [item.word], item.inflec)}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <AudioButton text={item.sentence}>
                <Volume2 size={14} className="text-blue-600 hover:text-blue-800" />
              </AudioButton>
              <p>{item.translateSentence}</p>
            </div>
          </div>
          
          <button 
            onClick={goToNextInflection}
            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={14} />
            <span>המשך לתרגול הבא</span>
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-600 pl-6 max-w-full">
          {underLine(item.sentence, [item.word], item.inflec)}
        </div>
      )}
    </div>
  );

  const renderPracticeItem = (item, index) => (
    <div key={item.id} className="mb-6 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{item.word}</span>
          <PartOfSpeech ps={item.inflec} variant="compact" />
        </div>
        <AudioButton text={item.word}>
          <Volume2 size={16} className="text-blue-600 hover:text-blue-800" />
        </AudioButton>
      </div>
      
      <div className="p-3 bg-gray-50 rounded">
        <p className="mb-2 text-lg">{underLine(item.sentence, [item.word], item.inflec)}</p>
        <div className="flex items-center gap-2 text-gray-600">
          <AudioButton text={item.sentence}>
            <Volume2 size={14} className="text-blue-600 hover:text-blue-800" />
          </AudioButton>
          <p>{item.translateSentence}</p>
        </div>
      </div>
    </div>
  );

  const [visibleDefaultItems, setVisibleDefaultItems] = useState(maxItems);
  const [visiblePracticeItems, setVisiblePracticeItems] = useState(maxItems);

  const loadMoreDefaultItems = () => {
    setVisibleDefaultItems(prev => Math.min(prev + maxItems, inflItems.length));
  };

  const loadMorePracticeItems = () => {
    setVisiblePracticeItems(prev => Math.min(prev + maxItems, inflItems.length));
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
          <button 
            onClick={() => setViewMode('practice')}
            className={`px-2 py-1 text-sm rounded-r-md transition ${
              viewMode === 'practice' ? 'bg-white text-blue-700' : 'text-white'
            }`}
          >
            <div className="flex items-center gap-1">
              <PlayCircle size={14} />
              <span>תרגול רציף</span>
            </div>
          </button>
          <button 
            onClick={() => setViewMode('default')}
            className={`px-2 py-1 text-sm rounded-l-md transition ${
              viewMode === 'default' ? 'bg-white text-blue-700' : 'text-white'
            }`}
          >
            <div className="flex items-center gap-1">
              <Book size={14} />
              <span>הטיות</span>
            </div>
          </button>
        </div>
        <p className="font-semibold text-lg text-white" dir="rtl">משפטי תרגול</p>
      </div>
      <p className="text-white text-sm text-center bg-gradient-to-r from-blue-400 to-purple-400 pb-2" dir="rtl">
        משפטים עם צורות השימוש השונות של המילה להטמעה מיטבית
      </p>

      {viewMode === 'default' ? (
        // מצב ברירת מחדל - הטיות עם משפטים
        <div className="p-4 relative" dir="ltr">
          <div>
            {inflItems.slice(0, visibleDefaultItems).map(renderDefaultItem)}
            
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
          {inflItems.slice(0, visiblePracticeItems).map((item, index) => renderPracticeItem(item, index))}
          
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