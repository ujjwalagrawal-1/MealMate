import mongoose from "mongoose";

const MessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  halls: [{ 
    type: String,
    capacity: Number,
   }], // List of halls
  mealTimes: [{ type: String }], // e.g., Breakfast, Lunch, Dinner
  isActive: { type: Boolean, default: true },
});

const Mess = mongoose.model("Mess", MessSchema);

export default Mess;
