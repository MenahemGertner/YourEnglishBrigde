import Tooltip from '@/components/features/Tooltip';
import Link from "next/link";

export const partOfSpeechMap = {
    'V': {
        fullName: 'פעלים - Verbs',
        type: 'verbs',
        explain: 'משמשים לביטוי של פעולות בזמנים שונים. \n לכל פועל צורות שונות \nהמראות מתי הפעולה מתרחשת.\n הזמנים הבסיסיים: עבר, הווה או עתיד.',
        colors: {
            default: {
                color: 'bg-green-700',
                textColor: 'text-white'
            },
            compact: {
                color: 'bg-green-300',
                textColor: 'text-gray-600'
            }
        }
    },
    'N': {
        fullName: 'שמות עצם - Nouns',
        type: 'nouns',
        explain: 'משמשות ליצוג של עצמים. \n יכולות להופיע בשתי צורות:\n יחיד או רבים.',
        colors: {
            default: {
                color: 'bg-blue-700',
                textColor: 'text-white'
            },
            compact: {
                color: 'bg-blue-300',
                textColor: 'text-gray-600'
            }
        }
    },
    'A': {
        fullName: 'שמות תואר - Adjectives',
        type: 'adjectives',
        explain: 'משמשות לתיאור של תכונות.\nיכולות להופיע בשלוש צורות:\nרגיל, יותר (השוואה), והכי (הטוב ביותר).',
        colors: {
            default: {
                color: 'bg-orange-400',
                textColor: 'text-white'
            },
            compact: {
                color: 'bg-orange-300',
                textColor: 'text-gray-600'
            }
        }
    },
    'F': {
        fullName: 'מילות תפקוד - Function Words',
        type: 'functionWords',
        explain: 'משמשות ליצירת חיבור והקשר במשפט. \n לרוב, למילים אלו אין הטיות.',
        colors: {
            default: {
                color: 'bg-yellow-400',
                textColor: 'text-white'
            },
            compact: {
                color: 'bg-yellow-300',
                textColor: 'text-gray-600'
            }
        }
    }
};

const PartOfSpeech = ({
    ps,
    variant = 'default',
}) => {
    const partOfSpeechInfo = partOfSpeechMap[ps] || {
        fullName: ps,
        type: 'other',
        colors: {
            default: {
                color: 'bg-gray-700',
                textColor: 'text-white'
            },
            compact: {
                color: 'bg-gray-300',
                textColor: 'text-gray-600'
            }
        }
    };

    const currentColor = partOfSpeechInfo.colors[variant];

    const renderContent = () => {
        const href = `/inflections?type=${partOfSpeechInfo.type}`;

        if (variant === 'default') {
            return (
                <Tooltip content={
                    <div className="flex flex-col text-center">
                       <span className='font-bold mb-1'>{partOfSpeechInfo.fullName} </span>
                      {partOfSpeechInfo.explain}
                      <Link href={href} className='underline text-blue-700 hover:text-blue-500 mt-1'>
                        ללמוד יותר
                      </Link>
                    </div>
                  }>
                    <div className={`flex items-center justify-center h-6 w-6 rounded-full ${currentColor.color} ${currentColor.textColor} font-bold text-1xl hover:text-gray-200`}>
                        {ps}
                    </div>
                    
                </Tooltip>
            );
        }

        return (
            <Link href={href}>
                <div className={`flex items-center justify-center h-4 w-4 rounded-full ${currentColor.color} ${currentColor.textColor} font-semibold text-xs hover:text-gray-500`}>
                    {ps}
                </div>
            </Link>
        );
    };

    return renderContent();
}

export default PartOfSpeech;