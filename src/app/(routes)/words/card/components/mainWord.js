'use client'
import Tooltip from '@/components/features/Tooltip'; 
import AudioButton from '@/components/features/AudioButton'; 
import PartOfSpeech from '../helpers/partOfSpeech.js';

const MainWord = ({ word, tr, ps }) => {
    if (!ps || !word) {
        return null;
    }
    // קביעת גודל הטקסט בהתאם לאורך המילה
    const textSizeClass = word.length > 8 
        ? "lg:text-7xl text-5xl" 
        : "lg:text-7xl text-6xl";

    return(
        <div className="flex items-center gap-2">
            <div className='p-2'>
                <PartOfSpeech ps={ps}/>
            </div>
            <Tooltip content={tr}>
                <h2 className={`${textSizeClass} font-medium duration-300 hover:scale-110`}>{word}</h2>
            </Tooltip>                         
            <AudioButton text={word}/>
        </div>
    )
}

export default MainWord;