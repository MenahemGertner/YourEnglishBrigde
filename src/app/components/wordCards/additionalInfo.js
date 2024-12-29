'use client'
import React, { useContext} from "react"
import { MessageCircleMore, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AudioButton from "../common/AudioButton";
import Tooltip from "../common/Tooltip";
import { WordContext } from '../../(routes)/words/page.js';
import PartOfSpeech from "./partOfSpeech";
import partOfSpeechInflection from './partOfSpeechInflection';
import WindowMode from "./windowMode";
import Link from "next/link";
import { useWindowContext } from '../../providers/WindowContext';
import MoreOrLess from "../common/MoreOrLess"
import underLine from "../common/UnderLine";


const ExtractInfo = () => {
  const wordData = useContext(WordContext);
  const router = useRouter();
  const { toggleSection } = useWindowContext();

  const handleNavigation = (index) => {
    toggleSection(null);
    setTimeout(() => {
      router.push(`/words?index=${index}`);
    }, 0);
  };
  const partOfSpeechAdjastment = {
    'V': { type: 'verbs' },
    'N': { type: 'nouns' },
    'A': { type: 'adjectives' },
    'F': { type: 'functionWords' }
};
  const sections = [
    {
      title: "שימושים נוספים של המילה",
      content: (
        <div className="flex flex-col md:flex-row gap-4">
          {[
            {
              title: "הטיות",
              subTitle: "הטיה דקדוקית, שלא משנה את המשמעות הבסיסית של המילה",
              items: wordData?.infl ? Object.entries(wordData.infl).map(([word, details]) => ({
                word,
                inflec: partOfSpeechInflection(details.ps).abbreviation,
                translateInflection: details.tr,
                inflection: details.ps,
                sentence: details.sen,
                translateSentence: details.trn,
                type: partOfSpeechInflection(details.ps).type
              })) : []
            },
            {
              title: "נגזרות",
              subTitle: "יצירת מילה חדשה מהמילה המקורית, עם משמעות מעט שונה",
              items: wordData?.der ? Object.entries(wordData.der).map(([word, details]) => ({
                word,
                inflec: partOfSpeechInflection(details.ps).abbreviation,
                translateInflection: details.tr,
                inflection: details.ps,
                sentence: details.sen,
                translateSentence: details.trn,
                type: partOfSpeechInflection(details.ps).type
              })) : []
            }
          ].filter(subsection => subsection.items.length > 0).map((subsection, index, filteredArray) => (
            <div 
              key={subsection.title}
              className={`w-60 p-4 relative 
                ${index < filteredArray.length - 1 ? 'md:border-l-4 border-gray-300/50' : ''}
                ${index < filteredArray.length - 1 ? 'border-b-4 md:border-b-0' : ''}`} 
              dir="ltr"
            >
              <p className="font-semibold text-blue-900 text-lg text-center mb-2">{subsection.title}</p>
              <p className="text-blue-900 text-sm text-center mb-6">{subsection.subTitle}</p>
              <MoreOrLess
                items={subsection.items}
                itemRenderer={(item) => (
                  <div key={item.word} className="flex items-center">
                    <AudioButton text={item.word} />
                    <div className="flex items-center gap-4">
                      <Tooltip content={<div>
                        <div className='flex items-center gap-2'>
                          <PartOfSpeech 
                            ps={item.inflec} 
                            variant="compact" 
                          />
                          <Link href={`/explainInflection?type=${partOfSpeechAdjastment[item.inflec]?.type || 'other'}&inflection=${item.inflection}`} className="hover:text-gray-700">
                            ({item.inflection})                           
                          </Link>
                          <span className="mx-2">{item.translateInflection}</span>
                        </div>
                      </div>}>
                        <span>{item.word}</span>
                      </Tooltip>
                      <Tooltip content={<div>
                        <AudioButton text={item.sentence}/>                   
                        <span className="font-bold">{underLine(item.sentence, [item.word ])}</span><br/>
                        {item.translateSentence}
                      </div>}>
                        <MessageCircleMore/>
                      </Tooltip>
                    </div>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      )
    },
    {
      title: "עוד מידע שכדאי לדעת",
      content: (
        <div className="flex flex-col md:flex-row gap-4">
          {[
            {
              title: "ביטויים",
              subTitle: "ביטויים נפוצים שעשויים לשנות את המשמעות הבסיסית של המילה",
              items: wordData?.ex ? Object.entries(wordData.ex).map(([word, translation]) => ({
                word,
                translation
              })) : []
            },
            {
              title: "מילים נרדפות",
              subTitle: "מילים חלופיות עם משמעות דומה",
              items: wordData?.synonyms ? wordData.synonyms.map(word => ({
                word: word.word,
                translation: word.translation,
                index: word.index
              })) : []
            },
            {
              title: "מילים דומות",
              subTitle: "מילים זרות שקל להתבלבל ביניהם",
              items: wordData?.confused ? wordData.confused.map(word => ({
                word: word.word,
                translation: word.translation,
                index: word.index
              })) : []
            }
          ].filter(subsection => subsection.items.length > 0).map((subsection, index, filteredArray) => (
            <div 
              key={subsection.title}
              className={`w-60 p-8 relative 
                ${index < filteredArray.length - 1 ? 'md:border-l-4 border-gray-300/50' : ''}
                ${index < filteredArray.length - 1 ? 'border-b-4 md:border-b-0' : ''}`} 
              dir="ltr"
            >
              <p className="font-semibold text-blue-900 text-lg text-center mb-2">{subsection.title}</p>
              <p className="text-blue-900 text-sm text-center mb-6">{subsection.subTitle}</p>
              <MoreOrLess
                items={subsection.items}
                itemRenderer={(item) => (
                  <div key={item.word} className="flex items-center">
                    <AudioButton text={item.word} />
                    <div className="flex items-center gap-3">
                    <Tooltip content={item.translation}>
                      <span>{item.word}</span>          
                    </Tooltip>
                    {(subsection.title === "מילים נרדפות" || subsection.title === "מילים דומות") && (
                      <div 
                        onClick={() => handleNavigation(item.index)} 
                        style={{ cursor: 'pointer' }}
                      >
                        <ExternalLink className="h-3 w-3" />
                        
                      </div>
                    )}
                    </div>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      )
    }
  ];

  return <WindowMode sections={sections} />;
};

export default ExtractInfo;