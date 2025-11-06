import dotenv from "dotenv"
import axios from "axios"
dotenv.config()
export const submissionBatch = async (submission)=>{

        // yaha pr ham ek endpoint hit karenge withthe user code then we output mai hame true ya false return karega ki code sahi hai ya nhi 

        const {data} = await axios.post(`${process.env.JUDGE_API_URL}/submissions/batch?base64_encoded=false` , {
            submission
        })


        // here in the data we will be getting tokens alternative to the code so we can identify them 

        console.log(` submission data of the code : ${data}`)

        return data
}