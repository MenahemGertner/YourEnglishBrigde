const GrammarTranslator = ({ definition }) => {
  const translations = {
    // Noun Forms
    'Singular': 'יחיד',
    'Plural': 'רבים',
    'Process-Result Noun': 'שם עצם מתהליך',
    'Quality Noun': 'שם עצם תכונה',
    'Gerund': 'פועל המשמש כשם עצם',
    'Recipient Noun': 'שם עצם מקבל',
    'Action Performer Noun': 'שם עצם פועל',
    'Purpose Noun': 'שם עצם מטרה',
    'Size Modifier Noun': 'שם עצם גודל',
    'State Noun': 'שם עצם מצב',
    
    // Verb Forms
    'Present Simple': 'הווה פשוט',
    'Past Simple': 'עבר פשוט',
    'Future Simple': 'עתיד פשוט',
    'Present Progressive': 'הווה מתמשך',
    'Past Progressive': 'עבר מתמשך',
    'Present Perfect': 'הווה מושלם',
    'Past Perfect': 'עבר מושלם',
    'Verb Infinitive': 'פועל במקור',
    'Third Person Singular': 'גוף שלישי יחיד',
    
    // Adjective Forms
    'Positive': 'בסיסי',
    'Comparative': 'השוואתי',
    'Superlative': 'עליון',
    'Possessive': 'רכושי',
    'Adjectival Participle': 'תואר מפועל',
    'Feature Adjective': 'תואר תכונה',
    
    // Adverb Forms
    'Adverb Form': 'תואר פועל',
    'Description Adverb': 'תואר פועל תיאור',
    
    // Other Forms
    'Pronoun': 'כינוי',
    'Preposition': 'מילת יחס',
    'Conjunction': 'מילת חיבור',
    'Article': 'ה׳ הידיעה',
    'Determiner': 'מילת הצבעה',
    'Interjection': 'קריאה',
    'Auxiliary Verb': 'פועל עזר',
    'Modal Particle': 'מילת אופן',
    'Negative Forms': 'צורות שלילה',
    'Contractions': 'קיצורים'
  };

  // אם לא נמצא תרגום, החזר את ההגדרה המקורית
  const hebrewTranslation = translations[definition];

  return (
    <span className="grammar-translation" title={definition}>
      {hebrewTranslation}
    </span>
  );
};

export default GrammarTranslator;