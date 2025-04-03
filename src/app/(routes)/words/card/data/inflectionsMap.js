const INFLECTIONS_MAP = {
    nouns: {
        abbreviation: 'N',
                patterns: [
            'Singular',
            'Plural',
            'State Noun',
            'Action Noun',
            'Gerund',
            'Agent Noun'
        ]
    },
    verbs: {
        abbreviation: 'V',
           patterns: [
            'Present Simple',
            'Past Simple',
            'Future Simple',
            'Present Progressive',
            'Past Progressive',
            'Present Perfect',
            'Past Perfect',
            'Verb Infinitive',
            'Third Person Singular'
        ]
    },
    adjectives: {
        abbreviation: 'A',
          patterns: [
            'Positive',
            'Comparative',
            'Superlative',
            'Predicative',
            'Possessive',
            'Property Adjective',
            'Adjectival Participle',
            'Manner Adverb',
            'Adverb Form'
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
            'Interjection',
            'Auxiliary Verb',
            'Modal Particle'
        ]
    }
 };
  
export default INFLECTIONS_MAP;  