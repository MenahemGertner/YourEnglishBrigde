// app/(routes)/(games)/prepositions/lib/sentences/level5.js

export const level5Sentences = [
  // Mix of time, place, and duration
  {
    id: "l5_1",
    sentence: "I'll be there ___ 10 minutes.",
    correctAnswer: "in",
    options: ["in", "at", "for", "since"],
    category: "time",
    explanation: "משתמשים ב-'in' כשמדברים על זמן עתידי (in + time period)"
  },
  {
    id: "l5_2",
    sentence: "She's been working here ___ January.",
    correctAnswer: "since",
    options: ["for", "since", "in", "during"],
    category: "duration",
    explanation: "משתמשים ב-'since' עם חודש או תאריך ספציפי"
  },
  {
    id: "l5_3",
    sentence: "We met ___ a conference ___ Paris.",
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
    options: ["at", "in", "on", "during"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_4",
    sentence: "I've known him ___ ages.",
    correctAnswer: "for",
    options: ["for", "since", "during", "in"],
    category: "duration",
    explanation: "משתמשים ב-'for' עם ביטויים כמו 'ages', 'years', 'a long time'"
  },
  {
    id: "l5_5",
    sentence: "The store is closed ___ Sundays.",
    correctAnswer: "on",
    options: ["on", "in", "at", "during"],
    category: "time",
    explanation: "משתמשים ב-'on' עבור ימים בשבוע"
  },
  {
    id: "l5_6",
    sentence: "He fell asleep ___ the lecture.",
    correctAnswer: "during",
    options: ["during", "while", "for", "in"],
    category: "duration",
    explanation: "משתמשים ב-'during' + שם עצם (the lecture)"
  },
  {
    id: "l5_7",
    sentence: "I always drink coffee ___ the morning.",
    correctAnswer: "in",
    options: ["in", "on", "at", "during"],
    category: "time",
    explanation: "משתמשים ב-'in' עבור חלקי יום"
  },
  {
    id: "l5_8",
    sentence: "She lived ___ that house ___ ten years.",
    blanks: [
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור בתים ומבנים"
      },
      {
        correctAnswer: "for",
        category: "duration",
        explanation: "משתמשים ב-'for' עבור משך זמן"
      }
    ],
    options: ["in", "for", "at", "since"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_9",
    sentence: "They haven't seen each other ___ graduation.",
    correctAnswer: "since",
    options: ["since", "for", "during", "after"],
    category: "duration",
    explanation: "משתמשים ב-'since' עם אירוע בעבר"
  },
  {
    id: "l5_10",
    sentence: "The meeting is ___ 3 PM ___ the main office.",
    blanks: [
      {
        correctAnswer: "at",
        category: "time",
        explanation: "משתמשים ב-'at' עבור שעות מדויקות"
      },
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור מבנים"
      }
    ],
    options: ["at", "in", "on", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_11",
    sentence: "I was reading ___ my brother was playing video games.",
    correctAnswer: "while",
    options: ["while", "during", "for", "since"],
    category: "duration",
    explanation: "משתמשים ב-'while' + משפט (subject + verb)"
  },
  {
    id: "l5_12",
    sentence: "She's lived here ___ she was born.",
    correctAnswer: "since",
    options: ["since", "for", "from", "in"],
    category: "duration",
    explanation: "משתמשים ב-'since' עם משפט שמתאר נקודת זמן"
  },
  {
    id: "l5_13",
    sentence: "I'll see you ___ Monday ___ the café.",
    blanks: [
      {
        correctAnswer: "on",
        category: "time",
        explanation: "משתמשים ב-'on' עבור ימים"
      },
      {
        correctAnswer: "at",
        category: "place",
        explanation: "משתמשים ב-'at' עבור מקומות פגישה"
      }
    ],
    options: ["on", "at", "in", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_14",
    sentence: "We traveled ___ three weeks last summer.",
    correctAnswer: "for",
    options: ["for", "during", "in", "since"],
    category: "duration",
    explanation: "משתמשים ב-'for' עבור משך הזמן של הנסיעה"
  },
  {
    id: "l5_15",
    sentence: "It happened ___ the night.",
    correctAnswer: "during",
    options: ["during", "in", "at", "for"],
    category: "duration",
    explanation: "משתמשים ב-'during the night' (במהלך הלילה)"
  },
  {
    id: "l5_16",
    sentence: "I've been waiting ___ you ___ an hour!",
    blanks: [
      {
        correctAnswer: "for",
        category: "general",
        explanation: "משתמשים ב-'wait for someone'"
      },
      {
        correctAnswer: "for",
        category: "duration",
        explanation: "משתמשים ב-'for' עבור משך זמן"
      }
    ],
    options: ["for", "since", "at", "in"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_17",
    sentence: "She arrived ___ midnight.",
    correctAnswer: "at",
    options: ["at", "in", "on", "by"],
    category: "time",
    explanation: "משתמשים ב-'at' עם midnight, noon, night"
  },
  {
    id: "l5_18",
    sentence: "We stayed there ___ the whole vacation.",
    correctAnswer: "for",
    options: ["for", "during", "in", "while"],
    category: "duration",
    explanation: "משתמשים ב-'for' עם 'the whole' + תקופה"
  },
  {
    id: "l5_19",
    sentence: "He works ___ a hospital ___ the city center.",
    blanks: [
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור מבנים גדולים"
      },
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור אזורים בעיר"
      }
    ],
    options: ["in", "at", "on", "by"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_20",
    sentence: "I haven't eaten anything ___ breakfast.",
    correctAnswer: "since",
    options: ["since", "for", "from", "after"],
    category: "duration",
    explanation: "משתמשים ב-'since' עם ארוחה או אירוע ספציפי"
  },
  {
    id: "l5_21",
    sentence: "Please be quiet ___ the baby is sleeping.",
    correctAnswer: "while",
    options: ["while", "during", "for", "when"],
    category: "duration",
    explanation: "משתמשים ב-'while' + משפט"
  },
  {
    id: "l5_22",
    sentence: "We had a great time ___ our holiday ___ Spain.",
    blanks: [
      {
        correctAnswer: "during",
        category: "duration",
        explanation: "משתמשים ב-'during' עם חופשה"
      },
      {
        correctAnswer: "in",
        category: "place",
        explanation: "משתמשים ב-'in' עבור מדינות"
      }
    ],
    options: ["during", "in", "for", "at"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_23",
    sentence: "The train leaves ___ platform 5 ___ 6:30 AM.",
    blanks: [
      {
        correctAnswer: "from",
        category: "place",
        explanation: "משתמשים ב-'from' לנקודת יציאה"
      },
      {
        correctAnswer: "at",
        category: "time",
        explanation: "משתמשים ב-'at' עבור שעות"
      }
    ],
    options: ["from", "at", "on", "in"],
    hasMultipleBlanks: true
  },
  {
    id: "l5_24",
    sentence: "I learned to drive ___ I was 17.",
    correctAnswer: "when",
    options: ["when", "while", "during", "at"],
    category: "time",
    explanation: "משתמשים ב-'when' כשמדברים על גיל או זמן ספציפי"
  },
  {
    id: "l5_25",
    sentence: "She's been studying ___ hours without a break.",
    correctAnswer: "for",
    options: ["for", "since", "during", "in"],
    category: "duration",
    explanation: "משתמשים ב-'for' עבור משך זמן"
  },
];