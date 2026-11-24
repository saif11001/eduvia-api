import "dotenv/config";
import express from "express";
import cors from "cors";

import prisma from "./src/lib/prisma.js";
import redis from "./src/lib/redis.js";

import authRouter from "./src/routes/auth.route.js";
import { errorHandler, notFound } from "./src/middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/')
app.use("/api/auth", authRouter);

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