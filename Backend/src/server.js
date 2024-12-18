import dotenv from "dotenv"
import {ConnectDB} from "./config/db.js"
import { app,port } from './app.js'
import { createServer } from 'http'
import { initializeWebSocket } from "./utils/WebSocket.js"

dotenv.config({
    path: "./.env"
})

ConnectDB()
    .then(() => {
        const httpServer = createServer(app); // Wrap Express app in HTTP server
        initializeWebSocket(httpServer); // Initialize WebSocket server

        // Start the HTTP server
        httpServer.listen(port, () => {
            console.log(`Server is running at: http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });