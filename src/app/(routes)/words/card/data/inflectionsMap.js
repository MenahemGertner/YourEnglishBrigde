const INFLECTIONS_MAP = {
    nouns: {
        abbreviation: 'N',
                patterns: [
            'Singular',
            'Plural',
            'Abstract Noun',
            'Verbal Noun',
            'Uncountable Noun',
            'Countable Noun',
            'Concrete Noun',
            'Gerund',
            'Agent Noun'
        ]
    },
    verbs: {
        abbreviation: 'V',
           patterns: [
            'Present Simple',
            'Past Simple',
            'Present Perfect',
            'Future Simple',
            'Present Progressive',
            'Past Continuous',
            'Past Perfect',
            'Modal Auxiliary Verb',
            'Verb Infinitive',
            'Third Person Singular Present'
        ]
    },
    adjectives: {
        abbreviation: 'A',
          patterns: [
            'Descriptive',
            'Comparative',
            'Superlative',
            'Attributive',
            'Predicative',
            'Possessive',
            'Qualitative',
            'Derived adjective'
        ]
    },
    functionWords: {
        abbreviation: 'F',
            patterns: [
            'Pronoun',
            'Preposition',
            'Conjunction',
            'Article',
            'Determiner',
            'Interjection'
        ]
    }
 };
  
export default INFLECTIONS_MAP;  