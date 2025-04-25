export const ExtendedInflectionDetails = {
    nouns: {
        'Singular': {
            detailedExplanation: `שם עצם ביחיד באנגלית הוא הצורה הבסיסית של המילה המתייחסת לישות אחת. באנגלית, צורה זו משמשת כבסיס ליצירת צורות אחרות של המילה. שמות עצם ביחיד באנגלית מחייבים שימוש במילות יחס מתאימות (a/an/the) כאשר מדובר בשם עצם ספיר.`,
            examples: [
                {
                    english: 'book',
                    hebrew: 'ספר',
                    inSentence: {
                        english: 'The book is on the table',
                        hebrew: 'הספר נמצא על השולחן',
                        explanation: 'שימוש בשם עצם ביחיד עם הפועל is המתאים ליחיד'
                    }
                },
                {
                    english: 'student',
                    hebrew: 'תלמיד',
                    inSentence: {
                        english: 'A student studies hard',
                        hebrew: 'תלמיד לומד קשה',
                        explanation: 'שימוש במילת היחס a לפני שם העצם ובפועל המתאים ליחיד (studies)'
                    }
                },
                {
                    english: 'child',
                    hebrew: 'ילד',
                    inSentence: {
                        english: 'The child plays in the garden',
                        hebrew: 'הילד משחק בגינה',
                        explanation: 'דוגמה לשם עצם שיש לו צורת רבים לא רגילה (children)'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות בשימוש בשמות עצם ביחיד באנגלית כוללות: שימוש בפועל ברבים עם שם עצם ביחיד, שכחת מילות היחס הנדרשות, ושימוש שגוי במילות היחס a/an.',
            usageTips: 'חשוב לזכור: שם עצם ספיר ביחיד באנגלית תמיד דורש מילת יחס (a/an/the). הפועל המתאים צריך להיות בצורת יחיד. לדוגמה: is, was, has, goes.'
        },
        'Plural': {
            detailedExplanation: `צורת הרבים באנגלית מציינת יותר מאחד. באנגלית יש מספר דרכים ליצירת צורת הרבים: הוספת s בסוף המילה (הדרך הנפוצה ביותר), הוספת es למילים המסתיימות ב-s, sh, ch, x, o, או שינוי לא רגיל של המילה במקרה של יוצאים מן הכלל.`,
            examples: [
                {
                    english: 'books',
                    hebrew: 'ספרים',
                    inSentence: {
                        english: 'The books are on the shelf',
                        hebrew: 'הספרים נמצאים על המדף',
                        explanation: 'דוגמה לרבים רגיל עם הוספת s ושימוש בפועל ברבים (are)'
                    }
                },
                {
                    english: 'boxes',
                    hebrew: 'קופסאות',
                    inSentence: {
                        english: 'The boxes contain many items',
                        hebrew: 'הקופסאות מכילות הרבה פריטים',
                        explanation: 'דוגמה להוספת es למילה המסתיימת ב-x'
                    }
                },
                {
                    english: 'children',
                    hebrew: 'ילדים',
                    inSentence: {
                        english: 'The children are playing',
                        hebrew: 'הילדים משחקים',
                        explanation: 'דוגמה לצורת רבים לא רגילה'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות ברבים באנגלית: שכחת שינוי הפועל לצורת רבים, שימוש שגוי בצורות רבים לא רגילות (למשל childs במקום children), הוספת s למילים שאינן ספירות.',
            usageTips: 'ברבים לא משתמשים ב-a/an. אפשר להשתמש ב-the או לא להשתמש במילת יחס כלל כשמדברים על הכללה. הפועל חייב להיות בצורת רבים (are, were, have, go).'
        },
    'Common Noun': {
        detailedExplanation: `שם עצם כללי באנגלית מתייחס לאובייקטים, מקומות או דברים כלליים. בניגוד לשם עצם פרטי, הוא נכתב באות קטנה אלא אם הוא בתחילת משפט. שמות עצם כלליים יכולים להיות ספירים או בלתי ספירים, ומקבלים את כל צורות היידוע (a, an, the).`,
        examples: [
            {
                english: 'dog',
                hebrew: 'כלב',
                inSentence: {
                    english: 'A dog is barking in the street',
                    hebrew: 'כלב נובח ברחוב',
                    explanation: 'שימוש בשם עצם כללי עם מילת היחס a'
                }
            },
            {
                english: 'chair',
                hebrew: 'כיסא',
                inSentence: {
                    english: 'The chairs in this room are comfortable',
                    hebrew: 'הכיסאות בחדר הזה נוחים',
                    explanation: 'שימוש בשם עצם כללי ברבים עם the'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות כתיבת שמות עצם כלליים באות גדולה, או השמטת מילות יחס הכרחיות לפני שמות עצם ספירים.',
        usageTips: 'זכרו להשתמש באות קטנה אלא אם המילה בתחילת משפט. שמות עצם כלליים ספירים ביחיד תמיד דורשים מילת יחס.'
    },
    'Proper Noun': {
        detailedExplanation: `שם עצם פרטי באנגלית מציין אדם, מקום, או דבר ספציפי ומזוהה. תמיד נכתב באות גדולה, ולרוב לא מקבל מילות יחס כמו a או an. שמות פרטיים יכולים לקבל את מילת היחס the במקרים מסוימים (למשל the United States).`,
        examples: [
            {
                english: 'London',
                hebrew: 'לונדון',
                inSentence: {
                    english: 'London is a beautiful city',
                    hebrew: 'לונדון היא עיר יפה',
                    explanation: 'שם פרטי של עיר - נכתב באות גדולה וללא מילת יחס'
                }
            },
            {
                english: 'John',
                hebrew: 'ג׳ון',
                inSentence: {
                    english: 'John works at Microsoft',
                    hebrew: 'ג׳ון עובד במיקרוסופט',
                    explanation: 'שם פרטי של אדם ושל חברה - שניהם באות גדולה'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות כתיבת שמות פרטיים באות קטנה, או הוספת מילות יחס מיותרות כמו a או an לפני שמות פרטיים.',
        usageTips: 'תמיד השתמשו באות גדולה לשמות פרטיים. זה כולל שמות של אנשים, מקומות, חברות, מותגים, ימי השבוע, חודשים, חגים, ולאומים.'
    },
    'Concrete Noun': {
        detailedExplanation: `שם עצם מוחשי באנגלית מתייחס לדברים שניתן לחוות באמצעות החושים - ראייה, שמיעה, מגע, טעם או ריח. אלה דברים פיזיים שקיימים בעולם המוחשי. שמות עצם מוחשיים יכולים להיות ספירים או בלתי ספירים.`,
        examples: [
            {
                english: 'book',
                hebrew: 'ספר',
                inSentence: {
                    english: 'The book feels heavy in my hands',
                    hebrew: 'הספר מרגיש כבד בידיי',
                    explanation: 'שם עצם מוחשי שניתן לגעת בו ולראות אותו'
                }
            },
            {
                english: 'music',
                hebrew: 'מוזיקה',
                inSentence: {
                    english: 'The music is too loud',
                    hebrew: 'המוזיקה חזקה מדי',
                    explanation: 'שם עצם מוחשי שניתן לשמוע'
                }
            }
        ],
        commonMistakes: 'טעות נפוצה היא בלבול בין שמות עצם מוחשיים לבין שמות עצם מופשטים, במיוחד כשמדובר בתופעות טבע או תחושות פיזיות.',
        usageTips: 'חשבו אם אפשר לחוות את הדבר באמצעות אחד החושים. אם כן - זהו שם עצם מוחשי.'
    },
    'Abstract Noun': {
        detailedExplanation: `שם עצם מופשט באנגלית מתאר רעיון, מושג, רגש או מצב שאי אפשר לחוות באופן פיזי באמצעות החושים. רבים מהם נוצרים על ידי הוספת סיומות כמו -ness, -ship, -dom, -ity לשמות תואר או שמות עצם אחרים.`,
        examples: [
            {
                english: 'love',
                hebrew: 'אהבה',
                inSentence: {
                    english: 'Love conquers all',
                    hebrew: 'האהבה מנצחת הכל',
                    explanation: 'רגש שלא ניתן לראות או לגעת בו'
                }
            },
            {
                english: 'freedom',
                hebrew: 'חופש',
                inSentence: {
                    english: 'Freedom is a basic human right',
                    hebrew: 'חופש הוא זכות אדם בסיסית',
                    explanation: 'מושג מופשט שנוצר מהמילה free בתוספת הסיומת -dom'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות שימוש במילת היחס a/an עם שמות עצם מופשטים שאינם ספירים, או שימוש בצורת רבים כשלא מתאים.',
        usageTips: 'רוב שמות העצם המופשטים אינם ספירים ולכן לא מקבלים a/an ולא יכולים להיות ברבים.'
    },
    'Nominal Infinitive': {
        detailedExplanation: `שם פועל באנגלית (או Gerund) נוצר על ידי הוספת ing לפועל, והופך את הפועל לשם עצם. צורה זו משמשת כנושא או מושא במשפט ומתנהגת כמו שם עצם לכל דבר.`,
        examples: [
            {
                english: 'swimming',
                hebrew: 'שחייה',
                inSentence: {
                    english: 'Swimming is great exercise',
                    hebrew: 'שחייה היא התעמלות מצוינת',
                    explanation: 'הפועל swim הפך לשם עצם על ידי הוספת ing'
                }
            },
            {
                english: 'reading',
                hebrew: 'קריאה',
                inSentence: {
                    english: 'I enjoy reading books',
                    hebrew: 'אני נהנה מקריאת ספרים',
                    explanation: 'שימוש בשם פועל כמושא אחרי הפועל enjoy'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות שימוש בצורת המקור (to + verb) במקום שם הפועל, או שכחת שינויי איות בעת הוספת ing.',
        usageTips: 'זכרו את כללי הוספת ing: הכפלת אות אחרונה במילים שמסתיימות באות אחת + תנועה קצרה, השמטת e אילמת.'
    },
    'Verbal Noun': {
            detailedExplanation: `שם עצם באנגלית הנגזר מפועל על ידי הוספת סיומות כמו -tion, -sion, -ment, -al. בניגוד לשם פועל (gerund), שמות עצם פועליים הם מילים נפרדות ועצמאיות המתארות את הפעולה או את תוצאתה.`,
            examples: [
                {
                    english: 'destruction',
                    hebrew: 'הרס',
                    inSentence: {
                        english: 'The destruction of the building was complete',
                        hebrew: 'ההרס של הבניין היה מוחלט',
                        explanation: 'נגזר מהפועל destroy בתוספת הסיומת -tion'
                    }
                },
                {
                    english: 'payment',
                    hebrew: 'תשלום',
                    inSentence: {
                        english: 'Your payment is due tomorrow',
                        hebrew: 'התשלום שלך מגיע מחר',
                        explanation: 'נגזר מהפועל pay בתוספת הסיומת -ment'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות בלבול בין שם פועל (gerund) לבין שם עצם פועלי, או שימוש שגוי בסיומות.',
            usageTips: 'שימו לב לסיומות האופייניות. למדו את הסיומות הנפוצות: -tion, -ation, -ment, -al, -ance, -ence.'
        },
        'Genitive Case': {
            detailedExplanation: `צורת השייכות באנגלית מציינת בעלות או קשר. היא נוצרת על ידי הוספת גרש ו-s ('s) לשם עצם ביחיד, או רק גרש (') לשם עצם ברבים המסתיים ב-s. משמשת גם לציון זמן ומרחק.`,
            examples: [
                {
                    english: "John's car",
                    hebrew: 'המכונית של ג׳ון',
                    inSentence: {
                        english: "John's car is blue",
                        hebrew: 'המכונית של ג׳ון היא כחולה',
                        explanation: "הוספת 's לשם פרטי לציון בעלות"
                    }
                },
                {
                    english: "the students' books",
                    hebrew: 'הספרים של התלמידים',
                    inSentence: {
                        english: "The students' books are heavy",
                        hebrew: 'הספרים של התלמידים כבדים',
                        explanation: 'הוספת גרש בלבד כי המילה students היא ברבים'
                    }
                }
            ],
            commonMistakes: "טעויות נפוצות כוללות שימוש שגוי בסימן הגרש, בלבול בין 's ל-s', או שימוש בצורת שייכות במקום שעדיף להשתמש ב-of.",
            usageTips: "השתמשו ב-'s עבור בני אדם ובעלי חיים. עבור חפצים דוממים, העדיפו את מבנה ה-of (the leg of the table)."
        },
        'Collective Noun': {
            detailedExplanation: `שם עצם קיבוצי באנגלית מתייחס לקבוצה כיחידה אחת. יכול לקבל פועל ביחיד או ברבים, תלוי אם מתייחסים לקבוצה כיחידה או לפרטים בה. באנגלית בריטית נוטים יותר להשתמש בפועל ברבים.`,
            examples: [
                {
                    english: 'team',
                    hebrew: 'קבוצה',
                    inSentence: {
                        english: 'The team is celebrating its victory',
                        hebrew: 'הקבוצה חוגגת את ניצחונה',
                        explanation: 'שימוש בפועל ביחיד כשמתייחסים לקבוצה כיחידה אחת'
                    }
                },
                {
                    english: 'family',
                    hebrew: 'משפחה',
                    inSentence: {
                        english: 'My family are all doctors',
                        hebrew: 'כל בני משפחתי הם רופאים',
                        explanation: 'שימוש בפועל ברבים כשמתייחסים לפרטים בקבוצה'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות חוסר עקביות בשימוש בפועל ביחיד או ברבים, או שימוש לא נכון בכינויי גוף.',
            usageTips: 'היו עקביים: אם התחלתם להתייחס לקבוצה כיחידה, המשיכו כך לאורך כל המשפט.'
        },
        'Countable Noun': {
            detailedExplanation: `שם עצם ספיר באנגלית הוא שם עצם שניתן למנות אותו. יש לו צורת יחיד ורבים, ומשתמשים איתו במילות יחס (a/an) ביחיד. ניתן להשתמש במספרים לפניו.`,
            examples: [
                {
                    english: 'book',
                    hebrew: 'ספר',
                    inSentence: {
                        english: 'I need three books',
                        hebrew: 'אני צריך שלושה ספרים',
                        explanation: 'ניתן למנות ספרים ולהשתמש במספרים לפניהם'
                    }
                },
                {
                    english: 'apple',
                    hebrew: 'תפוח',
                    inSentence: {
                        english: 'An apple a day keeps the doctor away',
                        hebrew: 'תפוח ביום מרחיק את הרופא',
                        explanation: 'שימוש במילת היחס a כי זה שם עצם ספיר ביחיד'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות השמטת מילות יחס לפני שמות עצם ספירים ביחיד, או שימוש במילות יחס לא מתאימות.',
            usageTips: 'תמיד השתמשו במילת יחס (a/an/the) לפני שם עצם ספיר ביחיד. ניתן להשתמש במספרים ובמילים כמו many, few.'
        },
        'Uncountable Noun': {
            detailedExplanation: `שם עצם בלתי ספיר באנגלית מתאר דברים שלא ניתן למנות באופן ישיר. תמיד בצורת יחיד, לא מקבל a/an, ולא ניתן להשתמש במספרים לפניו. משתמשים במילות כמות מיוחדות כמו some, much, little.`,
            examples: [
                {
                    english: 'water',
                    hebrew: 'מים',
                    inSentence: {
                        english: 'I need some water',
                        hebrew: 'אני צריך קצת מים',
                        explanation: 'שימוש ב-some ולא במספר או a/an'
                    }
                },
                {
                    english: 'information',
                    hebrew: 'מידע',
                    inSentence: {
                        english: 'The information is useful',
                        hebrew: 'המידע שימושי',
                        explanation: 'תמיד בצורת יחיד, לא קיים informations'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות שימוש בצורת רבים, שימוש ב-a/an, או ניסיון למנות ישירות.',
            usageTips: 'השתמשו במילים כמו some, much, little. אם צריך למנות, השתמשו ביחידות מידה (two cups of water).'
        },
        'Gerund': {
            detailedExplanation: `צורת ה-gerund באנגלית נוצרת על ידי הוספת ing לפועל. משמשת כשם עצם ויכולה לתפקד כנושא, מושא, או אחרי מילות יחס. חלק מהפעלים באנגלית דורשים אחריהם gerund.`,
            examples: [
                {
                    english: 'smoking',
                    hebrew: 'עישון',
                    inSentence: {
                        english: 'Smoking is dangerous to your health',
                        hebrew: 'עישון מסוכן לבריאותך',
                        explanation: 'gerund כנושא המשפט'
                    }
                },
                {
                    english: 'enjoys reading',
                    hebrew: 'נהנה מקריאה',
                    inSentence: {
                        english: 'She enjoys reading novels',
                        hebrew: 'היא נהנית מקריאת רומנים',
                        explanation: 'gerund אחרי הפועל enjoy'
                    }
                }
            ],
            commonMistakes: 'שימוש בצורת המקור (to + verb) במקום gerund, שגיאות בכתיב בעת הוספת ing.',
            usageTips: 'למדו אילו פעלים דורשים אחריהם gerund: enjoy, finish, practice, suggest, recommend.'
        },
        'Agent Noun': {
    detailedExplanation: `שם פועל באנגלית הוא שם עצם המציין את מבצע הפעולה. לרוב נוצר על-ידי הוספת הסיומות -er או -or לפועל הבסיסי. שם הפועל מתאר את האדם, בעל החיים או החפץ שמבצע את הפעולה המתוארת בפועל.`,
    examples: [
        {
            english: 'teacher',
            hebrew: 'מורה',
            inSentence: {
                english: 'Our teacher explains the lesson clearly',
                hebrew: 'המורה שלנו מסביר את השיעור בבהירות',
                explanation: 'נגזר מהפועל teach בתוספת הסיומת -er'
            }
        },
        {
            english: 'actor',
            hebrew: 'שחקן',
            inSentence: {
                english: 'The actor performed brilliantly in the film',
                hebrew: 'השחקן הופיע באופן מבריק בסרט',
                explanation: 'נגזר מהפועל act בתוספת הסיומת -or'
            }
        }
    ],
    commonMistakes: 'טעויות נפוצות כוללות בחירה שגויה בין הסיומות -er ו-or, או יצירת שמות פועל לא קיימים. לא כל פועל יכול להפוך לשם פועל תקני על ידי הוספת סיומת.',
    usageTips: 'בדרך כלל משתמשים בסיומת -er, אך פעלים שמסתיימים ב-ate לרוב מקבלים -or (כמו creator). חלק משמות הפועל אינם עוקבים אחרי כללים רגילים ויש ללמוד אותם בנפרד.'
},
'State Noun': {
detailedExplanation: 'שם עצם מצבי באנגלית מתאר מצב, תנאי או סטטוס מתמשך. לרוב הוא נמנה על שמות עצם מופשטים, אך מתמקד במצבים ספציפיים ולא תכונות כלליות. שמות עצם מצביים רבים הם בלתי ספירים, אך לא כולם.',
examples: [
{
english: 'peace',
hebrew: 'שלום',
inSentence: {
english: 'The country has enjoyed peace for decades',
hebrew: 'המדינה נהנתה משלום במשך עשורים',
explanation: 'מתאר מצב של העדר מלחמה או קונפליקט'
}
},
{
english: 'health',
hebrew: 'בריאות',
inSentence: {
english: 'Good health is essential for a happy life',
hebrew: 'בריאות טובה היא חיונית לחיים מאושרים',
explanation: 'מתאר את המצב הפיזי והנפשי של אדם'
}
}
],
commonMistakes: 'טעויות נפוצות כוללות בלבול בין שמות עצם מצביים לבין תארים (healthy במקום health), או בלבול בין מצב לבין פעולה.',
usageTips: 'שמות עצם מצביים משמשים לעתים קרובות בביטויים כמו "in a state of" או "in good/bad health". רבים מהם בלתי ספירים ודורשים מבנה דקדוקי התואם לכך.'
},
'Action Noun': {
detailedExplanation: 'שם עצם פעולה באנגלית מתאר פעולה או תהליך שמתבצע. לרוב נוצר מפעלים ומקבל סיומות כמו -tion, -sion, -ment, -ance, -al וכדומה. שם עצם פעולה מאפשר להתייחס לפעולה כאל עצם או מושג, ולא כפעולה מתבצעת.',
examples: [
{
english: 'construction',
hebrew: 'בנייה',
inSentence: {
english: 'The construction of the new bridge will take two years',
hebrew: 'בניית הגשר החדש תימשך שנתיים',
explanation: 'נגזר מהפועל construct בתוספת הסיומת -ion'
}
},
{
english: 'development',
hebrew: 'פיתוח',
inSentence: {
english: 'The development of new technologies continues rapidly',
hebrew: 'פיתוח טכנולוגיות חדשות ממשיך במהירות',
explanation: 'נגזר מהפועל develop בתוספת הסיומת -ment'
}
}
],
commonMistakes: 'טעויות נפוצות כוללות בלבול בין שמות עצם פעולה לבין צורות gerund, או שימוש בפועל במקום בשם העצם המתאים בהקשרים המחייבים שם עצם.',
usageTips: 'שמות עצם פעולה יכולים להופיע כנושא או מושא במשפט. הם שונים מ-gerund בכך שהם עברו שינוי מורפולוגי מהפועל, בעוד ש-gerund נוצר על ידי הוספת ing בלבד. לעיתים מוסיפים "the" לפני שם עצם פעולה כאשר מתייחסים לפעולה ספציפית.'
},
'Process-Result Noun': {
    detailedExplanation: `שם עצם תהליך-תוצאה באנגלית מתאר הן את התהליך והן את התוצאה של פעולה מסוימת. המילה יכולה לציין את הפעולה עצמה או את התוצר הסופי שלה, לפי ההקשר.`,
    examples: [
        {
            english: 'construction',
            hebrew: 'בנייה/מבנה',
            inSentence: {
                english: 'The construction of the building took three years',
                hebrew: 'בניית המבנה ארכה שלוש שנים',
                explanation: 'מתייחס לתהליך הבנייה עצמו'
            }
        },
        {
            english: 'creation',
            hebrew: 'יצירה',
            inSentence: {
                english: 'Her latest creation won an award at the art show',
                hebrew: 'היצירה האחרונה שלה זכתה בפרס בתערוכת האמנות',
                explanation: 'מתייחס לתוצר הסופי של תהליך היצירה'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא אי-הבחנה בין שימוש המילה כתהליך או כתוצאה, מה שעלול להוביל לשימוש לא מדויק במשפט או לבלבול בהקשר.',
    usageTips: 'שימו לב להקשר כדי להבין אם מדובר בתהליך או בתוצאה. מילות עזר כמו "during the" רומזות על תהליך, בעוד ביטויים כמו "the final" מרמזים על תוצאה.'
},

'Quality Noun': {
    detailedExplanation: `שם עצם איכות באנגלית מתאר תכונה, מאפיין או איכות של דבר מה או מישהו. אלו בדרך כלל שמות עצם מופשטים שנגזרים לרוב מתארים על ידי הוספת סיומות כמו -ness, -ity, -hood, או -ship.`,
    examples: [
        {
            english: 'kindness',
            hebrew: 'טוב לב',
            inSentence: {
                english: 'Her kindness to strangers was remarkable',
                hebrew: 'טוב הלב שלה כלפי זרים היה מרשים',
                explanation: 'נגזר מהתואר kind בתוספת הסיומת -ness'
            }
        },
        {
            english: 'reliability',
            hebrew: 'אמינות',
            inSentence: {
                english: 'The reliability of this car makes it worth the price',
                hebrew: 'האמינות של המכונית הזאת הופכת אותה לשווה את המחיר',
                explanation: 'נגזר מהתואר reliable בתוספת הסיומת -ity'
            }
        }
    ],
    commonMistakes: 'טעויות נפוצות כוללות שימוש בתואר במקום בשם העצם האיכותי, או בחירה שגויה של סיומת.',
    usageTips: 'שמות עצם איכותיים הם לרוב בלתי ספירים. הם משמשים להבעת רעיונות מופשטים ותכונות, ולכן חשובים לשיח אקדמי, פילוסופי או רגשי.'
},

'Recipient Noun': {
    detailedExplanation: `שם עצם מקבל באנגלית מציין את האדם, הקבוצה או הישות שמקבלת משהו - פעולה, מתנה, שירות, או הטבה. בניגוד לשם פועל (agent noun) המתאר את מבצע הפעולה, שם עצם מקבל מתמקד במי שמושפע מהפעולה או מקבל אותה.`,
    examples: [
        {
            english: 'recipient',
            hebrew: 'מקבל/ת',
            inSentence: {
                english: 'The recipient of the award gave a short speech',
                hebrew: 'מקבל הפרס נשא נאום קצר',
                explanation: 'מתאר את האדם שקיבל את הפרס'
            }
        },
        {
            english: 'beneficiary',
            hebrew: 'מוטב/ת',
            inSentence: {
                english: 'She is the main beneficiary of her grandmother\'s will',
                hebrew: 'היא המוטב העיקרי בצוואה של סבתה',
                explanation: 'מציין את האדם שמקבל את ההטבה מהצוואה'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא בלבול בין שמות עצם מקבלים לבין שמות פועל, או שימוש בשם פעולה במקום בשם המתאר את המקבל.',
    usageTips: 'שמות עצם מקבלים משמשים בהקשרים משפטיים, עסקיים וחברתיים. הם חשובים במיוחד בחוזים, טפסים רשמיים וטקסטים שעוסקים בהעברת משאבים או זכויות.'
},

'Action Performer Noun': {
    detailedExplanation: `שם עצם מבצע פעולה באנגלית מתאר ישות (אדם, חיה או אפילו מכשיר) שמבצעת פעולה ספציפית. בניגוד לשם פועל רגיל (agent noun), שם עצם מבצע פעולה מתאר לרוב תפקיד או מקצוע שמתמקד בביצוע הפעולה באופן מתמשך או כחלק מהגדרת התפקיד.`,
    examples: [
        {
            english: 'firefighter',
            hebrew: 'כבאי/ת',
            inSentence: {
                english: 'The firefighters arrived quickly to extinguish the flames',
                hebrew: 'הכבאים הגיעו במהירות כדי לכבות את הלהבות',
                explanation: 'מתאר אדם שתפקידו לכבות אש'
            }
        },
        {
            english: 'caretaker',
            hebrew: 'מטפל/ת',
            inSentence: {
                english: 'The caretaker ensures the building is well-maintained',
                hebrew: 'המטפל מוודא שהבניין מתוחזק היטב',
                explanation: 'מציין אדם שתפקידו לדאוג או לטפל במשהו'
            }
        }
    ],
    commonMistakes: 'טעויות נפוצות כוללות יצירת שמות לא סטנדרטיים באמצעות הוספת -er לכל פועל, כאשר לפעמים יש מונח ספציפי יותר או מבנה שונה.',
    usageTips: 'שמות עצם מבצעי פעולה הם בדרך כלל ספירים ויכולים להופיע בצורת יחיד או רבים. הם משמשים רבות בתיאורי תפקידים, מקצועות, ובאינטראקציות חברתיות.'
},

'Purpose Noun': {
    detailedExplanation: `שם עצם מטרה באנגלית מתאר חפץ, כלי, שירות או מקום שנועד למטרה מסוימת. אלו שמות עצם שהשימוש או הייעוד שלהם מובנה בהגדרתם, והם משמשים לתיאור דברים על פי התכלית שלהם.`,
    examples: [
        {
            english: 'calculator',
            hebrew: 'מחשבון',
            inSentence: {
                english: 'I need a calculator to solve this complex equation',
                hebrew: 'אני צריך מחשבון כדי לפתור את המשוואה המורכבת הזו',
                explanation: 'מתאר מכשיר שמטרתו לבצע חישובים'
            }
        },
        {
            english: 'library',
            hebrew: 'ספרייה',
            inSentence: {
                english: 'The library provides resources for research and study',
                hebrew: 'הספרייה מספקת משאבים למחקר ולימוד',
                explanation: 'מציין מקום שמטרתו לאחסן ולהנגיש ספרים וחומרי קריאה'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא להתמקד במבנה הפיזי או במראה של הדבר במקום במטרה שלו, מה שעלול להוביל לבחירת מילה שגויה.',
    usageTips: 'שמות עצם מטרה הם שימושיים כאשר מתארים חפצים או מקומות לפי השימוש שלהם. הם עוזרים להבהיר את התפקיד של דברים בחיי היומיום.'
},

'Size Modifier Noun': {
    detailedExplanation: `שם עצם מתאר גודל באנגלית משמש כדי לציין את המימדים, הנפח או ההיקף של אובייקט אחר. שמות עצם אלה יכולים לשמש כמתאר (modifier) לפני שם עצם אחר או בתוך מבנים דקדוקיים שמציינים גודל.`,
    examples: [
        {
            english: 'giant',
            hebrew: 'ענק',
            inSentence: {
                english: 'They discovered a giant cave in the mountains',
                hebrew: 'הם גילו מערה ענקית בהרים',
                explanation: 'משמש כמתאר לשם העצם cave כדי לציין את גודלה החריג'
            }
        },
        {
            english: 'miniature',
            hebrew: 'זעיר/מיניאטורי',
            inSentence: {
                english: 'She collects miniature furniture for her dollhouse',
                hebrew: 'היא אוספת רהיטים מיניאטוריים לבית הבובות שלה',
                explanation: 'מתאר את הרהיטים כקטנים מאוד ביחס לגודל הרגיל שלהם'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא שימוש לא מדויק בשמות עצם מתארי גודל שעלול להוביל להגזמה או להמעטה בתיאור. כמו כן, לפעמים נעשה שימוש בשם עצם במקום בתואר המתאים.',
    usageTips: 'שמות עצם מתארי גודל יכולים לשמש בתפקיד תארים כאשר הם מקדימים שם עצם אחר. הם מוסיפים משמעות מדויקת יותר מתארים כלליים כמו "big" או "small".'
}
            
    },

        verbs: {
            'Present Simple': {
                detailedExplanation: `הזמן ההווה הפשוט באנגלית משמש לתיאור: פעולות שקורות דרך קבע, עובדות כלליות, הרגלים, ואמיתות נצחיות. בגוף שלישי יחיד (he/she/it) מוסיפים s לפועל. יש מספר חוקים מיוחדים להוספת s בהתאם לסיום המילה.`,
                examples: [
                    {
                        english: 'work',
                        hebrew: 'עובד',
                        inSentence: {
                            english: 'I work every day / He works every day',
                            hebrew: 'אני עובד כל יום / הוא עובד כל יום',
                            explanation: 'שימו לב להוספת s בגוף שלישי יחיד'
                        }
                    },
                    {
                        english: 'study',
                        hebrew: 'לומד',
                        inSentence: {
                            english: 'Students study hard before exams',
                            hebrew: 'תלמידים לומדים קשה לפני מבחנים',
                            explanation: 'תיאור של הרגל או עובדה כללית'
                        }
                    }
                ],
                commonMistakes: 'שכחת הוספת s בגוף שלישי יחיד, שימוש בהווה פשוט במקום הווה מתמשך לפעולות שקורות עכשיו.',
                usageTips: 'השתמשו במילות זמן כמו: always, never, usually, sometimes, every day.'
            },
            'Verb Infinitive': {
                detailedExplanation: `צורת המקור של הפועל באנגלית מורכבת מ-to + הפועל הבסיסי. זוהי הצורה הבסיסית ביותר של הפועל, המופיעה במילון. משמשת אחרי פעלים מסוימים, בביטויי מטרה, ובמבנים שונים.`,
                examples: [
                    {
                        english: 'to read',
                        hebrew: 'לקרוא',
                        inSentence: {
                            english: 'I want to read this book',
                            hebrew: 'אני רוצה לקרוא את הספר הזה',
                            explanation: 'שימוש בצורת המקור אחרי הפועל want'
                        }
                    },
                    {
                        english: 'to study',
                        hebrew: 'ללמוד',
                        inSentence: {
                            english: 'She came to study English',
                            hebrew: 'היא באה ללמוד אנגלית',
                            explanation: 'שימוש בצורת המקור להבעת מטרה'
                        }
                    }
                ],
                commonMistakes: 'שימוש ב-to כשלא צריך, או השמטתו כשכן צריך. שימוש בצורת ing אחרי to.',
                usageTips: 'למדו אילו פעלים דורשים אחריהם to infinitive ואילו gerund (צורת ing).'
            },
            'Past Simple': {
                detailedExplanation: `העבר הפשוט באנגלית משמש לתיאור פעולות שהתרחשו והסתיימו בעבר. לרוב נוסיף ed לפועל רגיל, אך יש פעלים לא רגילים (irregular) שמשתנים בצורה שונה. משתמשים בו עם ביטויי זמן מוגדרים בעבר.`,
                examples: [
                    {
                        english: 'walked',
                        hebrew: 'הלך',
                        inSentence: {
                            english: 'I walked to school yesterday',
                            hebrew: 'הלכתי לבית הספר אתמול',
                            explanation: 'פועל רגיל - הוספת ed'
                        }
                    },
                    {
                        english: 'went',
                        hebrew: 'הלך',
                        inSentence: {
                            english: 'She went to Paris last summer',
                            hebrew: 'היא נסעה לפריז בקיץ שעבר',
                            explanation: 'פועל לא רגיל - צורה מיוחדת בעבר'
                        }
                    }
                ],
                commonMistakes: 'שימוש בצורת הווה במקום עבר, שגיאות בפעלים לא רגילים, שכחת שינוי הפועל be (was/were).',
                usageTips: 'השתמשו במילות זמן כמו: yesterday, last week, ago, in 2020.'
            },
            'Present Perfect': {
                detailedExplanation: `ההווה המושלם באנגלית מורכב מ-have/has + צורת העבר של הפועל (past participle). משמש לתיאור פעולות שהתחילו בעבר ומשפיעות על ההווה, פעולות שנמשכות עד ההווה, או התנסויות כלליות ללא ציון זמן ספציפי.`,
                examples: [
                    {
                        english: 'have lived',
                        hebrew: 'גר (מאז)',
                        inSentence: {
                            english: 'I have lived here since 2010',
                            hebrew: 'אני גר כאן מאז 2010',
                            explanation: 'פעולה שהתחילה בעבר ונמשכת'
                        }
                    },
                    {
                        english: 'has visited',
                        hebrew: 'ביקר',
                        inSentence: {
                            english: 'She has visited Paris three times',
                            hebrew: 'היא ביקרה בפריז שלוש פעמים',
                            explanation: 'התנסות כללית ללא ציון זמן ספציפי'
                        }
                    }
                ],
                commonMistakes: 'שימוש בזמן זה עם ביטויי זמן ספציפיים בעבר, בלבול בין have ל-has, שימוש בצורת עבר רגילה במקום past participle.',
                usageTips: 'משתמשים עם: since, for, never, ever, already, yet, recently.'
            },
            'Future Simple': {
                detailedExplanation: `העתיד הפשוט באנגלית נוצר בעיקר באמצעות will + הפועל הבסיסי. משמש להבעת החלטות ספונטניות, הבטחות, חיזויים, ופעולות שיקרו בעתיד. קיימת גם צורת be going to שמשמשת לתוכניות ומטרות מתוכננות.`,
                examples: [
                    {
                        english: 'will travel',
                        hebrew: 'יסע',
                        inSentence: {
                            english: 'I will travel to London next month',
                            hebrew: 'אני אסע ללונדון בחודש הבא',
                            explanation: 'תכנון או הבטחה לעתיד'
                        }
                    },
                    {
                        english: 'going to rain',
                        hebrew: 'עומד לרדת גשם',
                        inSentence: {
                            english: "It's going to rain tomorrow",
                            hebrew: 'עומד לרדת גשם מחר',
                            explanation: 'חיזוי המבוסס על עדויות נוכחיות'
                        }
                    }
                ],
                commonMistakes: 'בלבול בין will לבין going to, שימוש בצורת עתיד במשפטי תנאי אחרי if.',
                usageTips: 'השתמשו ב-will להחלטות ספונטניות וב-going to לתוכניות מוכנות מראש.'
            },
            'Present Progressive': {
                detailedExplanation: `ההווה המתמשך באנגלית מורכב מ-am/is/are + פועל בצורת ing. משמש לתיאור פעולות שמתרחשות ברגע הדיבור, פעולות זמניות בהווה, ופעולות מתוכננות לעתיד הקרוב.`,
                examples: [
                    {
                        english: 'studying',
                        hebrew: 'לומד (עכשיו)',
                        inSentence: {
                            english: 'I am studying for my exam right now',
                            hebrew: 'אני לומד למבחן שלי עכשיו',
                            explanation: 'פעולה שמתרחשת ברגע הדיבור'
                        }
                    },
                    {
                        english: 'working',
                        hebrew: 'עובד',
                        inSentence: {
                            english: 'She is working in London this month',
                            hebrew: 'היא עובדת בלונדון החודש',
                            explanation: 'מצב זמני בהווה'
                        }
                    }
                ],
                commonMistakes: 'שכחת am/is/are, שגיאות בתוספת ing, שימוש בזמן זה עם פעלים שלא מקבלים צורה מתמשכת.',
                usageTips: 'השתמשו במילים כמו: now, at the moment, currently, these days.'
            },
            'Past Progressive': {
            detailedExplanation: `העבר המתמשך באנגלית מורכב מ-was/were + פועל בצורת ing. משמש לתיאור פעולה שהתרחשה באופן מתמשך בנקודת זמן מסוימת בעבר, או כרקע לפעולה אחרת שקטעה אותה.`,
            examples: [
                {
                    english: 'was reading',
                    hebrew: 'קרא (באופן מתמשך)',
                    inSentence: {
                        english: 'I was reading when the phone rang',
                        hebrew: 'קראתי כשהטלפון צלצל',
                        explanation: 'פעולה מתמשכת שנקטעה על ידי פעולה רגעית'
                    }
                },
                {
                    english: 'were sleeping',
                    hebrew: 'ישנו',
                    inSentence: {
                        english: 'They were sleeping at midnight',
                        hebrew: 'הם ישנו בחצות',
                        explanation: 'פעולה מתמשכת בנקודת זמן ספציפית בעבר'
                    }
                }
            ],
            commonMistakes: 'בלבול בין was ל-were, שכחת ing, שימוש בזמן זה לפעולות שלא יכולות להיות מתמשכות.',
            usageTips: 'השתמשו כדי ליצור רקע לסיפור או לתאר שתי פעולות מקבילות בעבר.'
        },
        'Past Perfect': {
            detailedExplanation: `העבר המושלם באנגלית מורכב מ-had + צורת העבר של הפועל (past participle). משמש לתיאור פעולה שהתרחשה והסתיימה לפני פעולה אחרת בעבר. מדגיש את סדר ההתרחשויות.`,
            examples: [
                {
                    english: 'had finished',
                    hebrew: 'סיים (לפני משהו אחר)',
                    inSentence: {
                        english: 'I had finished my work before she arrived',
                        hebrew: 'סיימתי את העבודה לפני שהיא הגיעה',
                        explanation: 'פעולה שהסתיימה לפני פעולה אחרת בעבר'
                    }
                },
                {
                    english: 'had never seen',
                    hebrew: 'מעולם לא ראה',
                    inSentence: {
                        english: 'I had never seen snow before moving to Canada',
                        hebrew: 'מעולם לא ראיתי שלג לפני שעברתי לקנדה',
                        explanation: 'התנסות שלא קרתה עד נקודה מסוימת בעבר'
                    }
                }
            ],
            commonMistakes: 'שכחת had, שימוש בצורת עבר רגילה במקום past participle, שימוש מיותר כשסדר האירועים ברור.',
            usageTips: 'השתמשו במילים כמו: before, already, never, by the time.'
        },
        "Verbal Participle": {
        "detailedExplanation": `צורת השם הפועלית (Verbal Participle) באנגלית היא צורה מיוחדת של הפועל המתפקדת כתואר או כחלק מזמן מורכב. קיימות שתי צורות עיקריות: צורת הווה (ing-) וצורת עבר (ed- או צורה לא רגילה). צורות אלו יכולות לשמש כתארים, כחלק מזמנים מורכבים, או במבנים תחביריים מיוחדים.`,
        "examples": [
            {
                "english": "running water",
                "hebrew": "מים זורמים",
                "inSentence": {
                    "english": "Running down the street, he saw his friend",
                    "hebrew": "בזמן שרץ ברחוב, הוא ראה את חברו",
                    "explanation": "שימוש בצורת ing- כדי לתאר פעולה המתרחשת במקביל לפעולה העיקרית"
                }
            },
            {
                "english": "broken glass",
                "hebrew": "זכוכית שבורה",
                "inSentence": {
                    "english": "Having finished his work, he went home",
                    "hebrew": "לאחר שסיים את עבודתו, הוא הלך הביתה",
                    "explanation": "שימוש בצורת עבר מושלם (having + past participle) לציון פעולה שקדמה לפעולה אחרת"
                }
            }
        ],
        "commonMistakes": "טעויות נפוצות כוללות שימוש לא נכון בזמנים (למשל having finishing במקום having finished), או יצירת משפטים ארוכים מדי עם מספר צורות פועליות שגורמים לחוסר בהירות.",
        "usageTips": "יש להקפיד שהנושא של הפועל בצורה הפועלית יהיה זהה לנושא המשפט העיקרי. למשל: Running to the bus (הרץ הוא גם הנושא של המשפט העיקרי)."
    },
        'Modal Auxiliary Verb': {
            detailedExplanation: `פועלי עזר מודאליים באנגלית (can, could, may, might, must, should, will, would) משמשים להבעת יכולת, אפשרות, הכרח, המלצה או הרשאה. אחריהם תמיד בא הפועל בצורת הבסיס.`,
            examples: [
                {
                    english: 'can swim',
                    hebrew: 'יכול לשחות',
                    inSentence: {
                        english: 'He can swim very well',
                        hebrew: 'הוא יכול לשחות טוב מאוד',
                        explanation: 'שימוש ב-can להבעת יכולת'
                    }
                },
                {
                    english: 'must study',
                    hebrew: 'חייב ללמוד',
                    inSentence: {
                        english: 'You must study for the exam',
                        hebrew: 'אתה חייב ללמוד למבחן',
                        explanation: 'שימוש ב-must להבעת הכרח'
                    }
                }
            ],
            commonMistakes: 'הוספת to אחרי פועל מודאלי, שימוש בצורת פועל מוטה במקום צורת בסיס.',
            usageTips: 'זכרו: פועל מודאלי + צורת בסיס של הפועל (ללא to).'
        },
        'Third Person Singular Present': {
            detailedExplanation: `בזמן הווה פשוט, בגוף שלישי יחיד (he/she/it) מוסיפים s או es לפועל. יש כללים מיוחדים לפעלים המסתיימים ב-y, o, ch, sh, x, s.`,
            examples: [
                {
                    english: 'writes',
                    hebrew: 'כותב/ת',
                    inSentence: {
                        english: 'She writes poetry',
                        hebrew: 'היא כותבת שירה',
                        explanation: 'הוספת s רגילה לפועל'
                    }
                },
                {
                    english: 'watches',
                    hebrew: 'צופה',
                    inSentence: {
                        english: 'He watches TV every evening',
                        hebrew: 'הוא צופה בטלוויזיה כל ערב',
                        explanation: 'הוספת es אחרי ch'
                    }
                }
            ],
            commonMistakes: 'שכחת הוספת s/es, טעויות בכללי ההוספה (במיוחד עם y).',
            usageTips: 'זכרו את הכללים המיוחדים: y הופך ל-ies, הוספת es אחרי צלילי שריקה.'
        }
        },
        adjectives:{
            'Descriptive': {
                detailedExplanation: `תואר תיאורי באנגלית משמש לתיאור תכונות פיזיות, צבע, גודל או צורה של שם העצם. התואר התיאורי מופיע לפני שם העצם שהוא מתאר, ואינו משתנה בין יחיד לרבים.`,
                examples: [
                    {
                        english: 'red',
                        hebrew: 'אדום',
                        inSentence: {
                            english: 'The red car is parked outside',
                            hebrew: 'המכונית האדומה חונה בחוץ',
                            explanation: 'שימוש בתואר תיאורי של צבע לפני שם העצם'
                        }
                    },
                    {
                        english: 'big',
                        hebrew: 'גדול',
                        inSentence: {
                            english: 'I live in a big house',
                            hebrew: 'אני גר בבית גדול',
                            explanation: 'שימוש בתואר תיאורי של גודל'
                        }
                    }
                ],
                commonMistakes: 'טעויות נפוצות כוללות שינוי צורת התואר ברבים או שימוש בסדר מילים לא נכון.',
                usageTips: 'זכרו שבאנגלית התואר תמיד מופיע לפני שם העצם, בניגוד לעברית.'
            },
            'Qualitative': {
                detailedExplanation: `תואר איכותי באנגלית מתאר תכונות אופי, רגשות או מצבים. בניגוד לתואר תיאורי שמתאר תכונות פיזיות, התואר האיכותי מתייחס למאפיינים מופשטים יותר.`,
                examples: [
                    {
                        english: 'happy',
                        hebrew: 'שמח',
                        inSentence: {
                            english: 'She is a happy person',
                            hebrew: 'היא אדם שמח',
                            explanation: 'שימוש בתואר איכותי לתיאור אופי'
                        }
                    },
                    {
                        english: 'intelligent',
                        hebrew: 'חכם',
                        inSentence: {
                            english: 'The intelligent student solved the problem',
                            hebrew: 'התלמיד החכם פתר את הבעיה',
                            explanation: 'שימוש בתואר איכותי לתיאור תכונה מנטלית'
                        }
                    }
                ],
                commonMistakes: 'טעויות נפוצות כוללות בלבול בין תארים איכותיים לתיאוריים, או שימוש לא נכון במבנים כמו very/too.',
                usageTips: 'ניתן להשתמש במילים כמו very, quite, extremely לפני תואר איכותי כדי להדגיש את עוצמת התכונה.'
            },
            'Adjectival Participle': {
                detailedExplanation: `תואר פועלי באנגלית נוצר משימוש בצורת ההווה (ing-) או העבר (ed-) של הפועל כתואר. צורה זו מאפשרת לתאר מצב או פעולה שמתרחשת או התרחשה.`,
                examples: [
                    {
                        english: 'running',
                        hebrew: 'רץ',
                        inSentence: {
                            english: 'The running water is cold',
                            hebrew: 'המים הזורמים קרים',
                            explanation: 'שימוש בצורת הווה של הפועל כתואר'
                        }
                    },
                    {
                        english: 'broken',
                        hebrew: 'שבור',
                        inSentence: {
                            english: 'The broken glass needs to be cleaned',
                            hebrew: 'הזכוכית השבורה צריכה להיות מנוקה',
                            explanation: 'שימוש בצורת עבר של הפועל כתואר'
                        }
                    }
                ],
                commonMistakes: 'טעויות נפוצות כוללות שימוש לא נכון בצורת ing- או ed-, או בלבול בין פעיל לסביל.',
                usageTips: 'השתמשו ב-ing כשמתארים משהו שמבצע את הפעולה, וב-ed כשמתארים משהו שהפעולה נעשתה עליו.'
            },
            'Positive': {
    detailedExplanation: `הצורה הרגילה (Positive) היא צורת הבסיס של תואר השם באנגלית, ללא השוואה לדברים אחרים. זוהי צורת התואר הבסיסית המופיעה במילון. משתמשים בה לתיאור תכונה של דבר מסוים באופן עצמאי, ללא יחס לדברים אחרים.`,
    examples: [
        {
            english: 'big',
            hebrew: 'גדול',
            inSentence: {
                english: 'This is a big house',
                hebrew: 'זה בית גדול',
                explanation: 'שימוש בתואר בצורתו הרגילה לתיאור תכונה'
            }
        },
        {
            english: 'beautiful',
            hebrew: 'יפה',
            inSentence: {
                english: 'She has a beautiful garden',
                hebrew: 'יש לה גינה יפה',
                explanation: 'שימוש בתואר ארוך בצורתו הרגילה'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא לחשוב שצורת הבסיס חייבת להיות מילה קצרה. גם תארים ארוכים יכולים להיות בצורה רגילה כמו: interesting, complicated.',
    usageTips: 'השתמשו בצורה הרגילה כאשר אתם מתארים משהו ללא השוואה לדברים אחרים. ניתן להשתמש במילים כמו very או quite לפני התואר כדי להדגיש את עוצמתו: "very big", "quite interesting".'
    },
            'Comparative': {
                detailedExplanation: `צורת ההשוואה באנגלית משמשת להשוואה בין שני דברים. נוצרת על ידי הוספת er- לתארים קצרים או more לתארים ארוכים. תמיד משתמשים במילה than אחרי התואר ההשוואתי.`,
                examples: [
                    {
                        english: 'bigger',
                        hebrew: 'גדול יותר',
                        inSentence: {
                            english: 'My house is bigger than yours',
                            hebrew: 'הבית שלי גדול יותר משלך',
                            explanation: 'השוואה עם תואר קצר והוספת er'
                        }
                    },
                    {
                        english: 'more beautiful',
                        hebrew: 'יפה יותר',
                        inSentence: {
                            english: 'This painting is more beautiful than that one',
                            hebrew: 'הציור הזה יפה יותר מההוא',
                            explanation: 'השוואה עם תואר ארוך והוספת more'
                        }
                    }
                ],
                commonMistakes: 'טעויות נפוצות כוללות שימוש ב-er ו-more יחד, או שכחת than בהשוואה.',
                usageTips: 'השתמשו ב-er לתארים של הברה אחת, more לתארים של שלוש הברות ומעלה. לתארים של שתי הברות, בדקו במילון.'
            },
            'Superlative': {
                detailedExplanation: `צורת העליון באנגלית מציינת את הדרגה הגבוהה ביותר של תכונה בקבוצה. נוצרת על ידי הוספת est- לתארים קצרים או most לתארים ארוכים. תמיד משתמשים ב-the לפני התואר בצורת העליון.`,
                examples: [
                    {
                        english: 'biggest',
                        hebrew: 'הכי גדול',
                        inSentence: {
                            english: 'This is the biggest house in the neighborhood',
                            hebrew: 'זהו הבית הגדול ביותר בשכונה',
                            explanation: 'שימוש בצורת העליון עם תואר קצר'
                        }
                    },
                    {
                        english: 'most beautiful',
                        hebrew: 'היפה ביותר',
                        inSentence: {
                            english: 'This is the most beautiful garden I have ever seen',
                            hebrew: 'זהו הגן היפה ביותר שראיתי',
                            explanation: 'שימוש בצורת העליון עם תואר ארוך'
                        }
                    }
                ],
                commonMistakes: 'טעויות נפוצות כוללות שכחת the לפני צורת העליון, או שימוש ב-est ו-most יחד.',
                usageTips: 'זכרו להשתמש ב-the לפני כל צורת עליון. בתארים המסתיימים ב-y, שנו ל-i לפני הוספת est.'
            },
            'Attributive': {
        detailedExplanation: `תואר מייחס באנגלית מופיע תמיד לפני שם העצם אותו הוא מתאר. זוהי הצורה הנפוצה ביותר של שימוש בתארים באנגלית, והיא משמשת לתיאור ישיר של שם העצם.`,
        examples: [
            {
                english: 'red car',
                hebrew: 'מכונית אדומה',
                inSentence: {
                    english: 'I bought a new red car',
                    hebrew: 'קניתי מכונית אדומה חדשה',
                    explanation: 'התואר new וגם red מופיעים לפני שם העצם car'
                }
            },
            {
                english: 'happy child',
                hebrew: 'ילד שמח',
                inSentence: {
                    english: 'The happy child played in the park',
                    hebrew: 'הילד השמח שיחק בפארק',
                    explanation: 'התואר happy מופיע לפני שם העצם child'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות הצבת התואר אחרי שם העצם (בדומה לעברית) או סדר לא נכון כאשר יש מספר תארים.',
        usageTips: 'כשיש מספר תארים, יש סדר קבוע: גודל, צורה, גיל, צבע, מוצא.'
    },
    'Derived adjective': {
    detailedExplanation: `תואר נגזר באנגלית הוא תואר שנוצר משם עצם, פועל, או מילה אחרת בתוספת סיומת. תארים הנגזרים משמות עצם (Denominative adjectives) לרוב נוצרים באמצעות סיומות כמו -y, -ful, -al, -ous, -ic, ועוד. הם מבטאים תכונה, מאפיין או קשר למילת הבסיס.`,
    examples: [
        {
            english: 'watery',
            hebrew: 'מימי',
            inSentence: {
                english: 'The soup was too watery',
                hebrew: 'המרק היה מימי מדי',
                explanation: 'תואר המתאר משהו שמכיל מים רבים או דומה למים, נגזר מהמילה water בתוספת הסיומת -y'
            }
        },
        {
            english: 'powerful',
            hebrew: 'רב-עוצמה',
            inSentence: {
                english: 'She gave a powerful speech',
                hebrew: 'היא נשאה נאום רב-עוצמה',
                explanation: 'תואר המתאר משהו בעל כוח או השפעה, נגזר מהמילה power בתוספת הסיומת -ful'
            }
        }
    ],
    commonMistakes: 'טעויות נפוצות כוללות בלבול בין תארים נגזרים לבין שמות עצם מורכבים, או שימוש לא נכון בסיומות.',
    usageTips: 'שים לב לשינויי איות שעשויים להתרחש כשמוסיפים סיומת לשם עצם, כמו השמטת e אחרונה או הכפלת אות.'
},
    'Predicative': {
        detailedExplanation: `תואר מנבא מופיע אחרי פועל קישור (be, seem, look, feel, etc.) ומתייחס לנושא המשפט. בניגוד לתואר מייחס, הוא אינו מופיע צמוד לשם העצם.`,
        examples: [
            {
                english: 'is red',
                hebrew: 'הוא אדום',
                inSentence: {
                    english: 'The sky is red at sunset',
                    hebrew: 'השמיים אדומים בשקיעה',
                    explanation: 'התואר red מופיע אחרי פועל הקישור is'
                }
            },
            {
                english: 'seems happy',
                hebrew: 'נראה שמח',
                inSentence: {
                    english: 'She seems happy today',
                    hebrew: 'היא נראית שמחה היום',
                    explanation: 'התואר happy מופיע אחרי פועל הקישור seems'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות שימוש בפועל רגיל במקום פועל קישור, או הוספת מילות קישור מיותרות.',
        usageTips: 'פעלים נפוצים המשמשים כפועלי קישור: be, seem, appear, look, feel, taste, smell, sound.'
    },
    'Demonstrative': {
        detailedExplanation: `תואר מראה משמש להצביע על מיקום או מרחק של שם העצם. יש ארבעה תארי מראה באנגלית: this (קרוב, יחיד), that (רחוק, יחיד), these (קרוב, רבים), those (רחוק, רבים).`,
        examples: [
            {
                english: 'this book',
                hebrew: 'הספר הזה',
                inSentence: {
                    english: 'This book belongs to me',
                    hebrew: 'הספר הזה שייך לי',
                    explanation: 'שימוש ב-this להצבעה על חפץ קרוב ביחיד'
                }
            },
            {
                english: 'those cars',
                hebrew: 'המכוניות ההן',
                inSentence: {
                    english: 'Those cars are expensive',
                    hebrew: 'המכוניות ההן יקרות',
                    explanation: 'שימוש ב-those להצבעה על חפצים רחוקים ברבים'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות אי-התאמה בין יחיד לרבים, או שימוש ב-these/those עם שמות עצם לא ספירים.',
        usageTips: 'זכרו להתאים את תואר המראה למספר (יחיד/רבים) של שם העצם.'
    },
    'Possessive': {
        detailedExplanation: `תואר שייכות מציין בעלות או שייכות. באנגלית, תארי השייכות משתנים לפי הגוף (my, your, his, her, its, our, their) ומופיעים תמיד לפני שם העצם.`,
        examples: [
            {
                english: 'my book',
                hebrew: 'הספר שלי',
                inSentence: {
                    english: 'I lost my book yesterday',
                    hebrew: 'איבדתי את הספר שלי אתמול',
                    explanation: 'שימוש בתואר השייכות my לציון בעלות'
                }
            },
            {
                english: 'their house',
                hebrew: 'הבית שלהם',
                inSentence: {
                    english: 'Their house is very big',
                    hebrew: 'הבית שלהם מאוד גדול',
                    explanation: 'שימוש בתואר השייכות their לציון בעלות של קבוצה'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות בלבול בין תארי שייכות לכינויי שייכות, או שימוש בצורת s\' כשלא צריך.',
        usageTips: 'אין צורך להוסיף את המילה own אלא אם רוצים להדגיש את הבעלות.'
    },
    'Quantitative': {
        detailedExplanation: `תואר כמותי מציין כמות או מספר. יש תארים כמותיים לשמות עצם ספירים (many, few, several) ולשמות עצם לא ספירים (much, little). חלק מהתארים הכמותיים יכולים לשמש את שני הסוגים (some, any).`,
        examples: [
            {
                english: 'many books',
                hebrew: 'הרבה ספרים',
                inSentence: {
                    english: 'I have many books to read',
                    hebrew: 'יש לי הרבה ספרים לקרוא',
                    explanation: 'שימוש ב-many עם שם עצם ספיר ברבים'
                }
            },
            {
                english: 'little water',
                hebrew: 'מעט מים',
                inSentence: {
                    english: 'There is little water left',
                    hebrew: 'נשארו מעט מים',
                    explanation: 'שימוש ב-little עם שם עצם לא ספיר'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות שימוש ב-many עם שמות עצם לא ספירים או much עם שמות עצם ספירים.',
        usageTips: 'זכרו: many/few לספירים, much/little ללא ספירים, some/any לשניהם.'
    },
    'Feature Adjective': {
    detailedExplanation: `תואר תכונה באנגלית מתאר מאפיין או תכונה מהותית של שם עצם. הוא מציין איכות, מצב או תכונה קבועה יחסית שמאפיינת את הדבר או האדם שאליו מתייחסים. תארי תכונה שונים מתארי מצב בכך שהם נוטים להיות יותר קבועים ופחות זמניים.`,
    examples: [
        {
            english: 'intelligent',
            hebrew: 'אינטליגנטי',
            inSentence: {
                english: 'She is an intelligent student who solves problems quickly',
                hebrew: 'היא תלמידה אינטליגנטית שפותרת בעיות במהירות',
                explanation: 'מתאר תכונה קוגניטיבית מהותית של התלמידה'
            }
        },
        {
            english: 'wooden',
            hebrew: 'עשוי מעץ',
            inSentence: {
                english: 'They built a wooden bridge across the stream',
                hebrew: 'הם בנו גשר עץ מעל הנחל',
                explanation: 'מתאר את החומר המהותי ממנו עשוי הגשר'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא בלבול בין תארי תכונה לבין תארי מצב זמניים. למשל, אמירה כמו "he is intelligent" (תכונה קבועה) לעומת "he is tired" (מצב זמני).',
    usageTips: 'תארי תכונה מופיעים לעתים קרובות לפני שם העצם שהם מתארים, אך יכולים גם להופיע אחרי פעלים כמו be, seem, appear. רבים מתארי התכונה יכולים להשתנות בדרגות השוואה (intelligent, more intelligent, most intelligent).'
}
        },
        adverbs:{
            'Adverb Form': {
    detailedExplanation: `צורת תואר הפועל באנגלית היא קטגוריה דקדוקית המתארת איך, מתי, היכן או באיזו מידה מתבצעת פעולה. רוב תוארי הפועל נוצרים מתארים בתוספת הסיומת -ly, אך ישנם גם תוארי פועל שאינם עוקבים אחר כלל זה. תוארי פועל יכולים לתאר פעלים, תארים או תוארי פועל אחרים.`,
    examples: [
        {
            english: 'quickly',
            hebrew: 'במהירות',
            inSentence: {
                english: 'The athlete ran quickly across the finish line',
                hebrew: 'האתלט רץ במהירות אל קו הסיום',
                explanation: 'נוצר מהתואר quick בתוספת -ly, מתאר את אופן הריצה'
            }
        },
        {
            english: 'well',
            hebrew: 'היטב',
            inSentence: {
                english: 'She speaks English well despite not being a native speaker',
                hebrew: 'היא מדברת אנגלית היטב למרות שאינה דוברת ילידית',
                explanation: 'תואר פועל לא רגולרי (לא נגמר ב-ly), מתאר את אופן הדיבור'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא שימוש בתואר במקום בתואר פועל (he speaks slow במקום he speaks slowly). טעות נוספת היא מיקום לא נכון של תואר הפועל במשפט.',
    usageTips: 'תוארי פועל הם גמישים במיקומם במשפט, אך המיקום משפיע על המשמעות. לרוב, תוארי פועל המתארים אופן מופיעים אחרי הפועל או בסוף המשפט. חלק מהתארים והתוארי פועל החשובים ביותר אינם עוקבים אחר כלל ה-ly, כגון fast, hard, well.'
},

'Description Adverb': {
    detailedExplanation: `תואר פועל תיאורי באנגלית הוא סוג ספציפי של תואר פועל המתאר את האופן שבו מתבצעת פעולה. הוא עונה על השאלה "איך?" ומוסיף מידע על הסגנון, הטון, המהירות, העוצמה או התחושה של הפעולה המתוארת. תוארי פועל תיאוריים הם הקבוצה הנפוצה ביותר של תוארי פועל.`,
    examples: [
        {
            english: 'carefully',
            hebrew: 'בזהירות',
            inSentence: {
                english: 'The surgeon operated carefully on the patient',
                hebrew: 'המנתח ניתח את המטופל בזהירות',
                explanation: 'מתאר את האופן הזהיר והדייקני שבו בוצע הניתוח'
            }
        },
        {
            english: 'loudly',
            hebrew: 'בקול רם',
            inSentence: {
                english: 'The children laughed loudly at the clown\'s antics',
                hebrew: 'הילדים צחקו בקול רם למעשי הליצן',
                explanation: 'מתאר את עוצמת הצחוק של הילדים'
            }
        }
    ],
    commonMistakes: 'טעות נפוצה היא ערבוב בין תוארי פועל תיאוריים לבין סוגים אחרים של תוארי פועל, כמו תוארי פועל של זמן או מקום. לעתים יש בלבול עם תארים שמתארים את הנושא במקום את הפעולה.',
    usageTips: 'תוארי פועל תיאוריים הם כלי חשוב להעשרת השפה ולהוספת גוון וחיים לתיאור פעולות. כדאי למקם אותם קרוב לפועל שהם מתארים כדי להבהיר את הקשר ביניהם. בכתיבה יצירתית, תוארי פועל תיאוריים יכולים להמחיש תמונה חיה יותר, אך יש להיזהר משימוש יתר.'
}
        },
    functionWords:{
        'Pronoun': {
            detailedExplanation: `כינויי גוף באנגלית מחליפים שמות עצם כדי למנוע חזרות. הם משתנים לפי תפקיד (נושא/מושא), מספר (יחיד/רבים), מין (זכר/נקבה/נייטרלי), וגוף (ראשון/שני/שלישי).`,
            examples: [
                {
                    english: 'he',
                    hebrew: 'הוא',
                    inSentence: {
                        english: 'John is tired. He needs to rest',
                        hebrew: 'ג׳ון עייף. הוא צריך לנוח',
                        explanation: 'שימוש בכינוי גוף he במקום חזרה על השם ג׳ון'
                    }
                },
                {
                    english: 'them',
                    hebrew: 'אותם/אותן',
                    inSentence: {
                        english: 'I saw the books and bought them',
                        hebrew: 'ראיתי את הספרים וקניתי אותם',
                        explanation: 'שימוש בכינוי מושא them במקום חזרה על books'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות בלבול בין כינויי נושא למושא, או אי-התאמה במין ומספר.',
            usageTips: 'יש להקפיד על בהירות במשפט - שיהיה ברור למה הכינוי מתייחס.'
        },
        'Preposition': {
            detailedExplanation: `מילות יחס באנגלית מציינות קשרים של מקום, זמן, או יחס בין מילים במשפט. הן מופיעות לפני שם העצם או כינוי הגוף ויוצרות יחד צירוף יחס.`,
            examples: [
                {
                    english: 'in',
                    hebrew: 'בתוך',
                    inSentence: {
                        english: 'The book is in the bag',
                        hebrew: 'הספר בתוך התיק',
                        explanation: 'שימוש במילת היחס in לציון מיקום'
                    }
                },
                {
                    english: 'with',
                    hebrew: 'עם',
                    inSentence: {
                        english: 'She went with her friends',
                        hebrew: 'היא הלכה עם חבריה',
                        explanation: 'שימוש במילת היחס with לציון ליווי'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות תרגום ישיר מעברית או השמטת מילות יחס הכרחיות.',
            usageTips: 'זכרו שבאנגלית יש מילות יחס קבועות אחרי פעלים מסוימים (depend on, wait for).'
        },
        'Conjunction': {
            detailedExplanation: `מילות חיבור באנגלית משמשות לחיבור בין מילים, ביטויים או משפטים. הן מתחלקות למילות חיבור מתאמות (and, or, but) ומילות חיבור משעבדות (because, although, when).`,
            examples: [
                {
                    english: 'and',
                    hebrew: 'ו-',
                    inSentence: {
                        english: 'I like coffee and tea',
                        hebrew: 'אני אוהב קפה ותה',
                        explanation: 'שימוש ב-and לחיבור פשוט בין שני דברים'
                    }
                },
                {
                    english: 'because',
                    hebrew: 'כי',
                    inSentence: {
                        english: 'I stayed home because it was raining',
                        hebrew: 'נשארתי בבית כי ירד גשם',
                        explanation: 'שימוש ב-because להסבר סיבה'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות שימוש לא נכון בפסיק לפני מילות חיבור או סדר מילים שגוי במשפט משועבד.',
            usageTips: 'אחרי מילת חיבור משעבדת חייב לבוא משפט שלם עם נושא ונשוא.'
        },
        'Article': {
            detailedExplanation: `מילות הגדרה באנגלית מחולקות למוגדר (the) ובלתי מוגדר (a/an). The משמש כשמדברים על משהו ספציפי או ידוע, a/an משמשים כשמדברים על משהו כללי או לא מוכר.`,
            examples: [
                {
                    english: 'the',
                    hebrew: 'ה-',
                    inSentence: {
                        english: 'The car I bought is red',
                        hebrew: 'המכונית שקניתי היא אדומה',
                        explanation: 'שימוש ב-the כי מדובר במכונית ספציפית'
                    }
                },
                {
                    english: 'a/an',
                    hebrew: 'אחד/אחת',
                    inSentence: {
                        english: 'I need a new computer',
                        hebrew: 'אני צריך מחשב חדש',
                        explanation: 'שימוש ב-a כי מדובר במחשב כלשהו, לא ספציפי'
                    }
                }
            ],
            commonMistakes: 'טעויות נפוצות כוללות השמטת מילות הגדרה, שימוש ב-the כשלא צריך, או בלבול בין a ל-an.',
            usageTips: 'השתמשו ב-an לפני מילים שמתחילות בצליל תנועה (an apple), a לפני צליל עיצור (a book).'
        },
        'Modal Particle': {
        detailedExplanation: `מילות מודוס באנגלית מביעות רגש, הדגשה או יחס רגשי למשפט. הן אינן משנות את המשמעות הבסיסית של המשפט אלא מוסיפות גוון רגשי.`,
        examples: [
            {
                english: 'oh',
                hebrew: 'אוי',
                inSentence: {
                    english: 'Oh, I forgot my keys!',
                    hebrew: 'אוי, שכחתי את המפתחות שלי!',
                    explanation: 'שימוש ב-oh להבעת הפתעה או צער'
                }
            },
            {
                english: 'well',
                hebrew: 'ובכן',
                inSentence: {
                    english: "Well, that's interesting",
                    hebrew: 'ובכן, זה מעניין',
                    explanation: 'שימוש ב-well להבעת מחשבה או היסוס'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות שימוש יתר במילות מודוס או שימוש בהקשר לא מתאים.',
        usageTips: 'השתמשו במילות מודוס בעיקר בשפה מדוברת ובכתיבה לא פורמלית.'
    },
    'Auxiliary Verb': {
        detailedExplanation: `פועלי עזר באנגלית משמשים ליצירת זמנים מורכבים, שאלות, שלילות ומבני דקדוק שונים. הם תמיד מופיעים לפני הפועל העיקרי ומשנים את צורתו.`,
        examples: [
            {
                english: 'do',
                hebrew: 'עושה',
                inSentence: {
                    english: 'Do you like coffee?',
                    hebrew: 'האם אתה אוהב קפה?',
                    explanation: 'שימוש ב-do ליצירת שאלה'
                }
            },
            {
                english: 'have',
                hebrew: 'יש',
                inSentence: {
                    english: 'I have finished my work',
                    hebrew: 'סיימתי את העבודה שלי',
                    explanation: 'שימוש ב-have ליצירת זמן הווה מושלם'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות השמטת פועל עזר בשאלות או שימוש לא נכון בזמנים מורכבים.',
        usageTips: 'זכרו: be משמש לזמן מתמשך, have לזמנים מושלמים, do לשאלות ושלילות בזמן הווה ועבר פשוט.'
    },
    'Determiner': {
        detailedExplanation: `מגדירים באנגלית הם מילים המופיעות לפני שם העצם ומספקות מידע על כמות, בעלות, או התייחסות. הם משפיעים על המשמעות הספציפית של שם העצם.`,
        examples: [
            {
                english: 'some',
                hebrew: 'כמה',
                inSentence: {
                    english: 'I need some water',
                    hebrew: 'אני צריך קצת מים',
                    explanation: 'שימוש ב-some לציון כמות לא מוגדרת'
                }
            },
            {
                english: 'every',
                hebrew: 'כל',
                inSentence: {
                    english: 'Every student must attend',
                    hebrew: 'כל תלמיד חייב להגיע',
                    explanation: 'שימוש ב-every לציון כלליות'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות שימוש במגדיר לא מתאים עם שמות עצם ספירים/לא ספירים.',
        usageTips: 'בדקו אם שם העצם ספיר או לא ספיר לפני בחירת המגדיר המתאים.'
    },
    'Interjection': {
        detailedExplanation: `מילות קריאה באנגלית מביעות רגשות או תגובות פתאומיות. הן עומדות בפני עצמן ואינן קשורות דקדוקית למשפט. לרוב מסתיימות בסימן קריאה.`,
        examples: [
            {
                english: 'wow',
                hebrew: 'וואו',
                "inSentence": {
                "english": "Wow! That's amazing!",
                "hebrew": "וואו! זה מדהים!",
                "explanation": "שימוש ב-wow להבעת התפעלות"
            }
            },
            {
                english: 'ouch',
                hebrew: 'אוץ׳',
                inSentence: {
                    english: 'Ouch! That hurts!',
                    hebrew: 'אוץ׳! זה כואב!',
                    explanation: 'שימוש ב-ouch להבעת כאב'
                }
            }
        ],
        commonMistakes: 'טעויות נפוצות כוללות שימוש במילות קריאה בכתיבה פורמלית או שימוש יתר בסימני קריאה.',
        usageTips: 'השתמשו במילות קריאה בעיקר בשיחה יומיומית ובכתיבה לא פורמלית.'
    },
    'Negative Forms': {
    detailedExplanation: `צורות שלילה באנגלית הן מבנים דקדוקיים המשמשים להפוך משפט או ביטוי מחיובי לשלילי. קיימות מספר דרכים ליצור שלילה, כולל שימוש ב-not עם פעלי עזר, שימוש במילות שלילה כמו no, never, nowhere, וכן שימוש בתחיליות שליליות כמו un-, in-, dis-.`,
    examples: [
        {
            english: 'not going',
            hebrew: 'לא הולך',
            inSentence: {
                english: 'I am not going to the party tonight',
                hebrew: 'אני לא הולך למסיבה הערב',
                explanation: 'שלילה באמצעות not עם פועל העזר am'
            }
        },
        {
            english: 'unhappy',
            hebrew: 'לא מאושר',
            inSentence: {
                english: 'She seemed unhappy with the results',
                hebrew: 'היא נראתה לא מאושרת מהתוצאות',
                explanation: 'שלילה באמצעות התחילית un- לתואר happy'
            }
        }
    ],
    commonMistakes: 'טעויות נפוצות כוללות שימוש כפול בשלילה (double negatives) שבאנגלית תקנית נחשב לשגוי, שימוש בתחילית שלילה לא מתאימה, או השמטת פועל העזר בשלילה.',
    usageTips: 'בחרו בצורת השלילה המתאימה לפי הקשר המשפט. זכרו שבאנגלית תקנית, רק מילת שלילה אחת מותרת במשפט. שימו לב שלתחיליות שליליות שונות יש העדפות לסוגים שונים של מילים (un- לרוב עם תארים, dis- לעתים קרובות עם פעלים).'
},
'Contractions': {
    detailedExplanation: `קיצורים באנגלית (Contractions) הם צורות מקוצרות שנוצרות על-ידי חיבור שתי מילים והחלפת חלק מהאותיות בגרש ('). קיצורים נפוצים במיוחד בשפה מדוברת ובכתיבה לא פורמלית. הם בדרך כלל מחברים פועלי עזר או "not" עם מילים אחרות.`,
    examples: [
        {
            english: "don't",
            hebrew: "לא עושה",
            inSentence: {
                english: "I don't understand the question",
                hebrew: "אני לא מבין את השאלה",
                explanation: "קיצור של do not למילה אחת"
            }
        },
        {
            english: "I'm",
            hebrew: "אני",
            inSentence: {
                english: "I'm going to the store now",
                hebrew: "אני הולך לחנות עכשיו",
                explanation: "קיצור של I am למילה אחת"
            }
        },
        {
            english: "won't",
            hebrew: "לא יעשה",
            inSentence: {
                english: "She won't arrive until tomorrow",
                hebrew: "היא לא תגיע עד מחר",
                explanation: "קיצור לא רגיל של will not (לא will + not)"
            }
        }
    ],
    commonMistakes: "טעויות נפוצות כוללות שימוש בקיצורים בכתיבה פורמלית מאוד, בלבול בין קיצורים דומים כמו they're/their/there, שימוש לא נכון בגרש, או יצירת קיצורים שאינם קיימים באנגלית תקנית.",
    usageTips: "השתמשו בקיצורים כדי ליצור טון טבעי ושוטף בכתיבה לא פורמלית ובדיבור. בכתיבה אקדמית או פורמלית מאוד, השתדלו להימנע מקיצורים. זכרו שלחלק מהקיצורים יש צורות ייחודיות שלא תמיד מובנות מאליהן (כמו won't במקום will not)."
}
    }
           
};

export default ExtendedInflectionDetails;