import Tooltip from '@/components/features/Tooltip';
import Link from "next/link";

const PartOfSpeech = ({
    ps,
    variant = 'default',
}) => {
    const partOfSpeechMap = {
        'V': {
            fullName: 'Verb',
            type: 'verbs',
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
            fullName: 'Noun',
            type: 'nouns',
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
            fullName: 'Adjective',
            type: 'adjectives',
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
            fullName: 'Function Word',
            type: 'functionWords',
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
                    <Link href={href} className='hover:text-gray-700'>
                        {partOfSpeechInfo.fullName}
                    </Link>
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