import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  messId: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true },
  meal: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true,
  },
  date: { type: String, required: true }, // e.g., "2024-12-06"
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;