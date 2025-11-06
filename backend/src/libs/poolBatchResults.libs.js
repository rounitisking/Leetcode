import axios from "axios"

const sleep = (time)=>{
    return new Promise((resiolve)=> setTimeout(resiolve , time))
}


export const poolBatchResults = async (token)=>{

    while(true){
        const {data} = await axios.get(`${process.env.JUDGE_API_URL}/submissions/batch` , {
        params : {
            tokens : token.join(","),
            base64_encoded  : false,
        }
    })

    const result = data.submissions
    const isAllDone = result.every((r)=>r.status.id != 1 || r.status.id != 2)
    
    if(isAllDone){
        console.log(result)
        return result
    }
    // 1sec ke andar iss endpoint ko dubara se hit karega 
    await sleep(1000)


}
    }