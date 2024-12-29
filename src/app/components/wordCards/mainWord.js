'use client'
import { useContext } from 'react';
import Tooltip from '../common/Tooltip'; 
import AudioButton from '../common/AudioButton'; 
import PartOfSpeech from './partOfSpeech.js';
import { WordContext } from '../../(routes)/words/page.js';

const MainWord = ({word, tr}) => {
    const wordData = useContext(WordContext);

    return(
        <div className="flex items-center gap-2">
            <div className='p-2'>
                <PartOfSpeech ps={wordData.ps}/>
            </div>
            <Tooltip content={tr}>
                <h2 className="text-7xl font-medium">{word}</h2>
            </Tooltip>                         
            <AudioButton text={word}/>
        </div>
    )
}

export default MainWord;