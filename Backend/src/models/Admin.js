import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const AdminSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
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
  photo: {
    type: String,
    trim: true,
  },
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
AdminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
AdminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
AdminSchema.methods.generateAdminToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
const Admin = mongoose.model("Admin", AdminSchema);

export default Admin; 

