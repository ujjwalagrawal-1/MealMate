import express from "express";
import { isValidToken } from "../controllers/WardenController.js";
import { generateQRCode, fetchQRCode} from "../controllers/qrController.js";
const router = express.Router();

router.get('/generateQRCode/:id', isValidToken, generateQRCode)

// Route to fetch QR code for a specific mess
router.get('/fetchQRCode/:messId', isValidToken, fetchQRCode);

export default router