import "dotenv/config";
import express from "express";
import cors from "cors";

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

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});