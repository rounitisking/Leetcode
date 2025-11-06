import jwt from "jsonwebtoken"
import {db} from "../libs/db.js"
import dotenv from "dotenv"
dotenv.config()

export const authMiddleware = async(req ,res , next)=>{

    try {

        

        const refreshToken = req.cookies.refreshToken || ""
        const accessToken = req.cookies.accessToken || ""

        if(refreshToken == ""){
            return res.status(400).json({
                "msg": "unable to get the refresh token"
            })
        }if(accessToken == ""){refreshToken
            return res.status(400).json({
                "msg": "unable to get the access token"
            })
        }
        
        let refreshIsVerified = false
        let accessIsVerified = false
        try {
            refreshIsVerified = jwt.verify(refreshToken ,process.env.JWT_SECRET )
            refreshIsVerified = true
        } catch (error) {
            console.log("error occured in verifying refresh token")
        }
        try {
            accessIsVerified = jwt.verify(accessToken ,process.env.JWT_SECRET )
            accessIsVerified = true
        } catch (error) {
            console.log("error occured in verifying access token")
        }
        
        const decode = jwt.decode(accessToken)
        


        if(!accessIsVerified){
            // yaha pe agar mera access token expire hota hai tho ek naya jwt banega 
        
            if(!refreshIsVerified){
               return res.status(400).json({
                "msg" : "session expired login again"
            })

            }
        
            
            // generating new access token and storing it in the cookies 
                const newAccessToken = jwt.sign({id : decode.id , email : decode.email , name :  decode.name} , process.env.JWT_SECRET , {
                    expiresIn : "1d"
                })
                

            return res.cookie("accessToken" , newAccessToken , {
                httpOnly : true,
                sameSite : "strict",
                secure : process.env.NODE_ENV != "development",
                maxAge : 1000 * 60 * 24
            }
            ).status(200).json({
                "msg" : "user logged in succesfully"
            })
        
    }
    

        if(!refreshIsVerified){
            return res.status(400).json({
            "msg" : "session expired login again"
        })
        }



        //extract the details of the user and verify with the user that has requested if matched then user is loggedin

        const user = await db.user.findUnique({
            where : {id : decode.id},
            select : {
                name : true,
                id : true,
                email : true,
                image : true,
                role : true
            }
        })


        if(!user){
           return  res.status(400).json({
                "msg" : "user not found"
            })
        }
        
        req.user = user
        
        
       next()
        

    } catch (error) {
        console.log("error occured in the auth middleware" ,error)
    }



    
}



// this is called as rba - rolled back access 

export const checkAdmin = async (req, res, next)=>{

        try {
            const userId = req.user.id

            if(!userId){
                return res.status(400).json({
                    msg : "cannot get the user id"
                })
            } 
                const user = db.user.findUnique({
                    where : {id : userId},
                    select :  {
                        email : true ,
                        role : true
                    }
                })


            if(!user){
                
                return res.status(400).json({
                    msg : "user not found in the role middleware "
                })
            }
                
            if(user.role != "ADMIN"){
                return res.status(400).json({
                   msg : "only admin can create the questions"
               })

            }

            
            next()
        
    } catch (error) {
        console.log("error occured while cheking the role of the user", error) 
    }
    
    
}