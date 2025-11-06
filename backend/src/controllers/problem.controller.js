

const createProblem = async (req  , res )=>{

        const {title , description , difficultyLevel ,tags , example } = req.body

        if(!title){
            res.status(400).json({
                msg : "title not found"
            })
        }
}