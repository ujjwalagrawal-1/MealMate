import { Student } from "../models/Student.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const studentLogin = async (req, res) => {
    try {
      const { institutionId, password } = req.body;
      if (!institutionId || !password) {
        return res.status(400).json({ message: "Please provide both institutionId and password." });
      }
      const student = await Student.findOne({ institutionId });
      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials. Please check your password." });
      }
  
      // Generate JWT token
      const token = student.generateStudentToken();
      const options = {
        httpOnly: true,
        secure: true, // Only secure in production
        sameSite: "None", // Required for cross-origin cookies
      };
      const result = await Student.findOneAndUpdate(
        { _id: student._id },
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
        userRole :"student",
        student: {
          _id: student._id,
          institutionId: student.institutionId,
          name: student.name,
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
      const student = await Student.findOne({ _id: verified._id });
      if (!student)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Only Access to StudeJWT_SECRET",
          jwtExpired: true, 
        });
  
      if (student.isLoggedIn === false)
        return res.status(401).json({
          success: false,
          result: null,
          message: "Student is already logout try to login, authorization denied.",
          jwtExpired: true,
        });
      else {
        req.student = student;
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
const updateStudentPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        const student = await Student.findById(req.student._id);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }
        student.password = password;
        await student.save();
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password.", error: error.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ message: "Students fetched successfully!", data: students });
    } catch (error) {
        res.status(500).json({ message: "Error fetching students.", error: error.message });
    }
};
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json({ message: "Student fetched successfully!", data: student });
    } catch (error) {
        res.status(500).json({ message: "Error fetching student.", error: error.message });
    }
};
const fetchuserdata = async(req,res) => {
  try {
    if(!req.student){
      res.status(500).json({
        message : "Failed to get the User !!"
      })
    }
  
    const data = req.student;
    if(data.password){
      data.password = "";
    }
    data.role = "Student"
  
    res.status(200).json({
      message : "User Fetched Successfully",
      data : data
    })
  } catch (error) {
    res.status(400).json({
      message : error.message
    })
  }
  
}

export { studentLogin , updateStudentPassword , getAllStudents , getStudentById , isValidToken , fetchuserdata }