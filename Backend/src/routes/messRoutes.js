import express from "express";
import { catchErrors } from "../handlers/errorHandlers.js";
import { isValidToken} from "../controllers/AdminController.js";
import { createMess, getMess, getMessById, setMessActive, setMessInactive} from "../controllers/messController.js";
const messRouter = express.Router();

messRouter.post('/create', isValidToken, catchErrors(createMess));
// messRouter.put('/updateMess/:id', isValidToken, catchErrors(updateMess));
messRouter.get('/getMess', isValidToken, catchErrors(getMess));
messRouter.get('/getMess/:id', getMessById);
messRouter.patch("/setMessActive/:id", setMessActive);
messRouter.patch("/setMessInactive/:id", setMessInactive);
export default messRouter;
