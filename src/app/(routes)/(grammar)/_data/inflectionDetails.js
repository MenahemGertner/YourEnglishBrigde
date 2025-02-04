export const InflectionDetails = {
    nouns: {
        fullName: 'Nouns - שמות עצם',
        description: 'שמות עצם מציינים אנשים, מקומות, דברים ורעיונות. לדוגמה: תלמיד, בית, ספר, אהבה.',
        colors: {
            base: 'bg-blue-100 hover:bg-blue-200'
        },
        inflections: {
        'Singular': {
            translation: 'יחיד',
            explanation: 'צורת שם עצם היחידה, המציינת דבר אחד',
            example: 'book, cat, student'
        },
        'Plural': {
            translation: 'רבים',
            explanation: 'צורת שם עצם המציינת יותר מדבר אחד',
            example: 'books, cats, students'
        },
        'Common Noun': {
            translation: 'שם עצם כללי',
            explanation: 'שם עצם המציין דבר או יצור ללא ייחוד פרטני',
            example: 'dog, chair, pencil'
        },
        'Proper Noun': {
            translation: 'שם עצם פרטי',
            explanation: 'שם עצם המציין דבר או אדם ספציפי',
            example: 'John, London, France'
        },
        'Concrete Noun': {
            translation: 'שם עצם מוחשי',
            explanation: 'שם עצם שאפשר לחוש אותו בחושים',
            example: 'rock, apple, computer'
        },
        'Abstract Noun': {
            translation: 'שם עצם מופשט',
            explanation: 'שם עצם המתאר רעיון, תחושה או תכונה שאינם מוחשיים',
            example: 'love, happiness, courage'
        },
        'Nominal Infinitive': {
            translation: 'שם פועל',
            explanation: 'צורת פועל הפועלת כשם עצם',
            example: 'swimming is fun, reading is important'
        },
        
        'Verbal Noun': {
            translation: 'שם פועל',
            explanation: 'שם עצם הנגזר מפועל והמתאר פעולה',
            example: 'arrival, destruction, completion'
        },
        'Genitive Case': {
            translation: 'צורת השייכות',
            explanation: 'צורת שם עצם המציינת בעלות או זיקה',
            example: "John's book, the cat's tail"
        },
        'Collective Noun': {
            translation: 'שם עצם קיבוצי',
            explanation: 'שם עצם המתאר קבוצה של דברים כיחידה אחת',
            example: 'team, family, crowd'
        },
        'Countable Noun': {
            translation: 'שם עצם ספירתי',
            explanation: 'שם עצם שאפשר למנות אותו באופן ישיר',
            example: 'apple, chair, book'
        },
        'Uncountable Noun': {
            translation: 'שם עצם לא ספירתי',
            explanation: 'שם עצם שלא ניתן למנות באופן ישיר',
            example: 'water, sand, information'
        }
    }},
    verbs: {
        fullName: 'Verbs - פעלים',
        description: 'פעלים מבטאים פעולה, מצב או תהליך. לדוגמה: ללמוד, לכתוב, להיות, להרגיש.',
        colors: {
            base: 'bg-green-100 hover:bg-green-200'
        },
        inflections: {
      'Present Simple': {
        translation: 'הווה פשוט',
        explanation: 'זמן הווה הבסיסי המתאר פעולה שקורית באופן קבוע או מצב קיים',
        example: 'I eat breakfast every morning.'
      },
      'Verb Infinitive': {
        translation: 'צורת השם של הפועל',
        explanation: 'צורת הפועל הבסיסית ללא הטיה כלשהי',
        example: 'to go, to run, to sing'
      },
      'Past Simple': {
        translation: 'עבר פשוט',
        explanation: 'זמן עבר המתאר פעולה שהסתיימה בעבר',
        example: 'I walked to the store yesterday.'
      },
      'Present Perfect': {
          translation: 'הווה שלם',
          explanation: 'זמן הווה המתאר פעולה שהחלה בעבר והשפעתה נמשכת עד ההווה',
          example: 'I have lived here for five years.'
      },
      'Future Simple': {
          translation: 'עתיד פשוט',
          explanation: 'זמן עתיד המתאר פעולה שתתרחש בעתיד',
          example: 'I will travel next summer.'
      },
      'Present Progressive': {
          translation: 'הווה מתמשך',
          explanation: 'זמן הווה המתאר פעולה המתרחשת כרגע',
          example: 'I am studying for my exam.'
      },
      'Past Continuous': {
          translation: 'עבר מתמשך',
          explanation: 'זמן עבר המתאר פעולה שהתרחשה באופן רציף בעבר',
          example: 'I was reading a book when he called.'
      },
      'Past Perfect': {
          translation: 'עבר שלם',
          explanation: 'זמן עבר המתאר פעולה שהתרחשה לפני פעולה אחרת בעבר',
          example: 'I had finished my homework before dinner.'
      },
      'Verbal Participle': {
          translation: 'צורת השם הפועלית',
          explanation: 'צורת פועל המשמשת כתואר או כחלק מזמן מורכב',
          example: 'Running, he reached the bus.'
      },
      'Modal Auxiliary Verb': {
          translation: 'פועל עזר מודאלי',
          explanation: 'פועל המביע יכולת, אפשרות, הרשאה או חובה',
          example: 'I can swim. She must study.'
      },
      'Third Person Singular Present': {
          translation: 'גוף שלישי יחיד בהווה',
          explanation: 'הטיית הפועל לגוף שלישי יחיד בזמן הווה',
          example: 'He walks, She sings'
      },
      'Gerund': {
            translation: 'שם הפועל',
            explanation: 'צורת פועל בסיומת ing המשמשת כשם עצם',
            example: 'Smoking is harmful'
        },
    }},
    adjectives: {
        fullName: 'Adjectives - תארים',
        description: 'תארים מתארים שמות עצם ומספקים מידע נוסף עליהם. לדוגמה: גדול, קטן, יפה, חכם.',
        colors: {
            base: 'bg-orange-100 hover:bg-orange-200'
        },
        inflections: {
        'Descriptive': {
            translation: 'תואר תיאורי',
            explanation: 'תואר המתאר תכונה או איכות של שם עצם',
            example: 'red, big, beautiful'
        },
        'Qualitative': {
            translation: 'תואר איכותי',
            explanation: 'תואר המציג איכות או מצב של שם עצם',
            example: 'happy, sad, intelligent'
        },
        'Adjectival Participle': {
            translation: 'תואר פועלי',
            explanation: 'תואר הנוצר מפועל והמתאר מצב או פעולה',
            example: 'running water, broken glass'
        },
        'Comparative': {
            translation: 'צורת ההשוואה',
            explanation: 'תואר המשווה בין שני דברים',
            example: 'bigger, smarter, more beautiful'
        },
        'Superlative': {
            translation: 'צורת העליון',
            explanation: 'תואר המציג את הרמה הגבוהה ביותר של תכונה',
            example: 'biggest, smartest, most beautiful'
        },
        'Attributive': {
            translation: 'תואר מייחס',
            explanation: 'תואר המופיע לפני שם העצם שהוא מתאר',
            example: 'a red car, a happy child'
        },
        'Predicative': {
            translation: 'תואר מנבא',
            explanation: 'תואר המופיע אחרי פועל קישור',
            example: 'The car is red. She seems happy.'
        },
        'Demonstrative': {
            translation: 'תואר מראה',
            explanation: 'תואר המצביע על מיקום או מרחק',
            example: 'this book, that car, these pencils'
        },
        'Possessive': {
            translation: 'תואר שייכות',
            explanation: 'תואר המציין בעלות',
            example: 'my book, her car, their house'
        },
        'Quantitative': {
            translation: 'תואר כמותי',
            explanation: 'תואר המציין כמות או מספר',
            example: 'many books, few friends, several cars'
        }
    }},
    functionWords: {
        fullName: 'Function Words - מילות פונקציה',
        description: 'מילות פונקציה זו הגדרה רחבה שכוללת בתוכה חלקי דיבור רבים. כמו, מילות יחס או מילות חיבור.',
        colors: {
            base: 'bg-yellow-100 hover:bg-yellow-200'
        },
        inflections: {
        
        'Pronoun': {
            translation: 'כינוי גוף',
            explanation: 'מילה המחליפה שם עצם',
            example: 'I, you, he, she, it, we, they'
        },
        'Preposition': {
            translation: 'מילת יחס',
            explanation: 'מילה המציינת יחס או מיקום בין מילים',
            example: 'in, on, under, with, for'
        },
        'Conjunction': {
            translation: 'מילת חיבור',
            explanation: 'מילה המחברת בין מילים, ביטויים או משפטים',
            example: 'and, but, or, because, while'
        },
        'Article': {
            translation: 'מילת הגדרה',
            explanation: 'מילה המגדירה שם עצם כספציפי או כללי',
            example: 'the (הגדרה), a/an (כללי)'
        },
        'Modal Particle': {
            translation: 'מילת מודוס',
            explanation: 'מילה המביעה גישה או עמדה רגשית',
            example: 'oh, wow, alas'
        },
        'Auxiliary Verb': {
            translation: 'פועל עזר',
            explanation: 'פועל המסייע לפועל עיקרי בהבעת זמן, מצב או משמעות דקדוקית',
            example: 'be, do, have, will, shall'
        },
        'Determiner': {
            translation: 'מגדיר',
            explanation: 'מילה המגדירה או מפרטת שם עצם',
            example: 'some, any, each, every'
        },
        'Interjection': {
            translation: 'פועל יוצא דופן',
            explanation: 'מילה המביעה רגש או תגובה פתאומית',
            example: 'wow!, ouch!, hurray!'
        }
    } } 
  };

export default InflectionDetails;