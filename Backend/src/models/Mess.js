import mongoose from "mongoose";

const MessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  halls: [{type: mongoose.Schema.Types.ObjectId, ref: "Hall"}],
  mealTimes: [{ type: String, enum: ["Breakfast", "Lunch", "Dinner"] }],
  isActive: { type: Boolean, default: false },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
<<<<<<< HEAD
  WardenId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  qrCodeUrl: { type: String },
=======
  wardenId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  
>>>>>>> 16dd4942961d0abb852b02a405d902589e28c61f
});

const Mess = mongoose.model("Mess", MessSchema);

export default Mess;

