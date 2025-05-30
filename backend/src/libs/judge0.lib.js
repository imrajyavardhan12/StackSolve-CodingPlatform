import axios from "axios"

export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":100,
        "JAVA":91,
        "JAVASCRIPT":102,
    }

    return languageMap[language.toUpperCase()]
}

const sleep  = (ms)=> new Promise((resolve)=> setTimeout(resolve , ms))

export const pollBatchResults = async (tokens)=>{
    while(true){
        
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            },
            headers: {
                'Authorization': `Bearer ${process.env.SULU_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        const results = data.submissions;

        const isAllDone = results.every(
            (r)=> r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDone) return results
        await sleep(1000)
    }
}

export const submitBatch = async (submissions)=>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    },
        {
            headers: {
            'Authorization': `Bearer ${process.env.SULU_API_KEY}`,
            'Content-Type': 'application/json'
            }
})


    console.log("Submission Results: ", data)

    return data 
}


export function getLanguageName(languageId){
    const LANGUAGE_NAMES = {
        102: "JavaScript",
        100: "Python",
        91: "Java",
    }

    return LANGUAGE_NAMES[languageId] || "Unknown"
}