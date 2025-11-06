import express from "express"
import {createProblem , getAllProblems , getProblemsById} from "../controllers/problem.controller.js"
import {checkAdmin ,authMiddleware} from "../middleware/auth.middleware.js"
const problemRouter = express.Router()

problemRouter.post("/createProblem", authMiddleware , checkAdmin, createProblem)

export default problemRouter