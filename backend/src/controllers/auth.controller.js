import bcrypt from "bcryptjs"
//bcrypt js is used to hash the password 
import {db} from "../libs/db.js"
import pkg from "@prisma/client"
const { PrismaClient, UserRole } = pkg
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const registerUser = async (req,res)=>{
    
    const {name , email , password} = req.body

    try {

        //checking if the field is not empty 

        if(!name){
           return res.status(400).json({"msg" :  "name is required"})
        } 
        
        if(!email){
            
            return res.status(400).json({"msg" :  "email is required"})
        } 
        
        
        if(!password){
            return res.status(400).json({"msg" :  "password is required"})
            
            
        }
        
        
        // validation of the fields 
        
        
        
        
        //checking if the user already exsist in the database or not 
        
        const exsistingUser = await db.user.findUnique({
            where : {
                email
            }
        })
        
        
        if(exsistingUser){
           return res.status(400).json({"msg" :  "user already exsist"})
            
        }

        // storing the password in hashed form
        const hashedpwd = await bcrypt.hash(password , 10)

        
        //creating the new user
        const newuser = await db.user.create({data : {name , email , password : hashedpwd , role : UserRole.USER}})

        if(!newuser){
           return  res.status(400).json({"msg" : "unable to create a new user"})
        }
        


        
        
        return res.status(200).json({
                    msg : "new user created", 
                    data : {
                        id : newuser.id,
                        name,
                        email,
                        role : newuser.role,
                        image : newuser.image


                    }
        })



    } catch (error) {
        console.log("error occured in registering of user" , error)
    }

    


}




const loginUser = async (req, res)=>{

    // console.log("login req received" , req.body)

    const {email , password} = req.body
    
    try {
        if(!email){
            
           return  res.status(400).json({"msg" :  "email is required"})
        } 
        
        
        if(!password){
           return res.status(400).json({"msg" :  "password is required"})
            
        }
        
        
        // searching the user in the db 
        
        const exsistinguser = await db.user.findUnique({
            where : { email}
        })
        
        
        if(!exsistinguser){
           return  res.status(400).json({"msg" :  "register the user first"})
        }
        
        
        
        
        // validation of the details 
        
        
        
        
        const ismatch = await bcrypt.compare(password , exsistinguser.password)
        if(!ismatch){
          return   res.status(400).json({"msg" :  "invalid credentials"})
    
        }


        // here we will create a refresh token and assign that in the cookies 
        const refreshtoken =  jwt.sign({id : exsistinguser.id} , process.env.JWT_SECRET , {
            expiresIn : "7d"
        })

        
        
        //create a access token 
        
        const accessToken =  jwt.sign({id : exsistinguser.id , email , name : exsistinguser.name} , process.env.JWT_SECRET, {
            expiresIn  : "1d"
        } )
        
        res.cookie("refreshToken" , refreshtoken , {
            httpOnly : true,
            sameSite : "strict",
            secure : process.env.NODE_ENV != "development",
            maxAge : 1000 * 60 * 60 * 24 * 7 //7 days
    
        })
    
         res.cookie("accessToken", accessToken,  {
                httpOnly : true,
                sameSite : "strict",
                secure : process.env.NODE_ENV != "development",
                maxAge : 1000 * 60 * 60 * 24 // 1 day
        
            })
            
        
            
            return res.status(200).json({
                "msg" : "user logged in succesfully",
                data : {
                            id : exsistinguser.id,
                            name : exsistinguser.name,
                            email,
                            role : exsistinguser.role,
                            image : exsistinguser.image
    
    
                        }
            })
    
    
    
    } catch (error) {
        console.log("error occured in login of user", error)
    }
}


const logoutUser = async (req,res)=>{

    try {
       res.clearCookie("refreshToken" ,
        {
                httpOnly : true,
                sameSite : "strict",
                secure : process.env.NODE_ENV != "development",}
       )
       
       res.clearCookie("accessToken" ,
        {
                httpOnly : true,
                sameSite : "strict",
                secure : process.env.NODE_ENV != "development",}
       )
       
       
       return res.status(200).json({
            "msg" : "user logged out successfully"
        })
    } catch (error) {
        console.log("error occured in the logout fucntion", error)
    }
}



const chechUser = async (req ,res)=>{
    
    
    
    try {
        return res.status(200).json({
            success : true,
            "msg" : "user logged in successfully",
            "user" : req.user
        })
    } catch (error) {
        console.log("error occured in the logout fucntion", error)
        
    }
}




export {registerUser , loginUser, logoutUser , chechUser}