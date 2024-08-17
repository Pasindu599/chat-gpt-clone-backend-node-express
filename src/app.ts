// src/index.ts
import express from "express";
import { config } from "dotenv";
import appRouter from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
// import morgan from "morgan";
config();

const app = express();

//middlewares
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;
