import QRCode from "qrcode";
import Mess from "../models/Mess.js";
import Attendance from "../models/AttendanceScehma.js";
import decreaseFilledQueue from "../queueWorker.js"

const domain = process.env.DOMAIN || "http://localhost:3000";

const markAttendance = async (req, res) => {
  try {
    const { hallId, wardenId, studentId, meal } = req.body;
    // Validate meal type
    if (!["Breakfast", "Lunch", "Dinner"].includes(meal)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid meal type." });
    }

    // Find the mess
    const mess = await Mess.findById(messId);
    if (!mess || !mess.isActive) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or inactive mess." });
    }

    // Check if the student has already marked attendance for this meal
    const date = new Date().toISOString().slice(0, 10);
    const alreadyMarked = await Attendance.findOne({
      messId,
      studentId,
      meal,
      date,
    });
    if (alreadyMarked) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Attendance already marked for this meal.",
        });
    }

    // Find the serving hall
    const hall = mess.halls.find((h) => h.serving);
    if (!hall) {
      return res
        .status(400)
        .json({ success: false, error: "No active hall serving." });
    }

    if (hall.filled >= hall.capacity) {
      return res.status(400).json({ success: false, error: "Hall is full." });
    }

    // Mark attendance
    hall.filled += 1;
    await mess.save();

    const hallName = hall.name;
    // Add a job to decrease the filled count after 15 minutes
    console.log("calling bull");
    decreaseFilledQueue.add(
      { messId, hallName },
      { delay: 1 * 10 * 1000 } // 15 minutes
    );
    // Log attendance
    await Attendance.create({ studentId, messId, meal, date }); 

    res
      .status(200)
      .json({ success: true, message: `Attendance marked for ${meal}.` });
  } catch (err) {
    console.error("Error marking attendance:", err.message);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export {  markAttendance };
