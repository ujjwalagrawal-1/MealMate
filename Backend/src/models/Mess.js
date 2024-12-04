import mongoose from "mongoose";

const MessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  halls: [
    {
      name: { type: String, required: true },
      capacity: { type: Number, required: true },
    },
  ],
  mealTimes: [{ type: String, enum: ["Breakfast", "Lunch", "Dinner"] }],
  isActive: { type: Boolean, default: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

const Mess = mongoose.model("Mess", MessSchema);

export default Mess;
