import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';


dotenv.config();
console.log(process.env.FRONTEND_URL);
const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json);
app.use(express.urlencoded({ extended: true }));

export default app;
