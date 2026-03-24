export const getLanguageName = (language_id) => {
            
    const languageMap = {
        71 : "PYTHON",
        62 : "JAVA",
        63 : "JAVASCRIPT",
    }

    return languageMap[language_id] || "UNKNOWN"
}