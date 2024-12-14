import mongoose from "mongoose";

const HallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  filled: { type: Number, required: true, default: 0 },
  serving: { type: Boolean, required: true, default: false },
  qrCodeUrl: { type: String, required: false },
  messId : { type: mongoose.Schema.Types.ObjectId, ref: "Mess" },
});

const Hall = mongoose.model("Hall", HallSchema);

export default Hall;
