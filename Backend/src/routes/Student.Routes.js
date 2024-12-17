import express from "express";

const Studentroutes = express.Router();

import { catchErrors } from "../handlers/errorHandlers.js";
import { fetchuserdata, getAllStudents, getStudentById, isValidToken, studentLogin, updateStudentPassword } from "../controllers/studentController.js";

Studentroutes.post("/login",catchErrors(studentLogin));
Studentroutes.post("/change_password",isValidToken,catchErrors(updateStudentPassword));
Studentroutes.get("/getallstudent",catchErrors(getAllStudents))
Studentroutes.get("getstudentbyid/:id",catchErrors(getStudentById));
Studentroutes.get("/getstudentdata",isValidToken,catchErrors(fetchuserdata))

export default Studentroutes