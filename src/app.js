import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST",
    "optionsSuccessStatus": 200,
    credentials: true
};

app.use(express.json({ limit: "1mb" })); // incoming JSON data must not exceed 1 MB
app.use(express.static("public")); // Serve a folder containing public assets
app.use(express.urlencoded({ extended: true, limit: "256kb" })); // allow parsing URL encoded payload into JavaScript object
// extended: true ---> Also allow nested objects
// limit: "256kb" ---> Set a limit of 256 KB on data coming from the URL

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors());

// app.use(cors(corsOptions)); // cors with custom configuration


// allow reading and setting cookies for client in a secure manner
app.use(cookieParser()); // allow reading cookies sent by the client and make them available in req.cookies

export { app };
