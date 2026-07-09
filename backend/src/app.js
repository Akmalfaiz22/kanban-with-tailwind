import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { verifyJWT } from "./middleware/auth.middlewares.js";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [],
    credentials: true
}))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/landing.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
});

app.get("/password", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/password.html"));
});

app.get("/dashboard", verifyJWT, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});



app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16k"}))
app.use(express.static(path.join(__dirname, "../public")))
app.use(cookieParser())

import userRouter from "./routes/user.routers.js";

app.use("/api/v1/users",userRouter)

export { app }