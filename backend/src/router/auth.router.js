import express from "express"
import { registerUser  ,loginUser ,logoutUser, chechUser} from "../controllers/auth.controller.js"
const authRoute = express.Router()
import {authMiddleware} from "../middleware/auth.middleware.js"
authRoute.post("/registerUser", registerUser)
authRoute.post("/loginUser", loginUser)
authRoute.put("/logoutUser", authMiddleware , logoutUser)
authRoute.get("/checkUser", authMiddleware, chechUser)

export default authRoute


