'use client'
import { useContext } from 'react';
import Tooltip from '../common/Tooltip'; 
import AudioButton from '../common/AudioButton'; 
import PartOfSpeech from './partOfSpeech.js';
import { WordContext } from '../../(routes)/words/page.js';

const MainWord = ({word, tr}) => {
    const wordData = useContext(WordContext);
    if (!wordData || !wordData.ps || !word) {
        return null; // או loading indicator
    }
    // קביעת גודל הטקסט בהתאם לאורך המילה
    const textSizeClass = word.length > 8 
        ? "lg:text-7xl text-5xl" 
        : "lg:text-7xl text-6xl";

    return(
        <div className="flex items-center gap-2">
            <div className='p-2'>
                <PartOfSpeech ps={wordData.ps}/>
            </div>
            <Tooltip content={tr}>
                <h2 className={`${textSizeClass} font-medium`}>{word}</h2>
            </Tooltip>                         
            <AudioButton text={word}/>
        </div>
    )
}

export default MainWord;