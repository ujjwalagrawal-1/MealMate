import express from "express";
import { isValidToken } from "../controllers/WardenController.js";
import { markAttendance } from "../controllers/attendanceController.js";
const attendanceRouter = express.Router();


attendanceRouter.post("/markAttendance", markAttendance);

export default attendanceRouter