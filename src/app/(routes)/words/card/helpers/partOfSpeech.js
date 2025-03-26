import Tooltip from '@/components/features/Tooltip';
import Link from "next/link";

export const partOfSpeechMap = {
    'V': {
        fullName: 'פעלים - Verbs',
        type: 'verbs',
        explain: 'משמשים לביטוי של פעולות בזמנים שונים. \n לכל פועל צורות שונות \nהמראות מתי הפעולה מתרחשת.\n הזמנים הבסיסיים: עבר, הווה או עתיד.',
        colors: {
            default: {
                color: 'bg-pink-600 shadow-inner shadow-pink-500 hover:shadow-pink-700',
                textColor: 'text-white',
                fill: '#db2777'    // pink-600
            },
            compact: {
                color: 'bg-pink-400',  // ורוד בהיר ויזואלי יותר
                textColor: 'text-white'
            }
        }
    },
    'N': {
        fullName: 'שמות עצם - Nouns',
        type: 'nouns',
        explain: 'משמשות ליצוג של עצמים. \n יכולות להופיע בשתי צורות:\n יחיד או רבים.',
        colors: {
            default: {
                color: 'bg-sky-600 shadow-inner shadow-sky-500 hover:shadow-sky-700',
                textColor: 'text-white',
                fill: '#0284c7'    // sky-600
            },
            compact: {
                color: 'bg-sky-400',  // תכלת בהיר
                textColor: 'text-white'
            }
        }
    },
    'A': {
        fullName: 'שמות תואר - Adjectives',
        type: 'adjectives',
        explain: 'משמשות לתיאור של תכונות.\nיכולות להופיע בשלוש צורות:\nרגיל, יותר (השוואה), והכי (הטוב ביותר).',
        colors: {
            default: {
                color: 'bg-purple-800 shadow-inner shadow-purple-700 hover:shadow-purple-900',
                textColor: 'text-white',
                fill: '#6b21a8'    // purple-800
            },
            compact: {
                color: 'bg-purple-500',  // שומר על אותו גוון, רק בהיר יותר
                textColor: 'text-white'
            }
        }
    },
    'F': {
        fullName: 'מילות תפקוד - Function Words',
        type: 'functionWords',
        explain: 'משמשות ליצירת חיבור והקשר במשפט. \n לרוב, למילים אלו אין הטיות.',
        colors: {
            default: {
                color: 'bg-slate-500 shadow-inner shadow-slate-400 hover:shadow-slate-600',
                textColor: 'text-white',
                fill: '#64748b'    // slate-500
            },
            compact: {
                color: 'bg-slate-300',  // גוון כסוף בהיר
                textColor: 'text-slate-700'  // טקסט כהה יותר לקריאות טובה על רקע בהיר
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
                textColor: 'text-white',
                fill: '#374151'    // צבע בסיסי
            },
            compact: {
                color: 'bg-gray-300',
                textColor: 'text-gray-600'
            }
        }
    };

    const currentColor = partOfSpeechInfo.colors[variant];

    const renderQuadrantSVG = () => {
        const size = 48; // גודל האייקון
        const radius = size / 2;
        const centerX = radius;
        const centerY = radius;
        
        // חישוב נקודות על המעגל בהתאם לזוויות החדשות (במעלות)
        const getPointOnCircle = (angleDegrees) => {
            const angleRadians = (angleDegrees * Math.PI) / 180;
            return {
                x: centerX + radius * Math.cos(angleRadians),
                y: centerY + radius * Math.sin(angleRadians)
            };
        };
        
        // נקודות קצה של כל רבע עם זוויות חדשות
        const point45 = getPointOnCircle(45);   // נקודה בזווית 45 מעלות
        const point135 = getPointOnCircle(135); // נקודה בזווית 135 מעלות
        const point225 = getPointOnCircle(225); // נקודה בזווית 225 מעלות
        const point315 = getPointOnCircle(315); // נקודה בזווית 315 מעלות
        
        // חישוב נקודות מרכזיות לכל רבע עבור הטקסט (באמצע כל רבע)
        // רבעים הם: 45-135, 135-225, 225-315, 315-45
        // מרכזי הרבעים הם: 90, 180, 270, 0
        const textDistanceFactor = 0.6; // מרחק מהמרכז (יחסית לרדיוס)
        
        // חישוב נקודות מרכזיות עבור הטקסט בכל רבע (לפי הזוויות המדויקות)
        const textN = {
            x: centerX + (radius * textDistanceFactor) * Math.cos(90 * Math.PI / 180),  // 90 מעלות (צפון)
            y: centerY + (radius * textDistanceFactor) * Math.sin(90 * Math.PI / 180)   // מרכז בין 45-135
        };
        
        const textV = {
            x: centerX + (radius * textDistanceFactor) * Math.cos(0),                  // 0 מעלות (מזרח) 
            y: centerY + (radius * textDistanceFactor) * Math.sin(0)                   // מרכז בין 315-45
        };
        
        const textA = {
            x: centerX + (radius * textDistanceFactor) * Math.cos(270 * Math.PI / 180), // 270 מעלות (דרום)
            y: centerY + (radius * textDistanceFactor) * Math.sin(270 * Math.PI / 180)  // מרכז בין 225-315
        };
        
        const textF = {
            x: centerX + (radius * textDistanceFactor) * Math.cos(180 * Math.PI / 180), // 180 מעלות (מערב)
            y: centerY + (radius * textDistanceFactor) * Math.sin(180 * Math.PI / 180)  // מרכז בין 135-225
        };
        
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                <defs>
                    <clipPath id="circleClip">
                        <circle cx={centerX} cy={centerY} r={radius - 1} />
                    </clipPath>
                </defs>
                
                <g clipPath="url(#circleClip)">
                    {/* N - רבע עליון (45-135 מעלות) */}
                    <g className={ps === 'N' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point45.x} ${point45.y} A${radius} ${radius} 0 0 1 ${point135.x} ${point135.y} Z`} 
                            fill={partOfSpeechMap['N'].colors.default.fill} 
                            opacity={ps === 'N' ? 1 : 0.3}
                        />
                        <text 
                            x={textN.x} 
                            y={textN.y} 
                            fontFamily="Arial, sans-serif" 
                            fontSize="10" 
                            fontWeight="bold" 
                            fill="white" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                        >
                            N
                        </text>
                    </g>
                    
                    {/* V - רבע ימני (315-45 מעלות) */}
                    <g className={ps === 'V' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point315.x} ${point315.y} A${radius} ${radius} 0 0 1 ${point45.x} ${point45.y} Z`} 
                            fill={partOfSpeechMap['V'].colors.default.fill}
                            opacity={ps === 'V' ? 1 : 0.3}
                        />
                        <text 
                            x={textV.x} 
                            y={textV.y} 
                            fontFamily="Arial, sans-serif" 
                            fontSize="10" 
                            fontWeight="bold" 
                            fill="white" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                        >
                            V
                        </text>
                    </g>
                    
                    {/* A - רבע תחתון (225-315 מעלות) */}
                    <g className={ps === 'A' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point225.x} ${point225.y} A${radius} ${radius} 0 0 1 ${point315.x} ${point315.y} Z`} 
                            fill={partOfSpeechMap['A'].colors.default.fill}
                            opacity={ps === 'A' ? 1 : 0.3}
                        />
                        <text 
                            x={textA.x} 
                            y={textA.y} 
                            fontFamily="Arial, sans-serif" 
                            fontSize="10" 
                            fontWeight="bold" 
                            fill="white" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                        >
                            A
                        </text>
                    </g>
                    
                    {/* F - רבע שמאלי (135-225 מעלות) */}
                    <g className={ps === 'F' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point135.x} ${point135.y} A${radius} ${radius} 0 0 1 ${point225.x} ${point225.y} Z`} 
                            fill={partOfSpeechMap['F'].colors.default.fill}
                            opacity={ps === 'F' ? 1 : 0.3}
                        />
                        <text 
                            x={textF.x} 
                            y={textF.y} 
                            fontFamily="Arial, sans-serif" 
                            fontSize="10" 
                            fontWeight="bold" 
                            fill="white" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                        >
                            F
                        </text>
                    </g>
                </g>
                
                {/* גבול עגול */}
                <circle cx={centerX} cy={centerY} r={radius - 0.5} fill="none" stroke="#e0e0e0" strokeWidth="1" />
            </svg>
        );
    };

    const renderContent = () => {
        if (variant === 'default') {
            const href = `/inflections?type=${partOfSpeechInfo.type}`;
            
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
                    <div className="w-12 h-12 flex items-center justify-center">
                        {renderQuadrantSVG()}
                    </div>
                </Tooltip>
            );
        }

        // אם זה variant='compact', נשמר את הגרסה המקורית של האייקון הקטן
        const href = `/inflections?type=${partOfSpeechInfo.type}`;
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
                <div className={`flex items-center justify-center h-4 w-4 rounded-full ${currentColor.color} ${currentColor.textColor} font-semibold text-xs hover:text-gray-200`}>
                    {ps}
                </div>
            </Tooltip>
        );
    };

    return renderContent();
}

export default PartOfSpeech;