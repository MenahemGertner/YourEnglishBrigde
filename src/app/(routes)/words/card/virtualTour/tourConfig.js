// tourConfig.js - הגדרת צעדי המדריך
export const dashboardTourConfig = {
    steps: [
        {
            id: 'step1',
            targetId: 'main-card',
            title: 'הכרטיס המרכזי',
            content: 'המידע שמוצג בכרטיס הראשי הוא החשוב ביותר לתרגול אפקטיבי.',
            position: 'bottom'
          },
      {
        id: 'step2',
        targetId: 'main-word',
        title: 'מילה ראשית',
        content: 'לחיצה על המילה תציג לך את התרגום שלה.',
        position: 'bottom'
      },
      {
        id: 'step3',
        targetId: 'play-icon',
        title: 'אייקון השמעה',
        content: 'ניתן לשימוש בשלשה מצבים. מהירות רגילה, מהירות איטית והשתקה.',
        position: 'right'
      },
      {
        id: 'step4',
        targetId: 'inflections',
        title: 'צורות שימוש בסיסיות',
        content: 'אלו הם צורות השימוש הבסיסיות של המילה.',
        position: 'top'
      },
      {
        id: 'step5',
        targetId: 'sentences',
        title: 'משפטי הטמעה',
        content: 'חלון זה מכיל משפטי תרגול חשובים ביותר להבנה של המילה בהקשרים ושימושים שונים.',
        position: 'left'
      },
      {
        id: 'step6',
        targetId: 'part-of-speech',
        title: 'חלק הדיבור',
        content: 'באתר זה כל המילים מחולקות ל 4 סוגים עיקריים של מילים. בכל סוג דפוסי השימוש חוזרים על עצמם. שיוך של המילה לקבוצת המילים המתאימה, תקל מאוד להבנה של מבנה השפה.',
        position: 'bottom'
      },
      {
        id: 'step7',
        targetId: 'language-structure',
        title: 'שימוש נכון במשפט',
        content: 'כאן תמצא הרחבה חשובה להבנה של שימוש נכון במילה במשפט, והבנה של בחירת ההטיה הנכונה.',
        position: 'bottom'
      },
      {
        id: 'step8',
        targetId: 'broader-context',
        title: 'הקשר נרחב של המילה',
        content: 'כאן תמצא מידע חשוב שהמטרה שלו היא יצירת הקשרים חזקים במוח להבנה של צורות השימוש הנכונות במילה הנלמדת.',
        position: 'bottom'
      },
      {
        id: 'step9',
        targetId: 'navigation-buttons',
        title: 'כפתורי ניווט',
        content: 'כאן עליך לציין את רמת הקושי של המילה עבורך לצורך חזרה נוספת. המטרה היא בניה נכונה של הזכרון לטווח הארוך!',
        position: 'bottom'
      },
      {
        id: 'step10',
        targetId: 'back-button',
        title: 'חזרה אחורה',
        content: 'ניתן לחזור למילה האחרונה ולדרג מחדש.',
        position: 'bottom'
      }
      

    ],
    onComplete: () => {
      console.log('המדריך הושלם!');
    },
    onSkip: () => {
      console.log('המשתמש דילג על המדריך');
    }
  };