export const PartsOfSpeechContent = {
    nouns: {
        fullName: 'Nouns - שמות עצם',
        title: 'מה הם שמות עצם?',
        mainDefinition: 'שמות עצם הם מילים המציינות אנשים, מקומות, חפצים, רעיונות או תופעות. הם הבסיס של כל משפט ומהווים את הגרעין שסביבו נבנה המשפט.',
        identificationRules: {
            title: 'איך מזהים שם עצם?',
            categories: [
                { label: 'אנשים', examples: 'John, teacher, mother, student' },
                { label: 'מקומות', examples: 'London, school, park, home' },
                { label: 'חפצים', examples: 'book, car, computer, apple' },
                { label: 'רעיונות ותחושות', examples: 'love, happiness, freedom, knowledge' }
            ]
        },
        roleInSentence: {
            title: 'תפקיד במשפט',
            description: 'שמות עצם יכולים לשמש כ:',
            roles: [
                { role: 'נושא המשפט', example: 'The <u>dog</u> barks' },
                { role: 'מושא', example: 'I read a <u>book</u>' },
                { role: 'השלמה', example: 'She is a <u>teacher</u>' }
            ]
        },
        quickTips: [
            'אם אפשר לשים לפני המילה "a" או "the" - זה כנראה שם עצם',
            'אם אפשר להפוך את המילה לרבים - זה שם עצם',
            'אם המילה עונה על השאלה "מה?" או "מי?" - זה שם עצם'
        ],
        mainInflections: ['Singular', 'Plural', 'Common Noun', 'Proper Noun', 'Concrete Noun', 'Abstract Noun'],
        colors: {
            primary: 'sky'
        }
    },

    verbs: {
        fullName: 'Verbs - פעלים',
        title: 'מה הם פעלים?',
        mainDefinition: 'פעלים הם מילים המתארות פעולות, מצבים או תהליכים. הם הלב של המשפט ומציינים מה קורה, מה נעשה או את המצב של הנושא.',
        identificationRules: {
            title: 'איך מזהים פועל?',
            categories: [
                { label: 'פעולות פיזיות', examples: 'run, jump, write, eat' },
                { label: 'פעולות מנטליות', examples: 'think, understand, remember, decide' },
                { label: 'מצבים', examples: 'be, exist, seem, appear' },
                { label: 'תהליכים', examples: 'grow, change, develop, become' }
            ]
        },
        roleInSentence: {
            title: 'תפקיד במשפט',
            description: 'פעלים מבטאים:',
            roles: [
                { role: 'פעולה', example: 'She <u>runs</u> every morning' },
                { role: 'מצב', example: 'The book <u>is</u> interesting' },
                { role: 'שינוי', example: 'The weather <u>changed</u> suddenly' }
            ]
        },
        quickTips: [
            'אם המילה מתארת מה מישהו עושה - זה פועל',
            'אם אפשר לשים לפני המילה "to" - זה פועל',
            'אם המילה משתנה לפי זמן (עבר, הווה, עתיד) - זה פועל'
        ],
        mainInflections: ['Present Tense', 'Past Tense', 'Future Tense', 'Present Perfect', 'Infinitive', 'Gerund'],
        colors: {
            primary: 'pink'
        }
    },

    adjectives: {
        fullName: 'Adjectives - תארים',
        title: 'מה הם תארים?',
        mainDefinition: 'תארים הם מילים המתארות או מוסיפות מידע על שמות עצם או כינויים. הם עוזרים לנו להבין איך משהו נראה, מרגיש, נשמע או מתנהג.',
        identificationRules: {
            title: 'איך מזהים תואר?',
            categories: [
                { label: 'מראה ותכונות פיזיות', examples: 'big, small, red, beautiful' },
                { label: 'תחושות ורגשות', examples: 'happy, sad, excited, calm' },
                { label: 'איכויות אופי', examples: 'kind, smart, brave, honest' },
                { label: 'מצבים וזמנים', examples: 'new, old, fresh, ancient' }
            ]
        },
        roleInSentence: {
            title: 'תפקיד במשפט',
            description: 'תארים יכולים להופיע:',
            roles: [
                { role: 'לפני שם העצם', example: 'The <u>big</u> house' },
                { role: 'אחרי פועל קישור', example: 'The house is <u>big</u>' },
                { role: 'כהשלמה', example: 'I find it <u>interesting</u>' }
            ]
        },
        quickTips: [
            'אם המילה עונה על השאלה "איך?" או "איזה?" - זה תואר',
            'אם אפשר לשים "very" לפני המילה - זה תואר',
            'אם המילה מתארת תכונה של שם עצם - זה תואר'
        ],
        mainInflections: ['Positive', 'Comparative', 'Superlative', 'Attributive', 'Predicative', 'Demonstrative'],
        colors: {
            primary: 'purple'
        }
    },

    adverbs: {
        fullName: 'Adverbs - תארי פועל',
        title: 'מה הם תארי פועל?',
        mainDefinition: 'תארי פועל הם מילים המתארות ומוסיפות מידע על פעלים, תארים או תארי פועל אחרים. הם עונים על השאלות: איך? מתי? איפה? כמה?',
        identificationRules: {
            title: 'איך מזהים תואר פועל?',
            categories: [
                { label: 'אופן הפעולה', examples: 'quickly, slowly, carefully, loudly' },
                { label: 'זמן', examples: 'now, yesterday, soon, always' },
                { label: 'מקום', examples: 'here, there, everywhere, outside' },
                { label: 'תדירות', examples: 'often, never, sometimes, usually' }
            ]
        },
        roleInSentence: {
            title: 'תפקיד במשפט',
            description: 'תארי פועל מתארים:',
            roles: [
                { role: 'פעלים', example: 'She runs <u>quickly</u>' },
                { role: 'תארים', example: 'Very <u>beautiful</u> flowers' },
                { role: 'תארי פועל אחרים', example: 'She runs <u>very</u> quickly' }
            ]
        },
        quickTips: [
            'רבים מתארי הפועל מסתיימים ב-ly',
            'אם המילה עונה על השאלות איך/מתי/איפה/כמה - זה תואר פועל',
            'אם המילה מתארת פועל או תואר - זה תואר פועל'
        ],
        mainInflections: ['Manner', 'Time', 'Place', 'Frequency', 'Degree', 'Comparative Adverb'],
        colors: {
            primary: 'green'
        }
    },

    functionWords: {
        fullName: 'Function Words - מילות פונקציה',
        title: 'מה הן מילות פונקציה?',
        mainDefinition: 'מילות פונקציה הן מילים קצרות שתפקידן העיקרי הוא ליצור קשרים דקדוקיים במשפט. הן לא נושאות משמעות עיקרית אלא מארגנות את המשפט.',
        identificationRules: {
            title: 'סוגי מילות פונקציה:',
            categories: [
                { label: 'מילות יחס', examples: 'in, on, at, with, by' },
                { label: 'מילות חיבור', examples: 'and, but, or, because, although' },
                { label: 'מילות הגדרה', examples: 'the, a, an' },
                { label: 'כינויים', examples: 'I, you, he, she, it, they' }
            ]
        },
        roleInSentence: {
            title: 'תפקיד במשפט',
            description: 'מילות פונקציה:',
            roles: [
                { role: 'מקשרות בין מילים', example: 'The book <u>on</u> the table' },
                { role: 'מחברות משפטים', example: 'I like tea <u>but</u> not coffee' },
                { role: 'מגדירות שמות עצם', example: '<u>The</u> beautiful house' }
            ]
        },
        quickTips: [
            'מילות פונקציה הן בדרך כלל מילים קצרות (1-3 אותיות)',
            'הן מופיעות בתדירות גבוהה בכל טקסט',
            'קשה להגדיר את משמעותן מחוץ להקשר'
        ],
        mainInflections: ['Prepositions', 'Conjunctions', 'Articles', 'Pronouns', 'Auxiliary Verbs', 'Modal Verbs'],
        colors: {
            primary: 'slate'
        }
    }
}