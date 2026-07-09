import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [],
    credentials: true
}))
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Kanban API is running 🚀"
    });
});
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16k"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routers.js";

app.use("/api/v1/users",userRouter)

export { app }