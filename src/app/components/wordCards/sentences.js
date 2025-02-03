'use client'
import React, { useContext } from 'react';
import useOpenWindow from "../../hooks/openWindow";
import AudioButton from '../common/AudioButton';
import Tooltip from '../common/Tooltip';
import { ChevronDown, ChevronUp } from 'lucide-react';
import underLine from '../common/UnderLine';
import { WordContext } from '../../(routes)/words/page.js';

const Information = ({ sen, inf, word }) => {
    const sentences = Object.keys(sen);
     
    return (
        <div className='p-2' dir='ltr'>
            <div className='p-4 text-center text-blue-900'>
                <p className='font-semibold text-lg mb-4'>משפטים לשינון והטמעה</p>
                <p className='text-sm'>הבנת המשמעות של המילה בהקשרים שונים</p>
            </div>
            {sentences.map((sentence, index) => (
                <div key={index} className='flex gap-2 mb-2'>
                    <div className='flex-shrink-0'>
                    <AudioButton text={sentence}/>
                    </div>
                    <Tooltip content={sen[sentence]}>
                        {underLine(sentence, [...inf, word])}
                    </Tooltip>
                </div>
            ))}
        </div>
    );
}

const Sentences = ({ sen, inf, word }) => {
    const sectionTitle = Object.keys(sen)[0];
    const { isOpen, toggleSection } = useOpenWindow(sectionTitle);
    
    return (
        <div className="relative">
            <button
                onClick={() => toggleSection(sectionTitle)}
                className='flex items-center text-md font-semibold toggle-button pl-4'
            >
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    <span>"{sectionTitle}"</span>
                </div>
            </button>
            
            {isOpen && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded shadow-lg p-2 z-[50] w-72 sm:w-68 max-w-xs max-h-[90vh] overflow-y-auto window-content">
                    <Information 
                        sen={sen}
                        inf={inf}
                        word={word}
                    />
                </div>
            )}
        </div>
    );
};

export default Sentences;
