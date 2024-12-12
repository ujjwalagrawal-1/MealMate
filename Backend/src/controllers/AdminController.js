import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";
import { Student } from "../models/Student.js";
import csv from 'csvtojson'
dotenv.config({ path: ".variables.env" });

const register = async (req, res) => {
  try {
    let { email, password, passwordCheck, name, surname } = req.body;
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email,
      password: passwordHash,
      name,
      surname,
    });
    const savedAdmin = await newAdmin.save();
    res.status(200)
    .send({
      success: true,
      message : "Admin Created Successfully!!",
      admin: {
        id: savedAdmin._id,
        name: savedAdmin.name,
        surname: savedAdmin.surname,
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      result: null,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body; 
    console.log(req.body);
    // Validate fields
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const admin = await Admin.findOne({ email: email });
    if (!admin)
      return res.status(400).json({
        success: false,
        result: null,
        message: "No account with this email has been registered.",
      });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Invalid credentials.",
      });

    // Set token expiration time based on Remember Me
    const token = admin.generateAdminToken();

    const result = await Admin.findOneAndUpdate(
      { _id: admin._id },
      { isLoggedIn: true },
      { new: true }
    ).exec();
    const options = {
      httpOnly: true,
      secure: true, // Only secure in production
      sameSite: "None", // Required for cross-origin cookies
    };
    res
      .header("x-auth-token", token)
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        result: {
          admin: {
            id: result._id,
            name: result.name,
            isLoggedIn: result.isLoggedIn,
          },
          userRole: "admin",
        },
        message: "Successfully login admin",
        token : token
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, result: null, message: err.message });
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
    const admin = await Admin.findOne({ _id: verified._id });
    if (!admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Only Access to Admin",
        jwtExpired: true, 
      });

    if (admin.isLoggedIn === false)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Admin is already logout try to login, authorization denied.",
        jwtExpired: true,
      });
    else {
      req.admin = admin;
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

const logout = async (req, res) => {
  try {
    const result = await Admin.findOneAndUpdate(
      { _id: req.admin._id },
      { isLoggedIn: false },
      {
        new: true,
      }
    ).exec();
    const options = {
      httpOnly: true,
      secure: true, // Only secure in production
      sameSite: "None", // Required for cross-origin cookies
    };
    res.status(200).clearCookie("token", options).json({ isLoggedIn: result.isLoggedIn });
  } catch (error) {
    res.status(401).json({
      message : error.message
    })
  }
  
};



const bulkUploadStudents = async (req, res) => {
  try {
    let allstudents = [];
    const response = await csv().fromFile(req.file.path);
    for (let i = 0; i < response.length; i++) {
      allstudents.push({
        name: response[i].name,
        email: response[i].email,
        institutionId: response[i].institutionId,
        gender: response[i].gender,
        mobileNumber: response[i].mobileNumber,
        adminId: req.admin._id,
        password: response[i].institutionId
      });
    }

    const allusers = await Student.insertMany(allstudents);

    if (!allusers) {
      return res.status(402).json({
        message: "Failed to Load the User"
      });
    }

    res.status(200).json({
      message: "All the Students Uploaded successfully."
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during bulk upload.",
      error: error.message
    });
  }
};


const singleStudentUpload = async (req, res) => {
  try {

      const { name ,email , institutionId, gender, mobileNumber } = req.body;
      if(!name || !email || !institutionId || !gender || !mobileNumber){
        res.status(400).json({
          message : "Please Provide All the Field"
        })
      }
      const newStudent = new Student({
          name,
          institutionId,
          gender,
          email,
          adminId : req.admin._id,
          mobileNumber,
          password : institutionId
      });

      // Save the student to the database
      const studentuser = await newStudent.save();
      res.status(200).json({ message: "Student data uploaded successfully!", data: {
        student_id : studentuser._id,
        email : studentuser.email,
      }});
  } catch (error) {
      res.status(500).json({ message: "Error during single student upload.", error: error.message });
  }
};

const bulkDeleteStudents = async (req, res) => {
  try {
    // Read CSV file
    const studentsToDelete = await csv().fromFile(req.file.path);
    const studentIdentifiers = studentsToDelete.map(student => student.institutionId); 
    const result = await Student.deleteMany({ institutionId: { $in: studentIdentifiers } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No students found to delete!" });
    }

    res.status(200).json({
      message: `${result.deletedCount} student(s) deleted successfully!`
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during bulk delete.",
      error: error.message
    });
  }
};

const bulkUploadMessWorkers = async (req, res) => {
  try {
    let messWorkers = [];
    const response = await csv().fromFile(req.file.path);
    for (let i = 0; i < response.length; i++) {
      messWorkers.push({
        name: response[i].name,
        aadharNumber: response[i].aadharNumber,
        mobileNumber: response[i].mobileNumber,
        address: response[i].address,
        adminId: req.admin._id,
      });
    }

    const allWorkers = await MessWorker.insertMany(messWorkers);

    if (!allWorkers) {
      return res.status(402).json({
        message: "Failed to upload the mess workers",
      });
    }

    res.status(200).json({
      message: "All the mess workers uploaded successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during bulk upload.",
      error: error.message,
    });
  }
};

// Single mess worker upload function
const singleMessWorkerUpload = async (req, res) => {
  try {
    const { name, aadharNumber, mobileNumber, address } = req.body;

    // Validate fields
    if (!name || !aadharNumber || !mobileNumber || !address) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }

    const newMessWorker = new MessWorker({
      name,
      aadharNumber,
      mobileNumber,
      address,
      adminId: req.admin._id,
    });

    const messWorker = await newMessWorker.save();

    res.status(200).json({
      message: "Mess worker data uploaded successfully!",
      data: {
        worker_id: messWorker._id,
        name: messWorker.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during single mess worker upload.",
      error: error.message,
    });
  }
};

const bulkDeleteMessWorkers = async (req, res) => {
  try {

    const workersToDelete = await csv().fromFile(req.file.path);
    const mobileNumber = workersToDelete.map(worker => worker.mobileNumber);

    const result = await MessWorker.deleteMany({
      mobileNumber: { $in: mobileNumber },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "No mess workers found to delete!",
      });
    }

    res.status(200).json({
      message: `${result.deletedCount} mess worker(s) deleted successfully!`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during bulk delete.",
      error: error.message,
    });
  }
};
export { logout, register, isValidToken, login  ,bulkUploadStudents , singleStudentUpload , bulkDeleteStudents , bulkUploadMessWorkers,
  singleMessWorkerUpload,
  bulkDeleteMessWorkers,};
