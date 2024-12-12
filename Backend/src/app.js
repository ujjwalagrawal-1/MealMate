import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

//Routers imports
import authRouter from './routes/Adminauth.Routes.js';
import messRouter from './routes/messRoutes.js';
import attendanceRouter from './routes/attendanceRoutes.js';
import Studentroutes from './routes/Student.Routes.js';
import messworkerroutes from './routes/Messworker.Routes.js';

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;
console.log('port', process.env.PORT)
// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
    exposedHeaders: ["x-auth-token"],
}));
console.log('Allowed Origin:', process.env.CORS_ORIGIN);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req,res) {
    console.log("check")
    res.sendStatus(200)
})
app.use("/api/worker",messworkerroutes);
app.use("/api/student",Studentroutes);
app.use("/api/admin", authRouter)
app.use("/api/mess", messRouter)
app.use("/api/attendance", attendanceRouter)
export { app, port };