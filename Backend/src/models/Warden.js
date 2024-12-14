import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const WardenSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isLoggedIn: {
    type: Boolean,
  },
  mess: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mess" }],
});

// generating a hash
WardenSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
WardenSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
WardenSchema.methods.generateWardenToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: "Warden",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
const Warden = mongoose.model("Warden", WardenSchema);

export default Warden; 

