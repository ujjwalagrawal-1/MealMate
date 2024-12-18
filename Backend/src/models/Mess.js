import mongoose from "mongoose";

const MessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  halls: [{type: mongoose.Schema.Types.ObjectId, ref: "Hall"}],
  mealTimes: [{ type: String, enum: ["Breakfast", "Lunch", "Dinner"] }],
  isActive: { type: Boolean, default: false },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  wardenId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

const Mess = mongoose.model("Mess", MessSchema);

export default Mess;