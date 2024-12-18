import { server as WebSocketServer } from "websocket";

let wsServer;
const clients = new Map();

// Initialize WebSocket server
export const initializeWebSocket = (httpServer) => {
    wsServer = new WebSocketServer({
        httpServer,
        autoAcceptConnections: false,
    });

    wsServer.on("request", (request) => {
        const connection = request.accept(null, request.origin);
        console.log("WebSocket connection accepted:", request.origin);

        const clientId = Date.now(); // Unique client ID
        clients.set(clientId, connection);

        connection.on("message", (message) => {
            if (message.type === "utf8") {
                console.log("Received WebSocket message:", message.utf8Data);
            }
        });

        connection.on("close", () => {
            console.log(`WebSocket client disconnected: ${clientId}`);
            clients.delete(clientId);
        });
    });

    console.log("WebSocket server initialized");
};

// Broadcast function to send messages to all clients
export const broadcast = (data) => {
    const message = JSON.stringify(data);
    clients.forEach((connection) => {
        connection.sendUTF(message);
    });
};
