import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import prisma from "./src/config/prisma.js";
import redis from "./src/config/redis.js";
import { errorHandler, notFound } from "./src/middlewares/error.middleware.js";

import authRouter from "./src/routes/auth.route.js";
import profileRouter from "./src/routes/student/profile.route.js";

const app = express();

app.set("trust proxy", 1);

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json({ limit: "3mb" }));

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

const start = async () => {
    try {
        await prisma.$connect();
        console.log("MySQL connected");

        await redis.ping();
        console.log("Redis connected");

        app.listen(port, () => {
            console.log(`server is running on port: ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

start();