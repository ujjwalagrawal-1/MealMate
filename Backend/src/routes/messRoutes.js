import express from "express";
import { catchErrors } from "../handlers/errorHandlers.js";
import { isValidToken} from "../controllers/authController.js";
import { createMess, getMess} from "../controllers/messController.js";
const messRouter = express.Router();

messRouter.post('/create', isValidToken, catchErrors(createMess));
// messRouter.put('/updateMess/:id', isValidToken, catchErrors(updateMess));
messRouter.get('/getMess', isValidToken, catchErrors(getMess));
export default messRouter;
