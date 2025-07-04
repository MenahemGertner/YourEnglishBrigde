'use client'
import Tooltip from '@/components/features/Tooltip';
import AudioButton from '@/components/features/AudioButton';
import PartOfSpeech from '../helpers/partOfSpeech.js';

const MainWord = ({ word, tr, ps }) => {
    if (!ps || !word) {
        return null;
    }

    // קביעת גודל הטקסט בהתאם לאורך המילה
    const textSizeClass = word.length > 10 
        ? "lg:text-5xl text-3xl"
        : word.length > 8 
        ? "lg:text-6xl text-4xl"
        : "lg:text-7xl text-5xl";

    return(
        <div className="flex items-center gap-2">
            <div className='p-2'>
                <PartOfSpeech ps={ps}/>
            </div>
            <Tooltip content={tr}>
                <h2 className={`${textSizeClass} font-medium duration-300 hover:scale-105`}>{word}</h2>
            </Tooltip>
            
            <AudioButton text={word}/>
        </div>
    )
}

export default MainWord;