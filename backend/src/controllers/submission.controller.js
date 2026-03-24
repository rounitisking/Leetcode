import {db} from "../config/db.js"

export const getAllSubmissions = async (req , res) => {
    const userId = req.user.id
     try {
        const AllSubmission = await db.submission.findMany({
            where : {
                userId
            }
        })

        return res.status(200).json({
            success : true,
            message : "All submissions fetched successfully in submission controller",
            data : AllSubmission
        })
     } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Internal server error in submission controller",
            error : error.message
        })
     }

}


export const getSubmissionForProblem = async (req , res) => {

            const problemId = req.params.id
            const userId = req.user.id

            try {
                const Submission = await db.submission.findMany({
                    where : {
                        problemId,
                        userId
                    }
                })

                return res.status(200).json({
                    success : true,
                    message : "Submission fetched successfully in submission",
                    data : Submission
                })
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    success : false,
                    message : "Internal server error in submission",
                    error : error.message
                })
            }

}


export const getAllSubmissionsForProblem = async (req , res) => {

            const problemId = req.params.id

            try {
                const Submission = await db.submission.count({
                    where : {
                        problemId
                    }
                })

                return res.status(200).json({
                    success : true,
                    message : "Submission fetched successfully in submission controller",
                    data : Submission
                })
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    success : false,
                    message : "Internal server error in submission controller",
                    error : error.message
                })
            }
}