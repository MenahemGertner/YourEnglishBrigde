'use client'
import { useSearchParams } from 'next/navigation'
import { InflectionDetails } from '../../components/wordCards/Map'
import Link from 'next/link'

export default function InflectionsPage() {
    const searchParams = useSearchParams()
    const partOfSpeechKey = searchParams.get('type')
    const validKeys = Object.keys(InflectionDetails)

    if (!partOfSpeechKey || !validKeys.includes(partOfSpeechKey)) {
        return (
            <div className="container mx-auto p-16">
                <h1 className="text-3xl font-bold mb-6">אנא בחר חלק דיבר תקף</h1>
            </div>
        )
    }

    const currentPartOfSpeech = InflectionDetails[partOfSpeechKey]

    return (
        <div className="container mx-auto p-16">
            <h1 className="text-3xl font-bold mb-6">{currentPartOfSpeech.fullName}</h1>
            <p className="mb-12">{currentPartOfSpeech.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(currentPartOfSpeech.inflections).map(([key, details]) => (
                    <Link
                        href={`/explainInflection?type=${partOfSpeechKey}&inflection=${key}`}
                        key={key}
                        className={`${currentPartOfSpeech.colors.base} p-6 rounded hover:shadow-lg transition-shadow`}
                    >
                        <h2 className="text-xl font-bold mb-3">{key} - {details.translation}</h2>
                        <p className="mb-2">{details.explanation}</p>
                        <p className="italic">דוגמה: {details.example}</p>
                    </Link>
                ))}
            </div>
            <p className='mt-6 text-sm'>* חשוב לציין, שרשימה זו היא רשימה נבחרת של הטיות. אך ישנם הטיות נוספות, או מונחים מקובלים שונים להגדרת אותם ההטיות!</p>
            <div className=' mt-6 text-center'>
            <Link
            href={"/partOfSpeech"}
            className='text-xl font-bold text-blue-900 hover:text-blue-700'
            >לחלקי דיבור נוספים</Link>
            </div>
        </div>
    )
}