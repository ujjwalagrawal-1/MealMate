import { Student } from "../models/Student.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MessWorker } from "../models/MessWorker.js";

const messworkerLogin = async (req, res) => {
    try {
      const { mobilenumber , password } = req.body;
      if (!mobilenumber || !password) {
        return res.status(400).json({ message: "Please provide both mobilenumber and password." });
      }
      const messworker = await MessWorker.findOne({ mobilenumber });
      if (!messworker) {
        return res.status(404).json({ message: "Student not found." });
      }
      const isMatch = await bcrypt.compare(password, messworker.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials. Please check your password." });
      }
  
      // Generate JWT token
      const token = messworker.generateWorkerToken();
      const options = {
        httpOnly: true,
        secure: true, // Only secure in production
        sameSite: "None", // Required for cross-origin cookies
      };
      const result = await MessWorker.findOneAndUpdate(
        { _id: messworker._id },
        { isLoggedIn: true },
        { new: true }
      ).exec();
      // Send response with token
      res.header("x-auth-token", token)
      .status(200)
      .cookie("token", token, options)
      .json({
        message: "Login successful",
        token,
        worker: {
          _id: messworker._id,
          institutionId: messworker.institutionId,
          name: messworker.name,
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "Error during login.",
        error: error.message,
      });
    }
  };
  const isValidToken = async (req, res, next) => {
    try {
      const token = req.header("x-auth-token") || req.cookies?.token;
      if (!token)
        return res.status(401).json({
          success: false,
          result: null,
          message: "No authentication token, authorization denied.",
          jwtExpired: true,
        });
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Token verification failed, authorization denied.",
          jwtExpired: true,
        });
      const messworker = await MessWorker.findOne({ _id: verified._id });
      messworker.password = "";
      if (!messworker)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Only Access to StudeJWT_SECRET",
          jwtExpired: true, 
        });
  
      if (messworker.isLoggedIn === false)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Student is already logout try to login, authorization denied.",
          jwtExpired: true,
        });
      else {
        req.messworker = messworker;
        next();
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        result: null,
        message: err.message,
        jwtExpired: true,
      });
    }
  };
const updatemessworkerPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        const worker = await Student.findById(req.messworker._id);
        if (!worker) {
            return res.status(404).json({ message: "Student not found!" });
        }
        worker.password = password;
        await worker.save();
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password.", error: error.message });
    }
};

const getallworker = async (req, res) => {
    try {
        const worker = await MessWorker.find();
        res.status(200).json({ message: "Students fetched successfully!", data: worker });
    } catch (error) {
        res.status(500).json({ message: "Error fetching students.", error: error.message });
    }
};
const getworkerById = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await MessWorker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: "Student not found!" });
        }
        res.status(200).json({ message: "Worker fetched successfully!", data: worker });
    } catch (error) {
        res.status(500).json({ message: "Error fetching student.", error: error.message });
    }
};
const fetchuserdata = async(req,res) => {
  try {
    if(!req.messworker){
      res.status(500).json({
        message : "Failed to get the User !!"
      })
    }
  
    const data = req.messworker;
    if(data.password){
      data.password = "";
    }
    data.role = "MessWorker"
  
    req.status(200).json({
      message : "User Fetched Successfully",
      data
    })
  } catch (error) {
    res.status(400).json({
      message : error.message
    })
  }
}

export { messworkerLogin , updatemessworkerPassword , getallworker , getworkerById , isValidToken , fetchuserdata}