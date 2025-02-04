import INFLECTIONS_MAP from '../data/inflectionsMap';

const partOfSpeechInflection = (posFullName) => {
  for (const [type, config] of Object.entries(INFLECTIONS_MAP)) {
    if (config.patterns.some(pattern => 
      posFullName.toLowerCase() === pattern.toLowerCase()
    )) {
      return {
        abbreviation: config.abbreviation,
        type: type
      };
    }
  }
  return {
    abbreviation: 'F',
    type: 'functionWords'
  };
};

export default partOfSpeechInflection;