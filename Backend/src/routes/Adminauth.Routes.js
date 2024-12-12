import express from "express";

const Adminauthroute = express.Router();

import { catchErrors } from "../handlers/errorHandlers.js";
import {
  register,
  isValidToken,
  login,
  logout,
  singleStudentUpload ,
  bulkUploadStudents ,
  bulkDeleteStudents,
  bulkUploadMessWorkers,
  bulkDeleteMessWorkers,
  singleMessWorkerUpload
} from "../controllers/AdminController.js";
import { upload } from "../middlewares/multer.middleware.js";
//for testing purpose (register)x
Adminauthroute.route("/register").post(catchErrors(register));
Adminauthroute.route("/login").post(catchErrors(login));
Adminauthroute.route("/logout").post(isValidToken, catchErrors(logout));

Adminauthroute.post("/bulk_upload/student_data",isValidToken,upload.single('file'),catchErrors(bulkUploadStudents));

Adminauthroute.post("/bulk_delete/student_data",isValidToken,upload.single('file'),catchErrors(bulkDeleteStudents));

Adminauthroute.post("/add_single_student",isValidToken,catchErrors(singleStudentUpload))

Adminauthroute.post("/bulk_upload/messworkerdata",isValidToken,upload.single('file'),catchErrors(bulkUploadMessWorkers));
Adminauthroute.post("/bulk_delete/messworker_data",isValidToken,upload.single('file'),catchErrors(bulkDeleteMessWorkers));
Adminauthroute.post("/add_single_messworker",isValidToken,catchErrors(singleMessWorkerUpload))

export default Adminauthroute;
