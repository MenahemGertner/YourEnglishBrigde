import Tooltip from '@/components/features/Tooltip';
import Link from "next/link";

export const partOfSpeechMap = {
    'V': {
        fullName: 'פעלים - Verbs',
        type: 'verbs',
        explain: 'מילים שמתארות פעולות או מה שקורה.\nלדוגמה: לרוץ, לאכול, לחשוב.\nמשתנות לפי זמן: עבר, הווה, עתיד.',
        colors: {
            default: {
                color: 'bg-pink-600 shadow-inner shadow-pink-500 hover:shadow-pink-700',
                textColor: 'text-white',
                fill: '#db2777'    // pink-600
            },
            compact: {
                color: 'bg-pink-400',
                textColor: 'text-white'
            }
        }
    },
    'N': {
        fullName: 'שמות עצם - Nouns',
        type: 'nouns',
        explain: 'מילים שמציינות אנשים, מקומות או דברים.\nלדוגמה: ילד, בית, שולחן.\nיכולות להופיע ביחיד או ברבים.',
        colors: {
            default: {
                color: 'bg-sky-600 shadow-inner shadow-sky-500 hover:shadow-sky-700',
                textColor: 'text-white',
                fill: '#0284c7'    // sky-600
            },
            compact: {
                color: 'bg-sky-400',
                textColor: 'text-white'
            }
        }
    },
    'A': {
        fullName: 'שמות תואר - Adjectives',
        type: 'adjectives',
        explain: 'מילים שמתארות איך משהו נראה או מרגיש.\nלדוגמה: גדול, יפה, מהיר.\nיכולות להשוות: גדול, יותר גדול, הכי גדול.',
        colors: {
            default: {
                color: 'bg-purple-800 shadow-inner shadow-purple-700 hover:shadow-purple-900',
                textColor: 'text-white',
                fill: '#6b21a8'    // purple-800
            },
            compact: {
                color: 'bg-purple-500',
                textColor: 'text-white'
            }
        }
    },
    'D': {
        fullName: 'תוארי פועל - Adverbs',
        type: 'adverbs',
        explain: 'מילים שמתארות איך, מתי או איפה קורה משהו.\nלדוגמה: מהר, אתמול, בחוץ.',
        colors: {
            default: {
                color: 'bg-green-700 shadow-inner shadow-green-600 hover:shadow-green-800',
                textColor: 'text-white',
                fill: '#15803d'    // green-700
            },
            compact: {
                color: 'bg-green-500',
                textColor: 'text-white'
            }
        }
    },
    'F': {
        fullName: 'מילות תפקוד - Function Words',
        type: 'functionWords',
        explain: 'מילים קטנות שמחברות בין חלקי המשפט.\nלדוגמה: ב-, ו-, אני, את, הוא.\nעוזרות לבנות משפטים שלמים.',
        colors: {
            default: {
                color: 'bg-slate-500 shadow-inner shadow-slate-400 hover:shadow-slate-600',
                textColor: 'text-white',
                fill: '#64748b'    // slate-500
            },
            compact: {
                color: 'bg-slate-300',
                textColor: 'text-slate-700'
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
        
        // זווית כל חלק בחלוקה ל-5 (72 מעלות)
        const sectionAngle = 360 / 5;
        
        // חישוב נקודות על המעגל לפי זווית במעלות
        const getPointOnCircle = (angleDegrees) => {
            const angleRadians = (angleDegrees * Math.PI) / 180;
            return {
                x: centerX + radius * Math.cos(angleRadians),
                y: centerY + radius * Math.sin(angleRadians)
            };
        };
        
        // חישוב 5 נקודות על המעגל בזוויות של 72 מעלות
        const point0 = getPointOnCircle(90);      // עליון (90 מעלות)
        const point72 = getPointOnCircle(90 + 72); // שמאלי עליון (162 מעלות)
        const point144 = getPointOnCircle(90 + 144); // שמאלי תחתון (234 מעלות)
        const point216 = getPointOnCircle(90 + 216); // ימני תחתון (306 מעלות)
        const point288 = getPointOnCircle(90 + 288); // ימני עליון (378/18 מעלות)
        
        // חישוב נקודות אמצע של כל חלק לטקסט (באמצע כל סקטור)
        const textDistanceFactor = 0.62; // מרחק מהמרכז (יחסית לרדיוס)
        
        // חישוב נקודות לטקסט בכל חלק
        const textN = {
            x: centerX + (radius * textDistanceFactor) * Math.cos(55 * Math.PI / 180),
            y: centerY + (radius * textDistanceFactor) * Math.sin(55 * Math.PI / 180)
        };
        
        const textD = { // D עבור Adverb במקום Adv
            x: centerX + (radius * textDistanceFactor) * Math.cos((55 + 72 * 4) * Math.PI / 180),
            y: centerY + (radius * textDistanceFactor) * Math.sin((55 + 72 * 4) * Math.PI / 180)
        };
        
        const textV = {
            x: centerX + (radius * textDistanceFactor) * Math.cos((55 + 72) * Math.PI / 180),
            y: centerY + (radius * textDistanceFactor) * Math.sin((55 + 72) * Math.PI / 180)
        };
        
        const textF = {
            x: centerX + (radius * textDistanceFactor) * Math.cos((55 + 72 * 2) * Math.PI / 180),
            y: centerY + (radius * textDistanceFactor) * Math.sin((55 + 72 * 2) * Math.PI / 180)
        };
        
        const textA = {
            x: centerX + (radius * textDistanceFactor) * Math.cos((55 + 72 * 3) * Math.PI / 180),
            y: centerY + (radius * textDistanceFactor) * Math.sin((55 + 72 * 3) * Math.PI / 180)
        };
        
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                <defs>
                    <clipPath id="circleClip">
                        <circle cx={centerX} cy={centerY} r={radius - 1} />
                    </clipPath>
                </defs>
                
                <g clipPath="url(#circleClip)">
                    {/* N - חלק עליון */}
                    <g className={ps === 'N' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point288.x} ${point288.y} A${radius} ${radius} 0 0 1 ${point0.x} ${point0.y} Z`} 
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
                    
                    {/* V - חלק שמאלי עליון */}
                    <g className={ps === 'V' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point0.x} ${point0.y} A${radius} ${radius} 0 0 1 ${point72.x} ${point72.y} Z`} 
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
                    
                    {/* F - חלק שמאלי תחתון */}
                    <g className={ps === 'F' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point72.x} ${point72.y} A${radius} ${radius} 0 0 1 ${point144.x} ${point144.y} Z`} 
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
                    
                    {/* A - חלק ימני תחתון */}
                    <g className={ps === 'A' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point144.x} ${point144.y} A${radius} ${radius} 0 0 1 ${point216.x} ${point216.y} Z`} 
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
                    
                    {/* D - חלק ימני עליון (עבור Adverb) */}
                    <g className={ps === 'D' ? "cursor-pointer" : "cursor-default"}>
                        <path 
                            d={`M${centerX} ${centerY} L${point216.x} ${point216.y} A${radius} ${radius} 0 0 1 ${point288.x} ${point288.y} Z`} 
                            fill={partOfSpeechMap['D'].colors.default.fill}
                            opacity={ps === 'D' ? 1 : 0.3}
                        />
                        <text 
                            x={textD.x} 
                            y={textD.y} 
                            fontFamily="Arial, sans-serif" 
                            fontSize="10" 
                            fontWeight="bold" 
                            fill="white" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                        >
                            D
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
                        <button 
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = href;
                            }}
                            className='underline text-blue-700 hover:text-blue-500 mt-1 bg-transparent border-none cursor-pointer'
                        >
                            ללמוד יותר
                        </button>
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
                    <button 
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = href;
                        }}
                        className='underline text-blue-700 hover:text-blue-500 mt-1 bg-transparent border-none cursor-pointer'
                    >
                        ללמוד יותר
                    </button>
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