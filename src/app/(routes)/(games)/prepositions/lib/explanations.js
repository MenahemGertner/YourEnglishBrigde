// app/(routes)/(games)/prepositions/lib/explanations.js

export const EXPLANATIONS = {
  // Time prepositions
  in: {
    time: {
      rule: "משתמשים ב-'in' עבור חלקי יום, חודשים, עונות, שנים ותקופות ארוכות",
      examples: ["in the morning", "in July", "in 2023", "in summer"],
      common_mistakes: {
        on: "לא משתמשים ב-'on' לחודשים או שנים",
        at: "לא משתמשים ב-'at' לתקופות ארוכות"
      }
    },
    place: {
      rule: "משתמשים ב-'in' עבור ערים, מדינות, מקומות סגורים ואזורים",
      examples: ["in London", "in Israel", "in the room", "in the park"],
      common_mistakes: {
        on: "לא משתמשים ב-'on' לערים או מדינות",
        at: "'at' משמש לנקודה ספציפית, לא לאזור"
      }
    }
  },

  on: {
    time: {
      rule: "משתמשים ב-'on' עבור ימים ותאריכים ספציפיים",
      examples: ["on Monday", "on July 15th", "on Christmas Day", "on my birthday"],
      common_mistakes: {
        in: "לא משתמשים ב-'in' לימים ספציפיים",
        at: "'at' משמש לשעות, לא לימים"
      }
    },
    place: {
      rule: "משתמשים ב-'on' עבור משטחים וכבישים",
      examples: ["on the table", "on the wall", "on the floor", "on Main Street"],
      common_mistakes: {
        in: "'in' משמש למקומות סגורים, לא למשטחים",
        at: "'at' משמש לנקודה ספציפית, לא למשטח"
      }
    }
  },

  at: {
    time: {
      rule: "משתמשים ב-'at' עבור שעות ורגעים ספציפיים",
      examples: ["at 3 o'clock", "at noon", "at midnight", "at the moment"],
      common_mistakes: {
        in: "לא משתמשים ב-'in' לשעות מדויקות",
        on: "לא משתמשים ב-'on' לשעות"
      }
    },
    place: {
      rule: "משתמשים ב-'at' עבור מקומות ספציפיים או נקודות",
      examples: ["at the station", "at school", "at the door", "at home"],
      common_mistakes: {
        in: "'in' משמש לאזורים, 'at' לנקודות",
        on: "'on' משמש למשטחים, לא לנקודות"
      }
    }
  },

  // Duration prepositions
  for: {
    duration: {
      rule: "משתמשים ב-'for' עבור משך זמן (כמה זמן משהו קורה)",
      examples: ["for 3 hours", "for two weeks", "for a long time", "for ages"],
      common_mistakes: {
        since: "'since' משמש לנקודת התחלה, 'for' למשך זמן",
        during: "'during' משמש לתקופה ספציפית, 'for' למשך"
      }
    }
  },

  since: {
    duration: {
      rule: "משתמשים ב-'since' עבור נקודת זמן מסוימת שממנה משהו מתחיל",
      examples: ["since 2020", "since Monday", "since I was a child", "since last week"],
      common_mistakes: {
        for: "'for' משמש למשך זמן, 'since' לנקודת התחלה",
        from: "'from' משמש לטווח זמן, 'since' למשך שממשיך"
      }
    }
  },

  during: {
    duration: {
      rule: "משתמשים ב-'during' כשמדברים על תקופה או אירוע ספציפי",
      examples: ["during the summer", "during the meeting", "during my vacation", "during the war"],
      common_mistakes: {
        for: "'for' משמש למשך זמן מדויק, 'during' לתקופה כללית",
        while: "'while' משמש למשהו שקורה באותו זמן"
      }
    }
  },

  while: {
    duration: {
      rule: "משתמשים ב-'while' כשפעולה אחת קורית במהלך פעולה אחרת",
      examples: ["while I was sleeping", "while working", "while you're here"],
      common_mistakes: {
        during: "'during' + שם עצם, 'while' + פועל",
        for: "'for' משמש למשך זמן, לא לפעולות מקבילות"
      }
    }
  },

  // Movement/Direction
  to: {
    direction: {
      rule: "משתמשים ב-'to' כשמדברים על תנועה ליעד",
      examples: ["go to school", "travel to Paris", "move to the left"],
      common_mistakes: {
        at: "'at' משמש למיקום, 'to' לכיוון תנועה",
        in: "לא אומרים 'go in', אומרים 'go to'"
      }
    }
  },

  from: {
    direction: {
      rule: "משתמשים ב-'from' כשמדברים על מקור או נקודת התחלה",
      examples: ["from home", "from Israel", "from 9 to 5"],
      common_mistakes: {
        of: "'of' משמש לשייכות, 'from' למקור"
      }
    }
  },

  by: {
    means: {
      rule: "משתמשים ב-'by' כשמדברים על אמצעי תחבורה או שיטה",
      examples: ["by car", "by train", "by email", "by mistake"],
      common_mistakes: {
        with: "'with' משמש לכלי, 'by' לאמצעי",
        in: "לא אומרים 'in car', אומרים 'by car'"
      }
    },
    time: {
      rule: "משתמשים ב-'by' כשמדברים על מועד אחרון",
      examples: ["by Monday", "by 5 PM", "by the end of the day"],
      common_mistakes: {
        until: "'until' = עד (כל הזמן), 'by' = לא יאוחר מ-"
      }
    }
  },

  with: {
    means: {
      rule: "משתמשים ב-'with' כשמדברים על כלי או ליווי",
      examples: ["with a knife", "with my friends", "with care"],
      common_mistakes: {
        by: "'by' לאמצעי תחבורה, 'with' לכלי"
      }
    }
  },

  through: {
    means: {
      rule: "משתמשים ב-'through' כשעוברים דרך משהו או משתמשים באמצעי",
      examples: ["through the door", "through the internet", "through hard work"],
      common_mistakes: {
        by: "'by' לאמצעי ישיר, 'through' לתהליך"
      }
    }
  },

  via: {
    means: {
      rule: "משתמשים ב-'via' כשעוברים דרך מקום או משתמשים בדרך מסוימת",
      examples: ["via London", "via email", "via the highway"],
      common_mistakes: {
        through: "'via' יותר פורמלי מ-'through'"
      }
    }
  }
};

/**
 * מחזיר הסבר מפורט למילה לפי קטגוריה
 */
export const getExplanation = (preposition, category = null) => {
  const prep = EXPLANATIONS[preposition];
  if (!prep) return null;

  // אם יש קטגוריה ספציפית
  if (category && prep[category]) {
    return {
      rule: prep[category].rule,
      examples: prep[category].examples,
      commonMistakes: prep[category].common_mistakes
    };
  }

  // אחרת תחזיר את הקטגוריה הראשונה
  const firstCategory = Object.keys(prep)[0];
  return {
    rule: prep[firstCategory].rule,
    examples: prep[firstCategory].examples,
    commonMistakes: prep[firstCategory].common_mistakes
  };
};

/**
 * מחזיר הסבר למה תשובה מסוימת שגויה
 */
export const getWrongAnswerExplanation = (correctAnswer, wrongAnswer, category = null) => {
  const correctPrep = EXPLANATIONS[correctAnswer];
  if (!correctPrep) return "זו לא התשובה הנכונה.";

  const categoryKey = category || Object.keys(correctPrep)[0];
  const correctInfo = correctPrep[categoryKey];

  if (!correctInfo) return `התשובה הנכונה היא '${correctAnswer}'.`;

  // בדוק אם יש הסבר ספציפי למה הטעות שגויה
  if (correctInfo.common_mistakes && correctInfo.common_mistakes[wrongAnswer]) {
    return `❌ ${correctInfo.common_mistakes[wrongAnswer]}`;
  }

  // הסבר כללי
  return `❌ התשובה הנכונה היא '${correctAnswer}'. ${correctInfo.rule}`;
};