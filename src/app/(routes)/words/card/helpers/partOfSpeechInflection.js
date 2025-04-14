import INFLECTIONS_MAP from '../data/inflectionsMap';

const partOfSpeechInflection = (posFullName) => {
  for (const [type, config] of Object.entries(INFLECTIONS_MAP)) {
    if (config.patterns.some(pattern => 
      posFullName.toLowerCase() === pattern.toLowerCase()
    )) {
      // קבל את התיאור של ההטיה אם הוא קיים
      const description = config.descriptions?.[posFullName] || null;
      
      return {
        abbreviation: config.abbreviation,
        type: type,
        description: description  // התוספת החדשה - מחזיר את התיאור
      };
    }
  }
  return {
    abbreviation: 'F',
    type: 'functionWords',
    description: null
  };
};

export default partOfSpeechInflection;