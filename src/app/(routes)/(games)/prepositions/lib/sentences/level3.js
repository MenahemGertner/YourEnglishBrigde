// app/(routes)/(games)/prepositions/lib/sentences/level3.js

export const level3Sentences = [
  // Adding BY to the mix
  {
    id: "l3_1",
    sentence: "I need to finish this report ___ Friday.",
    correctAnswer: "by",
    options: ["by", "in", "at", "on"],
    category: "time",
    explanation: "משתמשים ב-'by' כשמדברים על מועד אחרון"
  },
  {
    id: "l3_2",
    sentence: "She travels to work ___ bus.",
    correctAnswer: "by",
    options: ["by", "in", "on", "with"],
    category: "means",
    explanation: "משתמשים ב-'by' עם אמצעי תחבורה"
  },
  {
    id: "l3_3",
    sentence: "The project must be completed ___ next month.",
    correctAnswer: "by",
    options: ["by", "in", "at", "to"],
    category: "time",
    explanation: "משתמשים ב-'by' למועד אחרון"
  },
  {
    id: "l3_4",
    sentence: "I sent the document ___ email.",
    correctAnswer: "by",
    options: ["by", "in", "on", "with"],
    category: "means",
    explanation: "משתמשים ב-'by' עם אמצעי תקשורת"
  },
  {
    id: "l3_5",
    sentence: "This painting was created ___ Picasso.",
    correctAnswer: "by",
    options: ["by", "from", "of", "with"],
    category: "means",
    explanation: "משתמשים ב-'by' כשמדברים על יוצר"
  },
  {
    id: "l3_6",
    sentence: "Please be here ___ 9 AM at the latest.",
    correctAnswer: "by",
    options: ["by", "in", "at", "on"],
    category: "time",
    explanation: "משתמשים ב-'by' למועד אחרון ('לכל המאוחר')"
  },

  // Challenging mixes with all 6 prepositions
  {
    id: "l3_7",
    sentence: "I'll meet you ___ the station ___ 3 PM.",
    blanks: [
      {
        correctAnswer: "at",
        category: "place",
        explanation: "משתמשים ב-'at' עבור מקומות פגישה ספציפיים"
      },
      {
        correctAnswer: "at",
        category: "time",
        explanation: "משתמשים ב-'at' עבור שעות מדויקות"
      }
    ],
    options: ["at", "in", "on", "to"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_8",
    sentence: "She flew ___ London ___ Paris yesterday.",
    blanks: [
      {
        correctAnswer: "from",
        category: "direction",
        explanation: "משתמשים ב-'from' למקום המוצא"
      },
      {
        correctAnswer: "to",
        category: "direction",
        explanation: "משתמשים ב-'to' ליעד"
      }
    ],
    options: ["from", "to", "in", "at"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_9",
    sentence: "The package should arrive ___ Monday.",
    correctAnswer: "by",
    options: ["by", "in", "on", "at"],
    category: "time",
    explanation: "משתמשים ב-'by' כשמדברים על מועד אחרון להגעה"
  },
  {
    id: "l3_10",
    sentence: "I was born ___ 1990 ___ a small town.",
    blanks: [
      {
        correctAnswer: "in",
        category: "time",
        explanation: "משתמשים ב-'in' עבור שנים"
      },
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור ערים ועיירות"
      }
    ],
    options: ["in", "on", "at", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_11",
    sentence: "We're leaving ___ vacation ___ two days.",
    blanks: [
      {
        correctAnswer: "for",
        category: "duration",
        explanation: "משתמשים ב-'for' עם vacation (for vacation/holiday)"
      },
      {
        correctAnswer: "in",
        category: "time",
        explanation: "משתמשים ב-'in' כשמדברים על זמן עד אירוע"
      }
    ],
    options: ["for", "in", "on", "at"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_12",
    sentence: "She lives ___ Main Street, just ___ the bank.",
    blanks: [
      {
        correctAnswer: "on",
        category: "place",
        explanation: "משתמשים ב-'on' עבור רחובות"
      },
      {
        correctAnswer: "by",
        category: "place",
        explanation: "משתמשים ב-'by' במשמעות 'ליד' או 'קרוב ל-'"
      }
    ],
    options: ["on", "by", "in", "at"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_13",
    sentence: "I prefer traveling ___ train rather than ___ car.",
    blanks: [
      {
        correctAnswer: "by",
        category: "means",
        explanation: "משתמשים ב-'by' עם אמצעי תחבורה"
      },
      {
        correctAnswer: "by",
        category: "means",
        explanation: "משתמשים ב-'by' עם אמצעי תחבורה"
      }
    ],
    options: ["by", "in", "on", "with"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_14",
    sentence: "The store is open ___ Monday ___ Saturday.",
    blanks: [
      {
        correctAnswer: "from",
        category: "time",
        explanation: "משתמשים ב-'from' כשמציינים טווח זמן"
      },
      {
        correctAnswer: "to",
        category: "time",
        explanation: "משתמשים ב-'to' לסוף הטווח"
      }
    ],
    options: ["from", "to", "on", "in"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_15",
    sentence: "The meeting starts ___ 9 AM ___ the conference room.",
    blanks: [
      {
        correctAnswer: "at",
        category: "time",
        explanation: "משתמשים ב-'at' עבור שעות מדויקות"
      },
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור חדרים"
      }
    ],
    options: ["at", "in", "on", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_16",
    sentence: "We need to submit the application ___ the end of the month.",
    correctAnswer: "by",
    options: ["by", "in", "at", "on"],
    category: "time",
    explanation: "משתמשים ב-'by' למועד אחרון"
  },
  {
    id: "l3_17",
    sentence: "She graduated ___ university ___ June.",
    blanks: [
      {
        correctAnswer: "from",
        category: "direction",
        explanation: "משתמשים ב-'from' כשמדברים על סיום לימודים במקום"
      },
      {
        correctAnswer: "in",
        category: "time",
        explanation: "משתמשים ב-'in' עבור חודשים"
      }
    ],
    options: ["from", "in", "at", "on"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_18",
    sentence: "The concert starts ___ 8 PM ___ the stadium.",
    blanks: [
      {
        correctAnswer: "at",
        category: "time",
        explanation: "משתמשים ב-'at' עבור שעות מדויקות"
      },
      {
        correctAnswer: "at",
        category: "place",
        explanation: "משתמשים ב-'at' עבור מקומות אירועים"
      }
    ],
    options: ["at", "in", "on", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_19",
    sentence: "I'm moving ___ a new apartment ___ next week.",
    blanks: [
      {
        correctAnswer: "to",
        category: "direction",
        explanation: "משתמשים ב-'to' כשמדברים על מעבר למקום"
      },
      {
        correctAnswer: "in",
        category: "time",
        explanation: "משתמשים ב-'in' כשמדברים על זמן עתידי קרוב (in + time period)"
      }
    ],
    options: ["to", "in", "at", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_20",
    sentence: "She always arrives ___ work ___ bicycle.",
    blanks: [
      {
        correctAnswer: "at",
        category: "place",
        explanation: "משתמשים ב-'at work' (ביטוי קבוע)"
      },
      {
        correctAnswer: "by",
        category: "means",
        explanation: "משתמשים ב-'by' עם אמצעי תחבורה"
      }
    ],
    options: ["at", "by", "to", "on"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_21",
    sentence: "The flight ___ Tokyo leaves ___ 6 AM.",
    blanks: [
      {
        correctAnswer: "to",
        category: "direction",
        explanation: "משתמשים ב-'to' כשמדברים על טיסה ליעד"
      },
      {
        correctAnswer: "at",
        category: "time",
        explanation: "משתמשים ב-'at' עבור שעות מדויקות"
      }
    ],
    options: ["to", "at", "in", "from"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_22",
    sentence: "I'll finish reading this book ___ tomorrow.",
    correctAnswer: "by",
    options: ["by", "in", "at", "on"],
    category: "time",
    explanation: "משתמשים ב-'by' למועד אחרון"
  },
  {
    id: "l3_23",
    sentence: "We met ___ the conference ___ Berlin last year.",
    blanks: [
      {
        correctAnswer: "at",
        category: "place",
        explanation: "משתמשים ב-'at' עבור אירועים"
      },
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור ערים"
      }
    ],
    options: ["at", "in", "on", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_24",
    sentence: "She sent a message ___ her phone while sitting ___ the park.",
    blanks: [
      {
        correctAnswer: "from",
        category: "means",
        explanation: "משתמשים ב-'from' כשמדברים על מקור השליחה"
      },
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור פארקים ושטחים פתוחים"
      }
    ],
    options: ["from", "in", "by", "on"],
    hasMultipleBlanks: true
  },
  {
    id: "l3_25",
    sentence: "The train ___ Manchester arrives ___ platform 3.",
    blanks: [
      {
        correctAnswer: "from",
        category: "direction",
        explanation: "משתמשים ב-'from' כשמדברים על מקור הנסיעה"
      },
      {
        correctAnswer: "at",
        category: "place",
        explanation: "משתמשים ב-'at' עבור פלטפורמות ספציפיות"
      }
    ],
    options: ["from", "at", "to", "in"],
    hasMultipleBlanks: true
  }
];