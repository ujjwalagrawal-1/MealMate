import express from "express";

const messworkerroutes = express.Router();

import { catchErrors } from "../handlers/errorHandlers.js";
import { getallworker, getworkerById, messworkerLogin, updatemessworkerPassword ,isValidToken } from "../controllers/MessWorkercontroller.js";

messworkerroutes.post("/login",catchErrors(messworkerLogin));
messworkerroutes.post("/change_password",isValidToken,catchErrors(updatemessworkerPassword));
messworkerroutes.get("/getallstudent",catchErrors(getallworker))
messworkerroutes.get("getstudentbyid/:id",catchErrors(getworkerById));
export default messworkerroutes;