import jwt from "jsonwebtoken"
import {db} from "../libs/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()

export const authMiddleware = async(req ,res , next)=>{

    try {

        
        console.log("HEADERS:", req.headers.cookie)
        console.log("COOKIES:", req.cookies)

        const refreshToken = req.cookies?.refreshToken || ""

        console.log("refresh token in the auth middleware :" , refreshToken)

        if(refreshToken == ""){
            return res.status(400).json({
                "msg": "unable to get the refresh token in auth middleware"
            })}
        
        
       
            let refreshIsVerified
        try {
            refreshIsVerified = jwt.verify(refreshToken ,process.env.JWT_SECRET )
    
        } catch (error) {
            return res.status(400).json({
                        success : "false",
                message : "refresh token is expired sign in again"
            })
        }
        


        //extract the details of the user and verify with the user that has requested if matched then user is loggedin

        const user = await db.user.findUnique({
            where : {id : refreshIsVerified.id},
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
                "msg" : "user not found in the auth middleware"
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
                const user = await db.user.findUnique({
                    where : {id : userId},
                    select :  {
                        email : true ,
                        role : true
                    }
                })


            if(!user){
                
                return res.status(400).json({
                    msg : "user not found in the checkadmin middleware "
                })
            }
                
            if(user.role != "ADMIN"){
                return res.status(400).json({
                   msg : "only admin can create the questions"
               })

            }

            
            next()
        
    } catch (error) {
        console.log("error occured while cheking the role of the user in the middleware", error) 
    }
    
    
}