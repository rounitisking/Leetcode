// this contain the login for both running and submitting the code at same time 
import { submissionBatch } from "../libs/submissionResult.libs.js"
import { poolBatchResults } from "../libs/poolBatchResults.libs.js"
import { getLanguageName } from "../libs/getLanguageName.libs.js" 
import { db } from "../libs/db.js"
const executeCode = async (req , res) => {
    try {
        
        const {source_code , language_id , expected_outputs , stdin , problemid} = req.body

        const user_id = req.user.id

        // here we are validating testcase 
        if(!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length != stdin.length){
            return res.status(400).json({message : "Invalid testcase"})
        }
        if(!source_code || !language_id || !problemid || !user_id || !expected_outputs || !stdin){
            return res.status(400).json({message : "All fields are required"})
        }

        //prepare each testcase for each judge 0 batch submission
        const submission = stdin.map((input)=>({
                source_code,
                language_id,
                stdin: input,
                base64_encoded: false,
                wait : false
        }))

        const submitResponse = await submissionBatch(submission)
        const token = submitResponse.map((res)=>res.token)
        const result = await poolBatchResults(token)

        // here we are checking the result of the code and if it is correct then we are saving it to the database 

        const sol_correct = result.every((res)=> res.status.id == 3)

        if(!sol_correct){
            return res.status(400).json({message : "testcase is not correct in execute code controller"})
        }

        const output_judge0 = result.map((res)=>res.stdout ? res.stdout?.trim() : "")
        
        let is_correct = true
        
        const detailedOutput = output_judge0.map((res,index)=> {
            const stdout = res.stdout ? res.stdout?.trim() : ""
            const expectOutput = expected_outputs[index]
            const passed = stdout === expectOutput

            if(!passed){
                is_correct = false
            }

            return {
                testCased: index + 1,
                passed,
                actualOutput : stdout,
                expectedOutput : expectOutput,
                stderr : res.stderr || null,
                time : res.time ? `${res.time} S` : undefined,
                memory : res.memory? `${res.memory} KB` : undefined,
                compileOutput : res.compile_output || null,
                status : res.status.description,
                input : res.stdin,
                

            }
        })

        //storing the submission summary

        if(!is_correct){
            return res.status(400).json({message : "testcase is not same in execute code controller"})
        }

        const submissions = await db.submission.create({
            data : {
                userId : user_id,
                problemId : problemid,
                languageId : language_id,
                sourceCode : source_code,
                language : getLanguageName(language_id),
                stdin : stdin.join("\n"),
                stdout : JSON.stringify(detailedOutput.map((r)=>r.stdout)),
                stderr : detailedOutput.some((r)=>r.stderr ? JSON.stringify(detailedOutput.map((r)=>r.stderr)) : null),
                compileOutput : detailedOutput.some((r)=>r.compileOutput ? JSON.stringify(detailedOutput.map((r)=>r.compileOutput)) : null),
                time : detailedOutput.some((r)=>r.time ? JSON.stringify(detailedOutput.map((r)=>r.time)) : null),
                memory : detailedOutput.some((r)=>r.memory ? JSON.stringify(detailedOutput.map((r)=>r.memory)) : null),
                status : is_correct ? "ACCEPTED" : "WRONG ANSWER"
                
                


            }
        })


        //saving individual results 
        const testcaseSubmission = detailedOutput.map((res)=>({
            submissionId : submissions.id,
            testCased : res.testCased ,
            passed : res.passed,
            input : res.input,
            expectedOutput : res.expectedOutput,
            actualOutput : res.actualOutput,
            status : res.status,
            stderr : res.stderr,
            compileOutput : res.compileOutput,
            memory : res.memory,
            time : res.time,
        }))


        await db.testcaseResult.createMany({
            data : testcaseSubmission
        })

        // here we are using upsert - if record exsist update it or if not create it
        const final_output = await db.problemSolved.upsert({
            where : {
                userId_problemId : {
                    userId : user_id,
                    problemId : problemid,
                }
            },
            update : {
                
            },
            create : {
                userId : user_id,
                problemId : problemid,
            }
            
        })

        const submissionWithTestcase = await db.submission.findUnique({
            where : {
                id : submissions.id
            },
            include : {
                testcaseResult : true
            }
        })

        return res.status(200).json({message : "Code executed successfully in execute code controller " , submissionWithTestcase})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal server error in execute code controller"})
    }
}

module.exports = {executeCode}