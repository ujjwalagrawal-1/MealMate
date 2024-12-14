import express from "express";

const WardenRoutes = express.Router();

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
} from "../controllers/WardenController.js";

import { upload } from "../middlewares/multer.middleware.js";
//for testing purpose (register)x
WardenRoutes.route("/register").post(catchErrors(register));
WardenRoutes.route("/login").post(catchErrors(login));
WardenRoutes.route("/logout").post(isValidToken, catchErrors(logout));

//warden
WardenRoutes.post("/bulk_upload/student_data",isValidToken,upload.single('file'),catchErrors(bulkUploadStudents));
WardenRoutes.post("/bulk_delete/student_data",isValidToken,upload.single('file'),catchErrors(bulkDeleteStudents));
WardenRoutes.post("/add_single_student",isValidToken,catchErrors(singleStudentUpload))
WardenRoutes.post("/bulk_upload/messworkerdata",isValidToken,upload.single('file'),catchErrors(bulkUploadMessWorkers));
WardenRoutes.post("/bulk_delete/messworker_data",isValidToken,upload.single('file'),catchErrors(bulkDeleteMessWorkers));
WardenRoutes.post("/add_single_messworker",isValidToken,catchErrors(singleMessWorkerUpload))

export default WardenRoutes;
