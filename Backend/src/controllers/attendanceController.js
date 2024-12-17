import schedule from "node-schedule";
import Mess from "../models/Mess.js";
import Hall from "../models/Hall.js";
import Attendance from "../models/Attendance.js";

const markAttendance = async (req, res) => {
  try {
    const { messId, hallId, wardenId, studentId, meal } = req.body;

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

    // Find the serving hall
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res
        .status(400)
        .json({ success: false, error: "No active hall serving." });
    }

    if (hall.filled >= hall.capacity) {
      return res.status(400).json({ success: false, error: "Hall is full." });
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
      return res.status(400).json({
        success: false,
        error: "Attendance already marked for this meal.",
      });
    }

    // Mark attendance
    hall.filled += 1;
    await hall.save();

    // Log attendance
    await Attendance.create({ studentId, messId, meal, date });

    // Schedule a job to decrease the hall's `filled` count after 15 minutes
    schedule.scheduleJob(Date.now() + 15 * 60 * 1000, async () => {
      try {
        const updatedHall = await Hall.findById(hallId);
        if (updatedHall) {
          updatedHall.filled = Math.max(0, updatedHall.filled - 1); // Ensure `filled` doesn't go below 0
          await updatedHall.save();
          console.log(
            `Attendance decreased for hall: ${updatedHall.name} after 15 minutes.`
          );
        }
      } catch (err) {
        console.error("Error decreasing attendance:", err.message);
      }
    });

    res
      .status(200)
      .json({ success: true, message: `Attendance marked for ${meal}.` });
  } catch (err) {
    console.error("Error marking attendance:", err.message);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export { markAttendance };
