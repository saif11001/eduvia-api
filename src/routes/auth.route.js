import express from "express";
import { forgotPassword, login, logout, resendVerification, resetPassword, signup, verifyEmail } from "../controllers/auth.controller.js";
import { emailOnlyRules, loginRules, resetPasswordRules, signupRules, verifyEmailRules } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/signup", signupRules, validate, signup);

router.post("/verify-email", verifyEmailRules, validate, verifyEmail);

router.post('/resend-verification', emailOnlyRules, validate, resendVerification);

router.post("/login", loginRules, validate, login);

router.post("/logout", logout);

router.post("/forgot-password", emailOnlyRules, validate, forgotPassword);

router.post("/reset-password", resetPasswordRules, validate, resetPassword);

export default router;