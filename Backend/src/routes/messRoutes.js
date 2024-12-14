import express from "express";
import { catchErrors } from "../handlers/errorHandlers.js";
import { isValidToken} from "../controllers/WardenController.js";
import { createMess, getMess, getMessById, setMessActive, setMessInactive, addHallToMess} from "../controllers/messController.js";
const messRouter = express.Router();

messRouter.post('/create', isValidToken, catchErrors(createMess));
// messRouter.put('/updateMess/:id', isValidToken, catchErrors(updateMess));
messRouter.get('/getMess', isValidToken, catchErrors(getMess));
messRouter.get('/getMess/:id', isValidToken,  getMessById);
messRouter.patch("/setMessActive/:id", isValidToken,  setMessActive);
messRouter.patch("/setMessInactive/:id", isValidToken, setMessInactive);
messRouter.patch("/addHallToMes/:messId", isValidToken, addHallToMess);
export default messRouter;
