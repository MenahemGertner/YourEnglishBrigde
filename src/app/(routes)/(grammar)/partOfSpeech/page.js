'use client'
import Link from 'next/link'
import InflectionDetails from '../_data/inflectionDetails'

const PartOfSpeechExplain = () => {
    const partsOfSpeech = Object.entries(InflectionDetails);
    
    return (
        <div className="container mx-auto p-16">
            <h1 className="text-3xl font-bold mb-12">חלקי הדיבור</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {partsOfSpeech.map(([key, partOfSpeech]) => (
                    <Link
                        key={key}
                        href={`/inflections?type=${key}`}
                        className={`${partOfSpeech.colors.base} p-8 rounded block transition-colors`}
                    >
                        <h2 className="text-2xl font-bold mb-4">{partOfSpeech.fullName}</h2>
                        <p>{partOfSpeech.description}</p>
                    </Link>
                ))}
            </div>
            <p className='mt-6 text-sm'>* חשוב לציין, שניתן להגדיר קטגוריות נוספות כמו 'תואר הפועל' ועוד. אך לשם הפשטות בחרנו לחלק את המידע לארבע קטגוריות ראשיות אלו.</p>
        </div>
    );
};

export default PartOfSpeechExplain;