'use client'
import Link from 'next/link'
import InflectionDetails from '../_data/inflectionDetails'

const PartOfSpeechExplain = () => {
    const partsOfSpeech = Object.entries(InflectionDetails);
    
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-slate-800 mb-6">
                        חלקי הדיבור
                    </h1>
                    <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
                </div>

                {/* Explanation Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-3">
                                <span className="text-white text-sm">💡</span>
                            </div>
                            מה הם חלקי הדיבור?
                        </h2>
                        
                        <div className="prose prose-lg text-slate-700 leading-relaxed">
                            <p className="mb-4">
                                <strong>חלקי הדיבור</strong> הם הקטגוריות הבסיסיות שאליהן משתייכות כל המילים בשפה. 
                                כל מילה במשפט משתייכת לחלק דיבור מסוים, והכרת חלקי הדיבור חיונית להבנת מבנה השפה וכללי הדקדוק.
                            </p>
                            
                            <p className="mb-4">
                                חלקי הדיבור קובעים את <strong>התפקיד</strong> של המילה במשפט ואת הדרך שבה היא משתנה 
                                (נטייה) בהתאם להקשר - לפי זמן, מספר ועוד גורמים דקדוקיים.
                            </p>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
    <p className="text-blue-800 font-medium">
        💫 <strong>לדוגמה:</strong> המילה &quot;run&quot; יכולה להיות פועל (I run every morning),
        שם עצם (I went for a run) או שם תואר (a run-down building) – הכל תלוי בהקשר!
    </p>
</div>
                            
                            <p className="mt-6 text-slate-600">
                                לחץ על כל חלק דיבור למטה כדי ללמוד עליו לעומק ולראות דוגמאות מפורטות.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Parts of Speech Grid */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
                        חלקי הדיבור
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {partsOfSpeech.map(([key, partOfSpeech], index) => (
                            <Link
                                key={key}
                                href={`/inflections?type=${key}`}
                                className="group block transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <div className={`${partOfSpeech.colors.base} rounded-2xl p-8 h-full border-2 border-transparent group-hover:border-white/30 shadow-lg`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                                                <span className="text-sm">←</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-3">
                                        {partOfSpeech.fullName}
                                    </h3>
                                    
                                    <p className=" leading-relaxed">
                                        {partOfSpeech.description}
                                    </p>
                                    
                                    <div className="mt-6 flex items-center  text-sm font-medium">
                                        <span>לחץ ללמידה מפורטת</span>
                                        <div className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            ←
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white max-w-2xl mx-auto shadow-xl">
                        <h3 className="text-2xl font-bold mb-4">מוכנים להתחיל?</h3>
                        <p className="text-blue-100 mb-6">
                            בחרו חלק דיבור כדי ללמוד את צורות השימוש הנכונות, ואת הנטיות השונות שלו.
                        </p>
                        <div className="w-16 h-1 bg-white/30 mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartOfSpeechExplain;