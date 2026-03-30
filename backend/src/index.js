// zod library is used to validate the data 

import express from "express"
import dotenv from  "dotenv"
import authRoute from "./router/auth.router.js"
import cookieparser from "cookie-parser"
import problemRouter from "../src/router/problem.router.js"
import checkRouter from "./router/check.router.js"
import cors from "cors"

dotenv.config()

const app = express()


app.use(cors({
  origin: ["http://localhost:8070"], // ya jo bhi tera frontend/Postman origin hai
  credentials: true
}))
app.use(express.json())
app.use(cookieparser())

app.use("/api/v1/checkServer",checkRouter)
app.use("/api/v1/auth" , authRoute)
app.use("/api/v1/problems" , problemRouter)


app.listen(process.env.PORT ,"0.0.0.0", ()=>{
    console.log(`app is listening on port ${process.env.PORT}`)
})

