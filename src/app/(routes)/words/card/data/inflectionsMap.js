const INFLECTIONS_MAP = {
    nouns: {
        abbreviation: 'N',
        patterns: [
            'Singular',
            'Plural',
            'Process-Result Noun',
            'Quality Noun',
            'Gerund',
            'Recipient Noun',
            'Action Performer Noun',
            'Purpose Noun',
            'Size Modifier Noun',
            'State Noun'
        ],
        descriptions: {
            'Singular': 'דבר אחד. לדוגמה: ספר, כלב, רעיון.',
            'Plural': 'יותר מאחד. לדוגמה: ספרים, כלבים, רעיונות.',
            'Process-Result Noun': 'מילה שמתארת גם את הפעולה וגם את התוצאה שלה. לדוגמה: "בנייה" - זה גם התהליך של לבנות וגם הבניין שנבנה.',
            'Quality Noun': 'מילה שמתארת תכונה או תחושה. לדוגמה: מ"שמח" נוצר "שמחה", מ"חכם" נוצר "חוכמה".',
            'Gerund': 'פועל שהופך לשם עצם בעזרת ing. לדוגמה: "לרוץ" (run) הופך ל"ריצה" (running). עוזר לדבר על פעולה כאילו היא דבר.',
            'Recipient Noun': 'מי שמקבל או עובר משהו. לדוגמה: "עובד" (employee) - מי שמקבל עבודה, "מרואיין" (interviewee) - מי שעובר ראיון.',
            'Action Performer Noun': 'מי שעושה את הפעולה. לדוגמה: "מורה" (teacher) - מי שמלמד, "שחקן" (player) - מי ששחק.',
            'Purpose Noun': 'מקום או דבר שמיועד למטרה מסוימת. לדוגמה: "מאפייה" - מקום לאפות, "מעבדה" - מקום לניסויים.',
            'Size Modifier Noun': 'מילה שמציינת גודל. לדוגמה: "מיקרופון" (טלפון קטן), "חוברת" (ספר קטן), "חנות ענק" (חנות גדולה מאוד).',
            'State Noun': 'מילה שמתארת מצב או תחושה. לדוגמה: "עייפות" - מצב של להיות עייף, "חולי" - מצב של להיות חולה.'
        }   
    },
    verbs: {
        abbreviation: 'V',
        patterns: [
            'Present Simple',
            'Past Simple',
            'Future Simple',
            'Present Progressive',
            'Past Progressive',
            'Present Perfect',
            'Past Perfect',
            'Verb Infinitive',
            'Third Person Singular'
        ],
        descriptions: {
            'Present Simple': 'מה שקורה בדרך כלל או כל הזמן. לדוגמה: "אני הולך לבית הספר", "השמש זורחת".',
            'Past Simple': 'משהו שקרה ונגמר בעבר. לדוגמה: "אתמול הלכתי לקניות", "הוא אכל ארוחת צהריים".',
            'Future Simple': 'משהו שיקרה בעתיד. לדוגמה: "מחר אלך לים", "בשבוע הבא אבקר אותך".',
            'Present Progressive': 'משהו שקורה עכשיו בדיוק או בקרוב. לדוגמה: "אני לומד עכשיו", "מחר אני נוסע לתל אביב".',
            'Past Progressive': 'משהו שהיה באמצע בעבר. לדוגמה: "הייתי קורא כשהוא התקשר", "הם היו משחקים בחצר".',
            'Present Perfect': 'משהו שקרה בעבר אבל עדיין חשוב עכשיו. לדוגמה: "אני גר פה שנתיים" (התחלתי בעבר ועדיין גר).',
            'Past Perfect': 'משהו שקרה לפני משהו אחר בעבר. לדוגמה: "כשהגעתי, הוא כבר הלך" (ההליכה הייתה לפני ההגעה).',
            'Verb Infinitive': 'צורת המקור של הפועל עם "to". לדוגמה: "to run" (לרוץ), "to eat" (לאכול). משמש אחרי פעלים אחרים: "אני רוצה ללכת".',
            'Third Person Singular': 'הפועל עם "הוא/היא/זה" בהווה. לדוגמה: "he runs" (הוא רץ), "she eats" (היא אוכלת). מוסיפים s או es.'
        }
    },
    adjectives: {
        abbreviation: 'A',
        patterns: [
            'Positive',
            'Comparative',
            'Superlative',
            'Possessive',
            'Adjectival Participle',
            'Feature Adjective'
        ],
        descriptions: {
            'Positive': 'תיאור רגיל בלי השוואה. לדוגמה: "גבוה", "יפה", "מהיר".',
            'Comparative': 'השוואה בין שני דברים. לדוגמה: "גבוה יותר", "יותר יפה", "מהיר יותר".',
            'Superlative': 'הכי מכולם (מינימום שלושה). לדוגמה: "הכי גבוה", "הכי יפה", "הכי מהיר".',
            'Possessive': 'מציין שמשהו שייך למישהו. לדוגמה: "של דני" (Danny\'s), "שלי" (my), "שלהם" (their).',
            'Adjectival Participle': 'פועל שמתאר תחושה או מצב. לדוגמה: "מרגש", "משעמם", "מעניין", "מבולבל".',
            'Feature Adjective': 'תיאור של איך משהו נראה או מרגיש. לדוגמה: "יפה", "רועש", "מועיל", "מפחיד".'
        }
    },
    adverbs: {
        abbreviation: 'D',
        patterns: [
            'Adverb Form',
            'Description Adverb'
        ],
        descriptions: {
            'Adverb Form': 'מילה שמתארת איך, מתי או איפה משהו קורה. לדוגמה: "מהר", "היום", "פה".',
            'Description Adverb': 'תיאור של איך נעשית הפעולה, בדרך כלל עם סיומת ly. לדוגמה: "במהירות" (quickly), "בשקט" (quietly).'
        }
    },
    functionWords: {
        abbreviation: 'F',
        patterns: [
            'Pronoun',
            'Preposition',
            'Conjunction',
            'Article',
            'Determiner',
            'Auxiliary Verb',
            'Modal Particle',
            'Negative Forms',
            'Contractions'
        ],
        descriptions: {
            'Pronoun': 'מילה שמחליפה שם. לדוגמה: "אני", "אתה", "היא", "הם", "זה".',
            'Preposition': 'מילה שמראה יחס בין דברים. לדוגמה: "על", "מתחת", "ליד", "אחרי", "לפני".',
            'Conjunction': 'מילה שמחברת בין דברים. לדוגמה: "ו", "או", "אבל", "כי", "אם".',
            'Article': 'מילה קטנה לפני שם עצם. "a/an" = משהו כללי, "the" = משהו מסוים שכבר מכירים.',
            'Determiner': 'מילה שאומרת לנו כמה או איזה. לדוגמה: "זה", "כל", "הרבה", "קצת", "שלי".',
            'Auxiliary Verb': 'פועל עזר שבא עם פועל אחר. לדוגמה: "אני הייתי אוכל", "הם יכולים לרוץ".',
            'Modal Particle': 'מילה שמבטאת יכולת, אפשרות או חובה. לדוגמה: "יכול" (can), "צריך" (should), "חייב" (must).',
            'Negative Forms': 'מילים ששולחות "לא". לדוגמה: "לא נעים" (unpleasant), "בלתי אפשרי" (impossible).',
            'Contractions': 'שתי מילים שהתחברו לאחת עם גרש. לדוגמה: "don\'t" (do not), "I\'m" (I am), "can\'t" (cannot).'
        }
    }
};

export default INFLECTIONS_MAP;