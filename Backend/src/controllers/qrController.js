import QRCode from "qrcode";
import Mess from "../models/Mess.js";
import Hall from "../models/Hall.js";

const generateQRCode = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the mess
      const hall = await Hall.findById(id);
      if (!hall) {
        return res.status(404).json({ error: "Mess not found." });
      }
      
      console.log(hall)
      const qrData = hall._id.toString();
      const qrCodeUrl = await QRCode.toDataURL(qrData);
  
      // Save QR code URL to mess document
      hall.qrCodeUrl = qrCodeUrl;
      await hall.save();
  
      res.status(200).json({
        success: true,
        message: "QR code generated and associated with the mess.",
        qrCodeUrl,
      });
    } catch (err) {
      console.error("Error generating QR code:", err.message);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  const fetchQRCode = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the mess by ID and return the QR code
      const hall = await Hall.findById(id);
  
      if (!hall || !hall.qrCodeUrl) {
        return res
          .status(404)
          .json({ success: true, error: "QR code not found for this mess." });
      }
  
      res.status(200).json({
        success: true,
        qrCodeUrl: hall.qrCodeUrl,
      });
    } catch (err) {
      console.error("Error fetching QR code:", err.message);
      res.status(500).json({ error: "Internal server error." });
    }
  };

export { generateQRCode, fetchQRCode };