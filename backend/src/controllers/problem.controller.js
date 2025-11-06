import {getJudgeZeroLanguageId} from "../libs/judgeLangId.libs"
import {submissionBatch} from "../libs/submissionResult.libs"
import {db} from "../libs/db"



const createProblem = async (req  , res )=>{

    // going to accept the data from the body 
    // chekc the role of the user again -- it should be admin
    //loop through each and every refrenced solution
    // get the language id from the judge 0 
    // prepare judge 0 submission for all testcases 
    

        const {title , description , difficultyLevel ,tags , examples , constraints , hints, testcases , referenceSolutions , status , codenippets} = req.body

        if(!title){
            return res.status(400).json({
                error : "title not found"
            })
        }if(!description){
            return res.status(400).json({
                error : "description not found"
            })
        }if(!difficultyLevel){
            return res.status(400).json({
                error : "difficultyLevel not found"
            })
        }if(!tags){
            return res.status(400).json({
                error : "tags not found"
            })
        }if(!examples){
            return res.status(400).json({
                error : "examples not found"
            })
        }if(!constraints){
            return res.status(400).json({
                error : "constraints not found"
            })
        }if(!hints){
            return res.status(400).json({
                error : "hints not found"
            })
        }if(!testcases){
            return res.status(400).json({
                error : "testcase not found"
            })
        }if(!referenceSolutions){
            return res.status(400).json({
                error : "refrence solution not found"
            })
        }if(!status){
            return res.status(400).json({
                error : "status not found"
            })
        }if(!codenippets){
            return res.status(400).json({
                error : "code snippets not found"
            })
        }

        //checking if the same question is present in the db or not 
        const exsistingTitle = await db.Problem.findUnique({
            where : {
                title
            }
        })
        

        if(exsistingTitle){
            res.status(400).json({
                error : "this title already exsist"
            })
        }
        
        
        if(req.user.role != "ADMIN"){
           return res.status(400).json({
                msg : "only admins are allowed to create a problem"
            })

        }


        try {

            // yaha pr ham language ka code  obtain krva rhe hai

            for(const [language , solutionCode] of Object.entries(referencetokenSolutions)){
                    const languageId = getJudgeZeroLanguageId(language)

                    if(!languageId){
                        return res.status(400).json({
                            msg : "language id not found"
                        })
                    }


                    // here we have created a submission for every testcase

                    const submissions = testcases.map(({input , output})=>({
                            source_code : solutionCode,
                            language_id : languageId,
                            stdin : input,
                            expected_output : output

                    }))

                    //extract tokens form response
                    const submissionResult = await submissionBatch(submissions)
                    // here we have got the token 
                    //submitting all the testcase in one batch 
                    const token = submissionResult.map(({res})=> res.token)
                    
                    
                    
                    
                    //pol judge zero until all the submissions are done 
                    const results = await poolBatchResults(token)
                    
                    
                    // validate that each testcases are passed
                     for(let i =0 ; i < results.length ; i++){
                        const result = results[i]
                        if(result.status.id != 3){
                            return res.status(400).json({
                                error : `testcase : ${i+1} failed for language : ${language}`
                            })
                        }
                     }


                     // save the problem to the database 
                     const problem_create = await db.Problem.create({
                        data  : {
                            title,
                            description,
                            difficultyLevel,
                            tags,
                            examples,
                            constraints,
                            hints,
                            testcases,
                            referenceSolutions,
                            status,
                            codenippets,
                            userId : req.user.id

                        }
                     })


                     res.status(200).json({
                        msg : "this is your new problem"
                     })

            }
        } catch (error) {
            console.log("error occured in teh for loop in create problem controller")
        }


}





export {createProblem}