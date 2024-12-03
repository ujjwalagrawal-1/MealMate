import express from "express";
import { catchErrors } from "../handlers/errorHandlers.js";
import { isValidToken} from "../controllers/authController.js";
import { createMess, updateMess } from "../controllers/messController.js";
const messRouter = express.Router();

messRouter.route("/createMess").post(isValidToken, catchErrors(createMess));
messRouter.route("/updateMess").put(isValidToken, catchErrors(updateMess));

export default messRouter;
