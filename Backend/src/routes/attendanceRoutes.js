import express from "express";
import { isValidToken } from "../controllers/WardenController.js";
import { generateQRCode, fetchQRCode, markAttendance} from "../controllers/attendanceController.js";
const attendanceRouter = express.Router();

attendanceRouter.get('/generateQRCode/:id', isValidToken, generateQRCode)

// Route to fetch QR code for a specific mess
attendanceRouter.get('/fetchQRCode/:messId', isValidToken, fetchQRCode);
attendanceRouter.post("/markAttendance", markAttendance);

export default attendanceRouter