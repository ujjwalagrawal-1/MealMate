import QRCode from "qrcode";
import Mess from "../models/Mess.js";
import Attendance from "../models/AttendanceScehma.js";

const domain = process.env.DOMAIN || "http://localhost:3000";

const generateQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the mess
    const mess = await Mess.findById(id);
    if (!mess) {
      return res.status(404).json({ error: "Mess not found." });
    }

    // Generate QR code with mess-specific data (e.g., a unique URL or ID)
    const qrData = `${domain}/attendance?messId=${id}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // Save QR code URL to mess document
    mess.qrCodeUrl = qrCodeUrl;
    await mess.save();

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
    const { messId } = req.params;

    // Find the mess by ID and return the QR code
    const mess = await Mess.findById(messId);

    if (!mess || !mess.qrCodeUrl) {
      return res
        .status(404)
        .json({ success: true, error: "QR code not found for this mess." });
    }

    res.status(200).json({
      success: true,
      qrCodeUrl: mess.qrCodeUrl,
    });
  } catch (err) {
    console.error("Error fetching QR code:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { messId, studentId, meal } = req.body;
    // Validate meal type
    if (!["Breakfast", "Lunch", "Dinner"].includes(meal)) {
      return res.status(400).json({ success: false, error: "Invalid meal type." });
    }

    // Find the mess
    const mess = await Mess.findById(messId);
    if (!mess || !mess.isActive) {
      return res.status(400).json({ success: false, error: "Invalid or inactive mess." });
    }

    // Check if the student has already marked attendance for this meal
    const date = new Date().toISOString().slice(0, 10);
    const alreadyMarked = await Attendance.findOne({ messId, studentId, meal, date });
    if (alreadyMarked) {
      return res.status(400).json({ success: false, error: "Attendance already marked for this meal." });
    }

    // Find the serving hall
    const hall = mess.halls.find((h) => h.serving);
    if (!hall) {
      return res.status(400).json({ success: false, error: "No active hall serving." });
    }

    if (hall.filled >= hall.capacity) {
      return res.status(400).json({ success: false, error: "Hall is full." });
    }

    // Mark attendance
    hall.filled += 1;
    await mess.save();

    // Log attendance
    await Attendance.create({ studentId, messId, meal, date });

    res.status(200).json({ success: true, message: `Attendance marked for ${meal}.` });
  } catch (err) {
    console.error("Error marking attendance:", err.message);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
}

export { generateQRCode, fetchQRCode, markAttendance };
