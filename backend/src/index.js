import express from "express"
import dotenv from  "dotenv"
import authRoute from "./router/auth.router.js"
import cookieparser from "cookie-parser"

dotenv.config()

const app = express()


app.use(express.json())
app.use(cookieparser())

app.use("/api/v1/auth" , authRoute)


app.listen(process.env.PORT , ()=>{
    console.log(`app is listening on port ${process.env.PORT}`)
})