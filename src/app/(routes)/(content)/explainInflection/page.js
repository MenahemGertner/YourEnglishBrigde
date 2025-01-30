'use client'
import { useSearchParams } from 'next/navigation'
import { InflectionDetails, ExtendedInflectionDetails } from '../../../components/wordCards/Map'

export default function ExplainInflection() {
    const searchParams = useSearchParams()
    const partOfSpeechType = searchParams.get('type')
    const inflectionType = searchParams.get('inflection')

    if (!partOfSpeechType || !inflectionType || 
        !ExtendedInflectionDetails[partOfSpeechType] || 
        !ExtendedInflectionDetails[partOfSpeechType][inflectionType]) {
        return (
            <div className="container mx-auto p-16">
                <h1 className="text-3xl font-bold mb-6">אנא בחר ערך תקף</h1>
            </div>
        )
    }

    const inflectionDetails = ExtendedInflectionDetails[partOfSpeechType][inflectionType]
    const basicDetails = InflectionDetails[partOfSpeechType].inflections[inflectionType]

    return (
        <div className="container mx-auto p-16">
            <h1 className="text-3xl font-bold mb-6 text-right">
                {inflectionType} - {basicDetails.translation}
            </h1>
            
            <div className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 text-right">הסבר</h2>
                    <p className="text-right">{inflectionDetails.detailedExplanation}</p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 text-right">דוגמאות</h2>
                    {inflectionDetails.examples.map((example, index) => (
                        <div key={index} className="mb-4 border-b pb-4 last:border-0">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <span className="text-right">{example.english}</span>
                            <span className="text-left">{example.hebrew}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <span className="text-right">{example.inSentence.english}</span>
                            <span className="text-left">{example.inSentence.hebrew}</span>
                        </div>
                    </div>
                    ))}
                </section>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 text-right">טעויות נפוצות</h2>
                    <p className="text-right">{inflectionDetails.commonMistakes}</p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4 text-right">טיפים לשימוש</h2>
                    <p className="text-right">{inflectionDetails.usageTips}</p>
                </section>
            </div>
        </div>
    )
}