import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import AppError from "../lib/AppError.js";
import { sanitizeUser } from "../lib/sanitizeUser.js";
import { generateAccessToken } from "../lib/generateTokens.js";
import { setAccessCookie } from "../lib/cookies.js";

const getActiveUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
        throw new AppError("Not authenticated", 401);
    }
    return sanitizeUser(user);
};

export const verifyToken = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
        throw new AppError("Not authenticated", 401);
    }

    if (accessToken) {
        let decoded;
        try {
            decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
        } catch (error) {
            if (error.name !== "TokenExpiredError") {
                throw new AppError("Invalid token", 401);
            }
        }

        if (decoded) {
            req.user = await getActiveUser(decoded.userId);
            return next();
        }
    }

    if (!refreshToken) {
        throw new AppError("Session expired, please login again", 401);
    }

    let decodedRefresh;
    try {
        decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    } catch {
        throw new AppError("Session expired, please login again", 401);
    }

    const storedToken = await redis.get(`refresh_token:${decodedRefresh.userId}`);
    if (storedToken !== refreshToken) {
        throw new AppError("Session expired, please login again", 401);
    }

    req.user = await getActiveUser(decodedRefresh.userId);

    const { accessToken: newAccessToken } = generateAccessToken(decodedRefresh.userId);
    setAccessCookie(res, newAccessToken);

    next();
};