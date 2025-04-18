const formatQuestionText = (text) => {
    // ביטוי רגולרי משופר שמגדיר טוב יותר מתי גרש פותח ציטוט
    // הוא לא יזהה גרש כפותח ציטוט אם הוא אפוסטרוף (אחרי אות)
    const openQuoteRegex = /(^|[^a-zA-Z])'(?=[^'])/g;
    
    // ביטוי רגולרי לזיהוי סגירת ציטוט
    // לא יזהה גרש כסוגר ציטוט אם הוא אפוסטרוף (לפני אות)
    const closeQuoteRegex = /(?<=[^'])'(?=[^a-zA-Z]|$)/g;
    
    // שלב 1: סימון תחילה וסוף של ציטוטים
    // החלפת פתיחות ציטוטים בתג מיוחד
    let processedText = text.replace(openQuoteRegex, '$1<QUOTE_START>');
    
    // החלפת סגירות ציטוטים בתג מיוחד
    processedText = processedText.replace(closeQuoteRegex, '<QUOTE_END>');
    
    // שלב 2: פיצול הטקסט לחלקים לפי התגים
    const parts = [];
    const segments = processedText.split(/<QUOTE_START>|<QUOTE_END>/);
    
    let insideQuote = false;
    
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].trim() === '') continue;
      
      if (i === 0 && !processedText.startsWith('<QUOTE_START>')) {
        // החלק הראשון הוא טקסט רגיל אם לא התחיל בתג פתיחה
        parts.push({ text: segments[i], isQuote: false });
      } else {
        insideQuote = !insideQuote;
        parts.push({ text: segments[i], isQuote: insideQuote });
      }
    }
    
    // גישה אלטרנטיבית שעשויה להיות יותר מהימנה - זיהוי ציטוטים לפי תוכן ממשי עם גרשיים
    const alternativeParts = [];
    let remaining = text;
    const quoteRegex = /'([^']*(?:'[a-zA-Z][^']*)*(?:,[^']*)?(?:'[a-zA-Z][^']*)*)'(?=[^a-zA-Z]|$)/g;
    
    let lastIndex = 0;
    let match;
    
    while ((match = quoteRegex.exec(text)) !== null) {
      // טקסט לפני הציטוט
      if (match.index > lastIndex) {
        alternativeParts.push({
          text: text.substring(lastIndex, match.index),
          isQuote: false
        });
      }
      
      // הציטוט עצמו (כולל הגרשיים)
      const fullQuote = match[0];
      const quoteContent = match[1]; // תוכן הציטוט ללא גרשיים
      
      alternativeParts.push({
        text: quoteContent,
        isQuote: true
      });
      
      lastIndex = match.index + fullQuote.length;
    }
    
    // טקסט שנשאר אחרי הציטוט האחרון
    if (lastIndex < text.length) {
      alternativeParts.push({
        text: text.substring(lastIndex),
        isQuote: false
      });
    }
    
    // בחירת תוצאות מהגישה המתאימה יותר
    const finalParts = alternativeParts.length > 1 ? alternativeParts : parts;
    
    // רינדור החלקים עם עיצוב מתאים
    return finalParts.map((part, index) => (
      part.isQuote ? 
      <span key={index} className="italic font-medium px-1 rounded mx-1">&lsquo;{part.text}&rsquo;</span> :
        <span key={index}>{part.text}</span>
    ));
  };

export default formatQuestionText;