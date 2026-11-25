import express from "express";
import { login, logout, signup, verifyEmail } from "../controllers/auth.controller.js";
import { signupRules, verifyEmailRules } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/signup", signupRules, validate, signup);

router.post("/verify-email", verifyEmailRules, validate, verifyEmail);

router.post("/login", login);

router.post("/logout", logout);

export default router;