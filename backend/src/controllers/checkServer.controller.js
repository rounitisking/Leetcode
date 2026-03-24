const checkingserver = async (req , res)=>{
    
    try {
        return res.status(200).json({
            "msg" : "server is ok"
        })
    } catch (error) {
        console.log("error occured in the checkingserver function", error)
    }
}

export default checkingserver