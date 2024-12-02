
import dotenv from "dotenv"
import {ConnectDB} from "./config/db.js"
import { app,port } from './app.js';

dotenv.config({
    path: "./.env"
})

ConnectDB()
.then(()=>{
    app.listen(port , ()=>{
        console.log(`Server is running at: http://localhost:${port}`)
    })
})
.catch((error)=>{
    console.log(error);
})