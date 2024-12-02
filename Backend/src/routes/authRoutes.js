import express from "express";

const authRouter = express.Router();

import { catchErrors } from "../handlers/errorHandlers.js";
import {
  register,
  isValidToken,
  login,
  logout,
} from "../controllers/authController.js";

//for testing purpose (register)
authRouter.route("/register").post(catchErrors(register));
authRouter.route("/login").post(catchErrors(login));
authRouter.route("/logout").post(isValidToken, catchErrors(logout));

export default authRouter;
