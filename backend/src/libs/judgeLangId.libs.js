export const getJudgeZeroLanguageId = async (language)=>{

    const languagemap ={
        PYTHON : 71,
        JAVA : 62 ,
        JAVASCRIPT : 63
    }
    

    return languagemap[language.toUppercase()]

}