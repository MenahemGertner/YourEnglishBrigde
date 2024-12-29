'use client'
import Inflections from './inflections.js';
import MainWord from './mainWord.js';
import Sentences from './sentences.js';
import { useContext } from 'react';
import { WordContext } from '../../(routes)/words/page.js';
import ConditionalRender from '../common/ConditionalRender.js'

const MainCard = () => {
  const wordData = useContext(WordContext);
  if (!wordData) return <ConditionalRender/>;
  return (
    <div className="bg-gray-50 rounded-t-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] 
      w-80 min-w-[250px] 
      md:w-96 lg:w-[450px] 
      min-h-32 md:min-h-40 lg:min-h-48 
      mx-2 sm:mx-auto">
      <div className="flex flex-col items-center gap-1 py-4 md:py-6 lg:py-8">
      <div className="mb-2">
        <MainWord 
        word={wordData.word} 
        tr={wordData.tr}/>
        </div>

         <ConditionalRender data={wordData.inf}>      
          <Inflections 
          inf={wordData.inf}/>        
        </ConditionalRender>

        <div className="mt-6">
          <Sentences
          sen={wordData.sen}
          inf={wordData.inf}
          word={wordData.word}/>  
          </div>      
      </div>
    </div>
  );
};

export default MainCard;


