import express from "express"
import {createProblem , getAllProblems , getProblemsById , getAllProblemsSolvedByUser, deleteProblem, updateProblem} from "../controllers/problem.controller.js"
import {checkAdmin ,authMiddleware} from "../middleware/auth.middleware.js"
const problemRouter = express.Router()

// this is role based access

problemRouter.post("/createProblem", authMiddleware , checkAdmin, createProblem)
problemRouter.get("/getAllProblems",authMiddleware,getAllProblems)
problemRouter.get("/getProblemsById/:id",authMiddleware, getProblemsById)
problemRouter.get("/getAllProblemsSolvedByUser/:id", authMiddleware,getAllProblemsSolvedByUser)
problemRouter.delete("/deleteProblem/:id",authMiddleware , checkAdmin, deleteProblem)
problemRouter.put("/updateProblem/:id", authMiddleware , checkAdmin, updateProblem)
export default problemRouter