import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// // Routes

// app.use("/api/v1/users", );
// app.use("/api/v1/products", );
// app.use("/api/v1/orders", );

export { app, port };