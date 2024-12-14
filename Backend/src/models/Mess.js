import mongoose from "mongoose";

const MessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  halls: [
    {
      name: { type: String, required: true },
      capacity: { type: Number, required: true },
      filled: { type: Number, required: true, default: 0 },
      serving: {type: Boolean, required: true,  default: false},
    },
  ],
  mealTimes: [{ type: String, enum: ["Breakfast", "Lunch", "Dinner"] }],
  isActive: { type: Boolean, default: false },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  WardenId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  qrCodeUrl: { type: String },
});

const Mess = mongoose.model("Mess", MessSchema);

export default Mess;

