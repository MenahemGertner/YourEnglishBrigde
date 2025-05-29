'use client'
import { useSearchParams } from 'next/navigation'
import InflectionDetails from '../_data/inflectionDetails'
import { PartsOfSpeechContent } from '../_data/partsOfSpeechContent'
import Link from 'next/link'
import { useState } from 'react'

export default function InflectionsPage() {
    const searchParams = useSearchParams()
    const partOfSpeechKey = searchParams.get('type')
    const validKeys = Object.keys(InflectionDetails)
    const [showAllInflections, setShowAllInflections] = useState(false)

    if (!partOfSpeechKey || !validKeys.includes(partOfSpeechKey)) {
        return (
            <div className="container mx-auto p-16">
                <h1 className="text-3xl font-bold mb-6">אנא בחר חלק דיבר תקף</h1>
            </div>
        )
    }

    const inflectionData = InflectionDetails[partOfSpeechKey]
    const contentData = PartsOfSpeechContent[partOfSpeechKey]
    
    // הטיות - 2 ראשונות ושאר ההטיות
    const allInflections = Object.keys(inflectionData.inflections)
    const firstTwoInflections = allInflections.slice(0, 2)
    const remainingInflections = allInflections.slice(2)

    // מפת צבעים פשוטה
    const colorClasses = {
        sky: {
            light: 'bg-sky-50 border-sky-200 text-sky-800',
            medium: 'bg-sky-100 hover:bg-sky-200 text-sky-800',
            dark: 'bg-sky-200 border-sky-200 text-sky-800'
        },
        pink: {
            light: 'bg-pink-50 border-pink-200 text-pink-800',
            medium: 'bg-pink-100 hover:bg-pink-200 text-pink-800',
            dark: 'bg-pink-200 border-pink-200 text-pink-800'
        },
        purple: {
            light: 'bg-purple-50 border-purple-200 text-purple-800',
            medium: 'bg-purple-100 hover:bg-purple-200 text-purple-800',
            dark: 'bg-purple-200 border-purple-200 text-purple-800'
        },
        green: {
            light: 'bg-green-50 border-green-200 text-green-800',
            medium: 'bg-green-100 hover:bg-green-200 text-green-800',
            dark: 'bg-green-200 border-green-200 text-green-800'
        },
        slate: {
            light: 'bg-slate-50 border-slate-200 text-slate-800',
            medium: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
            dark: 'bg-slate-200 border-slate-200 text-slate-800'
        }
    }

    const currentColor = contentData.colors.primary
    const textColor = `text-${currentColor}-800`

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            {/* כותרת ראשית */}
            <h1 className="text-4xl font-bold py-16 text-center text-gray-800">
                {contentData.fullName}
            </h1>

            {/* סקציית ההסבר המרכזית */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>
                    {contentData.title}
                </h2>
                
                <div className="space-y-6 text-lg leading-relaxed">
                    <p className="text-gray-700">
                        <strong>{contentData.mainDefinition}</strong>
                    </p>
                    
                    <div className={`${colorClasses[currentColor].light} p-6 rounded-lg border`}>
                        <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>
                            {contentData.identificationRules.title}
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            {contentData.identificationRules.categories.map((category, index) => (
                                <li key={index}>
                                    <strong>{category.label}:</strong> {category.examples}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`${colorClasses[currentColor].dark} p-6 rounded-lg border`}>
                        <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>
                            {contentData.roleInSentence.title}
                        </h3>
                        <p className="text-gray-700 mb-3">
                            {contentData.roleInSentence.description}
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            {contentData.roleInSentence.roles.map((roleItem, index) => (
                                <li key={index}>
                                    <strong>{roleItem.role}:</strong> <span dangerouslySetInnerHTML={{ __html: `"${roleItem.example}"` }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* קופסת טיפים לזיהוי */}
            <div className="bg-yellow-50 border-r-4 border-yellow-400 p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-yellow-800">💡 טיפים מהירים לזיהוי</h3>
                <ul className="space-y-2 text-gray-700">
                    {contentData.quickTips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                    ))}
                </ul>
            </div>

            {/* סקציית ההטיות */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    סוגים שונים של {contentData.fullName.split(' - ')[1]}
                </h2>
                
                {/* 2 הטיות ראשונות */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {firstTwoInflections.map((key) => {
                        const details = inflectionData.inflections[key]
                        if (!details) return null
                        
                        return (
                            <Link
                                href={`/explainInflection?type=${partOfSpeechKey}&inflection=${key}`}
                                key={key}
                                className={`${colorClasses[currentColor].medium} p-4 rounded-lg border transition-colors`}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                    {details.translation} - {key}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{details.explanation}</p>
                                <p className="text-sm italic text-gray-500">דוגמה: {details.example}</p>
                            </Link>
                        )
                    })}
                </div>

                {/* כפתור הרחבה והטיות נוספות */}
                {remainingInflections.length > 0 && (
                    <div>
                        <button
    onClick={() => setShowAllInflections(!showAllInflections)}
    className="my-8 mx-auto block px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md font-normal transition-colors duration-200 bg-white hover:bg-gray-50"
>
    {showAllInflections ? 'הסתר פריטים נוספים' : 'הצג פריטים נוספים'}
</button>

                        {showAllInflections && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {remainingInflections.map((key) => {
                                    const details = inflectionData.inflections[key]
                                    return (
                                        <Link
                                            href={`/explainInflection?type=${partOfSpeechKey}&inflection=${key}`}
                                            key={key}
                                            className={`${colorClasses[currentColor].medium} p-4 rounded-lg border transition-colors`}
                                        >
                                            <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                                {details.translation} - {key}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{details.explanation}</p>
                                            <p className="text-sm italic text-gray-500">דוגמה: {details.example}</p>
                                        </Link>
                                    )
                                })}
                                <p className="text-sm text-gray-500">
                    * רשימה זו כוללת את סוגי ההטיות העיקריים. ישנם סוגים נוספים ומונחים מקובלים שונים.
                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* הערה והחזרה */}
            <div className="text-left space-y-4">
                
                <Link
                    href="/partOfSpeech"
                    className="inline-block text-xl font-bold text-blue-900 hover:text-blue-700 transition-colors"
                >
                     חזרה לחלקי הדיבור ←
                </Link>
            </div>
        </div>
    )
}