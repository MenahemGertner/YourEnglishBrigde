// InflectionRenderer.js
import React from "react";
import { ChevronDown, ChevronUp, CircleHelp, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AudioButton from "@/components/features/AudioButton";
import PartOfSpeech from "../helpers/partOfSpeech.js";
import Link from "next/link";
import underLine from "@/components/features/UnderLine";

const InflectionRenderer = ({ 
  viewMode,
  items,
  activeSentenceId,
  toggleSentence,
  showExplanation,
  setShowExplanation,
  visibleTranslations,
  toggleTranslation,
  isLastInflection,
  goToNextInflection
}) => {
  // Function to render an item in default mode
  const renderDefaultItem = (item) => (
    <div 
      key={item.id} 
      className={`mb-4 rounded-lg transition-all duration-300 ${
        activeSentenceId === item.id ? 'bg-gradient-to-r from-blue-50 to-purple-50 p-3' : 'hover:bg-gray-50 p-2'
      }`}
    >
      <div 
        className="flex items-center gap-2 mb-1 cursor-pointer"
        onClick={() => toggleSentence(item.id)}
      >
        <div 
          className="text-blue-600 hover:text-blue-800"
          aria-label={activeSentenceId === item.id ? "Hide details" : "Show details"}
        >
          {activeSentenceId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        <span className="font-medium text-gray-800 truncate max-w-[150px]">{item.word}</span>
        <span onClick={(e) => e.stopPropagation()}>
          <AudioButton text={item.word}/>
        </span>
        <PartOfSpeech ps={item.inflec} variant="compact" />
        <span className="text-gray-300 text-xs">{item.Inflections}</span> 
      </div>
  
      {activeSentenceId === item.id ? (
        <div className="mt-2 pl-6 border-l-2 border-blue-200">
          <div className="mb-2 text-sm text-gray-600 flex justify-between items-center" dir="rtl">
            <span>{item.translateInflection}</span>
            <div className="flex items-center gap-2">
              <span  dir='ltr'>{item.Inflections}</span>
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
                {item.inflectionDescription}
              </p>
              <Link 
                href={`/explainInflection?type=${item.type || 'other'}&inflection=${item.Inflections}`}
                className="mr-1 text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <span>למידע נוסף</span>                
              </Link>
            </div>
          )}
          
          {/* במצב הטיות - הצג רק את המשפט הראשון */}
          {item.examples && item.examples.length > 0 && (
            <div className="p-2 bg-white rounded border border-gray-200 mb-2">
              <p className="mb-1">{underLine(item.examples[0].sen, [item.word], item.inflec)}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <AudioButton text={item.examples[0].sen}/>
                <div className="relative flex items-center flex-grow">
                  <p 
                    className={`transition-all duration-300 ${
                      visibleTranslations[`${item.id}-default-0`] ? '' : 'blur select-none'
                    }`} dir='rtl'
                  >
                    {item.examples[0].trn}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTranslation(`${item.id}-default-0`);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    aria-label={visibleTranslations[`${item.id}-default-0`] ? "הסתר תרגום" : "הצג תרגום"}
                  >
                    {visibleTranslations[`${item.id}-default-0`] ? 
                      <EyeOff size={16} /> : 
                      <Eye size={16} />
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Only show "Continue to next practice" button if it's not the last inflection */}
          {!isLastInflection() && (
            <button 
              onClick={goToNextInflection}
              className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={14} />
              <span>המשך לתרגול הבא</span>
            </button>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-600 pl-6 max-w-full">
          {item.sentence && underLine(item.sentence, [item.word], item.inflec)}
        </div>
      )}
    </div>
  );

  // Function to render an item in practice mode
  const renderPracticeItem = (item) => (
    <div key={item.id} className="mb-6 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{item.word}</span>
          <AudioButton text={item.word}/>
          <PartOfSpeech ps={item.inflec} variant="compact" />
        </div>
      </div>
      
      {/* במצב תרגול רציף - הצג את כל הדוגמאות */}
      {item.examples.map((example, exIndex) => (
        <div key={`${item.id}-practice-${exIndex}`} className="p-3 bg-gray-50 rounded mb-2">
          <p className="mb-2 text-lg">{underLine(example.sen, [item.word], item.inflec)}</p>
          <div className="flex items-center gap-2 text-gray-600">
            <AudioButton text={example.sen}/>
            <div className="relative flex items-center flex-grow">
              <p 
                className={`transition-all duration-300 ${
                  visibleTranslations[`${item.id}-practice-${exIndex}`] ? '' : 'blur select-none'
                }`} dir='rtl'
              >
                {example.trn}
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTranslation(`${item.id}-practice-${exIndex}`);
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
                aria-label={visibleTranslations[`${item.id}-practice-${exIndex}`] ? "הסתר תרגום" : "הצג תרגום"}
              >
                {visibleTranslations[`${item.id}-practice-${exIndex}`] ? 
                  <EyeOff size={16} /> : 
                  <Eye size={16} />
                }
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {viewMode === 'default' 
        ? items.map(item => renderDefaultItem(item))
        : items.map(item => renderPracticeItem(item))
      }
    </>
  );
};

export default InflectionRenderer;