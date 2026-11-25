import { clearAuthCookies, setCookies } from "../lib/cookies.js";
import { forgotPasswordService, loginService, logoutService, resendVerificationService, resetPasswordService, signupService, verifyEmailService } from "../services/auth.service.js";

export const signup = async (req, res, next) => {
    const { user, emailSent } = await signupService(req.body);
    res.status(201).json({ success: true, user, emailSent });
};

export const verifyEmail = async (req, res, next) => {
    const { user, accessToken, refreshToken } = await verifyEmailService(req.body);
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ success: true, user });
};

export const resendVerification = async (req, res, next) => {
    await resendVerificationService(req.body);
    res.status(200).json({ success: true, message: "If the account exists and isn't verified, a new code has been sent" });
}

export const login = async (req, res, next) => {
    const { user, accessToken, refreshToken } = await loginService(req.body);
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ success: true, user });
};

export const logout = async (req, res, next) => {
    await logoutService(req.cookies.refreshToken);
    clearAuthCookies(res);
    res.status(200).json({ success: true, message: "Logged out" });
};

export const forgotPassword = async (req, res, next) => {
    await forgotPasswordService(req.body);
    res.status(200).json({ success: true, message: "If an account exists with this email, a reset link has been sent" })
};

export const resetPassword = async (req, res, next) => {
    await resetPasswordService(req.body);
    res.status(200).json({ success: true, message: "Password reset successfully, please log in" });
};
