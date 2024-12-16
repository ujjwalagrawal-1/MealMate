import express from "express";
import { isValidToken } from "../controllers/WardenController.js";

const attendanceRouter = express.Router();


// attendanceRouter.post("/markAttendance", markAttendance);

export default attendanceRouter