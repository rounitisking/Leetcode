import express from "express";
import checkingserver from "../controllers/checkServer.controller.js";
const checkRouter = express.Router()

checkRouter.get("/" , checkingserver)

export default checkRouter  