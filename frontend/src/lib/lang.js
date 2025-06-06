function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
      102: "JavaScript",
      100: "Python",
      91: "Java",
      105: "C++",
    };
    return LANGUAGE_NAMES[languageId] || "Unknown";
  }

  export { getLanguageName };


  export function getLanguageId(language) {
    const languageMap = {
      "PYTHON": 100,
      "JAVASCRIPT": 102,
      "JAVA": 91,
      "CPP": 105,
      "C++": 105,
    };
    return languageMap[language.toUpperCase()];
  }