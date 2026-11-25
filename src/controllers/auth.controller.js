import { signupService, verifyEmailService } from "../services/auth.service.js";

export const signup = async (req, res) => {
    const { user, emailSent } = await signupService(req.body);
    res.status(201).json({ success: true, user, emailSent });
};

export const verifyEmail = async (req, res, next) => {
    const user = await verifyEmailService(req.body);
    res.status(200).json({ success: true, user });
};

export const login = async (req, res, next) => {
    try {

    } catch (error) {

    }
};

export const logout = async (req, res, next) => {
    try {

    } catch (error) {

    }
};
