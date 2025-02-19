'use client'
import React from "react"
import { MessageCircleMore, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AudioButton from "@/components/features/AudioButton";
import Tooltip from "@/components/features/Tooltip";
import PartOfSpeech, {partOfSpeechMap} from "../helpers/partOfSpeech.js";
import partOfSpeechInflection from '../helpers/partOfSpeechInflection.js';
import WindowMode from "../helpers/windowMode";
import Link from "next/link";
import { useWindowContext } from '@/app/providers/WindowContext';
import MoreOrLess from "@/components/features/MoreOrLess"
import underLine from "@/components/features/UnderLine";

const ExtractInfo = ({ 
  infl, // הטיות
  der, // נגזרות
  ex, // ביטויים
  syn,    // מילים נרדפות
  con // מילים דומות
}) => {
  const router = useRouter();
  const { toggleSection } = useWindowContext();

  const handleNavigation = (index) => {
    toggleSection(null);
    setTimeout(() => {
      router.push(`/words?index=${index}`);
    }, 0);
  };

  const sections = [
    {
      title: "שימושים נוספים של המילה",
      content: (
        <div className="flex flex-col md:flex-row gap-4">
          {[
            {
              title: "הטיות",
              subTitle: "הטיית שימוש, שלא משנה את המשמעות הבסיסית של המילה",
              items: infl ? Object.entries(infl).map(([word, details]) => ({
                word,
                inflec: partOfSpeechInflection(details.ps).abbreviation,
                translateInflection: details.tr,
                Inflections: details.ps,
                sentence: details.sen,
                translateSentence: details.trn,
                type: partOfSpeechInflection(details.ps).type
              })) : []
            },
            {
              title: "נגזרות",
              subTitle: "יצירת מילה חדשה מהמילה המקורית, עם משמעות מעט שונה",
              items: der ? Object.entries(der).map(([word, details]) => ({
                word,
                inflec: partOfSpeechInflection(details.ps).abbreviation,
                translateInflection: details.tr,
                Inflections: details.ps,
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
                  <div key={item.word} className="flex items-center mb-1">
                    <AudioButton text={item.word} />
                    <div className="flex items-center gap-4">
                      <Tooltip content={<div>
                        <div className='flex items-center gap-2'>
                        <span className="mx-2">{item.translateInflection}</span>
                        <Link href={`/explainInflection?type=${partOfSpeechMap[item.inflec]?.type || 'other'}&inflection=${item.Inflections}`} className="hover:text-gray-700">
                            ({item.Inflections})                           
                          </Link>
                          <PartOfSpeech 
                            ps={item.inflec} 
                            variant="compact" 
                          /> 
                        </div>
                      </div>}>
                        <span className="hover:text-blue-700">{item.word}</span>
                      </Tooltip>
                      <Tooltip content={<div>
                        <span className="font-bold mb-8">{underLine(item.sentence, [item.word ])}</span>
                        <AudioButton text={item.sentence}/> <br/>
                        {item.translateSentence}
                      </div>}>
                      <div className="hover:text-blue-700 hover:scale-110">
                        <MessageCircleMore/>
                        </div>
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
              items: ex ? Object.entries(ex).map(([word, translation]) => ({
                word,
                translation
              })) : []
            },
            {
              title: "מילים נרדפות",
              subTitle: "מילים חלופיות עם משמעות דומה",
              items: syn || []
            },
            {
              title: "מילים דומות",
              subTitle: "מילים זרות שקל להתבלבל ביניהם",
              items: con || []
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
                  <div key={item.word} className="flex items-center mb-1">
                    <AudioButton text={item.word} />
                    <div className="flex items-center gap-3">
                    <Tooltip content={item.translation}>
                      <span className="hover:text-blue-700">{item.word}</span>          
                    </Tooltip>
                    {(subsection.title === "מילים נרדפות" || subsection.title === "מילים דומות") && (
                      <div 
                        onClick={() => handleNavigation(item.index)} 
                        style={{ cursor: 'pointer' }}
                      >
                        <ExternalLink className="h-3 w-3 hover:text-blue-700 hover:scale-110" />
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