// app/(routes)/(games)/prepositions/lib/sentences/level6.js

export const level6Sentences = [
  // BY - Transportation & Means
  {
    id: "l6_1",
    sentence: "I go to work ___ car.",
    correctAnswer: "by",
    options: ["by", "with", "in", "on"],
    category: "means",
    explanation: "משתמשים ב-'by' עם אמצעי תחבורה (by car, by bus, by train)"
  },
  {
    id: "l6_2",
    sentence: "She sent the document ___ email.",
    correctAnswer: "by",
    options: ["by", "with", "through", "via"],
    category: "means",
    explanation: "משתמשים ב-'by' עם אמצעי תקשורת"
  },
  {
    id: "l6_3",
    sentence: "This book was written ___ Shakespeare.",
    correctAnswer: "by",
    options: ["by", "from", "of", "with"],
    category: "means",
    explanation: "משתמשים ב-'by' כשמדברים על יוצר או כותב"
  },
  {
    id: "l6_4",
    sentence: "Please submit your assignment ___ Friday.",
    correctAnswer: "by",
    options: ["by", "until", "at", "in"],
    category: "time",
    explanation: "משתמשים ב-'by' למועד אחרון (not later than)"
  },
  {
    id: "l6_5",
    sentence: "I prefer traveling ___ plane.",
    correctAnswer: "by",
    options: ["by", "with", "in", "on"],
    category: "means",
    explanation: "משתמשים ב-'by' עם אמצעי תחבורה"
  },

  // WITH - Instrument/Accompaniment
  {
    id: "l6_6",
    sentence: "She cut the paper ___ scissors.",
    correctAnswer: "with",
    options: ["with", "by", "using", "from"],
    category: "means",
    explanation: "משתמשים ב-'with' עם כלי או אובייקט שאיתו עושים פעולה"
  },
  {
    id: "l6_7",
    sentence: "I'm going to the party ___ my friends.",
    correctAnswer: "with",
    options: ["with", "by", "and", "to"],
    category: "means",
    explanation: "משתמשים ב-'with' כשמדברים על ליווי"
  },
  {
    id: "l6_8",
    sentence: "He opened the door ___ a key.",
    correctAnswer: "with",
    options: ["with", "by", "using", "from"],
    category: "means",
    explanation: "משתמשים ב-'with' עם כלי"
  },
  {
    id: "l6_9",
    sentence: "She's the girl ___ long hair.",
    correctAnswer: "with",
    options: ["with", "of", "having", "who"],
    category: "means",
    explanation: "משתמשים ב-'with' לתיאור מאפיינים"
  },
  {
    id: "l6_10",
    sentence: "I paid ___ my credit card.",
    correctAnswer: "with",
    options: ["with", "by", "using", "from"],
    category: "means",
    explanation: "משתמשים ב-'with' כשמדברים על אמצעי תשלום ספציפי"
  },

  // THROUGH - Process/Movement
  {
    id: "l6_11",
    sentence: "We drove ___ the tunnel.",
    correctAnswer: "through",
    options: ["through", "by", "in", "via"],
    category: "means",
    explanation: "משתמשים ב-'through' כשעוברים דרך משהו"
  },
  {
    id: "l6_12",
    sentence: "I learned about it ___ a friend.",
    correctAnswer: "through",
    options: ["through", "by", "from", "via"],
    category: "means",
    explanation: "משתמשים ב-'through' כשמדברים על מקור מידע דרך אדם"
  },
  {
    id: "l6_13",
    sentence: "He succeeded ___ hard work.",
    correctAnswer: "through",
    options: ["through", "by", "with", "from"],
    category: "means",
    explanation: "משתמשים ב-'through' כשמדברים על תהליך או מאמץ"
  },
  {
    id: "l6_14",
    sentence: "The light came ___ the window.",
    correctAnswer: "through",
    options: ["through", "from", "by", "via"],
    category: "means",
    explanation: "משתמשים ב-'through' כשמדברים על מעבר דרך פתח"
  },
  {
    id: "l6_15",
    sentence: "We went ___ all the documents carefully.",
    correctAnswer: "through",
    options: ["through", "over", "by", "with"],
    category: "means",
    explanation: "משתמשים ב-'go through' במשמעות 'לעבור על' או 'לבדוק'"
  },

  // VIA - Route/Method
  {
    id: "l6_16",
    sentence: "We flew to Japan ___ Singapore.",
    correctAnswer: "via",
    options: ["via", "through", "by", "from"],
    category: "means",
    explanation: "משתמשים ב-'via' כשמדברים על נקודת ביניים במסלול"
  },
  {
    id: "l6_17",
    sentence: "Please contact us ___ email.",
    correctAnswer: "via",
    options: ["via", "by", "through", "with"],
    category: "means",
    explanation: "משתמשים ב-'via' באופן פורמלי לאמצעי תקשורת"
  },
  {
    id: "l6_18",
    sentence: "The package was sent ___ express delivery.",
    correctAnswer: "via",
    options: ["via", "by", "with", "through"],
    category: "means",
    explanation: "משתמשים ב-'via' כשמדברים על שיטת משלוח"
  },

  // Mixed challenging sentences
  {
    id: "l6_19",
    sentence: "I wrote the letter ___ a pen.",
    correctAnswer: "with",
    options: ["with", "by", "using", "from"],
    category: "means",
    explanation: "משתמשים ב-'with' עם כלי כתיבה"
  },
  {
    id: "l6_20",
    sentence: "The painting was created ___ Picasso ___ oil paints.",
    blanks: [
      {
        correctAnswer: "by",
        category: "means",
        explanation: "משתמשים ב-'by' כשמדברים על יוצר"
      },
      {
        correctAnswer: "with",
        category: "means",
        explanation: "משתמשים ב-'with' עם חומרים או כלים"
      }
    ],
    options: ["by", "with", "using", "from"],
    hasMultipleBlanks: true
  },
  {
    id: "l6_21",
    sentence: "You can reach the city center ___ the main highway.",
    correctAnswer: "via",
    options: ["via", "through", "by", "on"],
    category: "means",
    explanation: "משתמשים ב-'via' כשמדברים על מסלול"
  },
  {
    id: "l6_22",
    sentence: "She became successful ___ determination and talent.",
    correctAnswer: "through",
    options: ["through", "by", "with", "from"],
    category: "means",
    explanation: "משתמשים ב-'through' כשמדברים על תהליך או מאפיינים שהובילו להצלחה"
  },
  {
    id: "l6_23",
    sentence: "I travel to the office ___ train every day.",
    correctAnswer: "by",
    options: ["by", "with", "in", "on"],
    category: "means",
    explanation: "משתמשים ב-'by' עם אמצעי תחבורה"
  },
  {
    id: "l6_24",
    sentence: "The message was delivered ___ a courier ___ hand.",
    blanks: [
      {
        correctAnswer: "by",
        category: "means",
        explanation: "משתמשים ב-'by' עם אדם שמבצע פעולה"
      },
      {
        correctAnswer: "by",
        category: "means",
        explanation: "משתמשים ב-'by hand' (ביד)"
      }
    ],
    options: ["by", "with", "through", "via"],
    hasMultipleBlanks: true
  },
  {
    id: "l6_25",
    sentence: "We walked ___ the forest to reach the lake.",
    correctAnswer: "through",
    options: ["through", "by", "via", "in"],
    category: "means",
    explanation: "משתמשים ב-'through' כשעוברים דרך שטח"
  },
];