import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Warden from "../models/Warden.js";
import dotenv from "dotenv";
import { Student } from "../models/Student.js";
import csv from 'csvtojson'
import { MessWorker } from "../models/MessWorker.js";
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

    const existingWarden = await Warden.findOne({ email: email });
    if (existingWarden)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newWarden = new Warden({
      email,
      password: passwordHash,
      name,
      surname,
    });
    const savedWarden = await newWarden.save();
    res.status(200)
    .send({
      success: true,
      message : "Warden Created Successfully!!",
      Warden: {
        id: savedWarden._id,
        name: savedWarden.name,
        surname: savedWarden.surname,
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
    // Validate fields
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const warden = await Warden.findOne({ email: email });
    if (!warden)
      return res.status(400).json({
        success: false,
        result: null,
        message: "No account with this email has been registered.",
      });

    const isMatch = await bcrypt.compare(password, warden.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Invalid credentials.",
      });

    // Set token expiration time based on Remember Me
    const token = warden.generateWardenToken();

    const result = await Warden.findOneAndUpdate(
      { _id: warden._id },
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
          warden: {
            id: result._id,
            name: result.name,
            isLoggedIn: result.isLoggedIn,
          },
          userRole: "Warden",
        },
        message: "Successfully login Warden",
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
    const warden = await Warden.findOne({ _id: verified._id });
    if (!warden)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Only Access to Warden",
        jwtExpired: true, 
      });

    if (warden.isLoggedIn === false)
      return res.status(401).json({
        success: false,
        result: null,
        message: "Warden is already logout try to login, authorization denied.",
        jwtExpired: true,
      });
    else {
      req.warden = warden._id;
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
    const result = await Warden.findOneAndUpdate(
      { _id: req.warden._id },
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
        WardenId: req.warden._id,
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
          WardenId : req.warden._id,
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
      // console.log("uess");
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
        WardenId: req.warden._id,
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
      WardenId: req.warden._id,
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
const fetchuserdata = async(req,res) => {
  try {
    if(!req.warden){
      res.status(500).json({
        message : "Failed to get the User !!"
      })
    }
  
    const data = req.warden;
    if(data.password){
      data.password = "";
    }
    data.role = "Warden"
  
    res.status(200).json({
      message : "User Fetched Successfully",
      data
    })
  } catch (error) {
    res.status(400).json({
      message : error.message
    })
  }
}
export { logout, register, isValidToken, login  ,bulkUploadStudents , singleStudentUpload , bulkDeleteStudents , bulkUploadMessWorkers,
  singleMessWorkerUpload,
  bulkDeleteMessWorkers,fetchuserdata};
