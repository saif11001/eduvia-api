import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import redis from "../config/redis.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../emails/emails.js";
import { sanitizeUser } from "../lib/sanitizeUser.js";
import AppError from "../lib/AppError.js";
import { generateTokens } from "../lib/generateTokens.js";
import { deleteRefreshToken, storeRefreshToken } from "../lib/refreshToken.js";

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

const sendVerificationCode = async (user) => {
    const allowed = await redis.set(`verify:cooldown:${user.id}`, "1", "EX", 60, "NX");
    if (!allowed) {
        throw new AppError("Please wait a minute before requesting a new code", 429);
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    await redis.set(`verify:code:${user.id}`, hashedCode, "EX", 900);
    await redis.del(`verify:attempts:${user.id}`);

    await sendVerificationEmail({
        email: user.email,
        name: user.firstName,
        code,
    });
}

export const signupService = async ({ firstName, lastName, email, password, role }) => {
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
        throw new AppError("Email already in use", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const isInstructor = (role === "INSTRUCTOR");

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: isInstructor ? "INSTRUCTOR" : "STUDENT",
            ...(isInstructor && {
                instructorProfile: { create: {} }
            })
        }
    });

    let emailSent = true;

    try {
        await sendVerificationCode(user);
    } catch (error) {
        console.error(error);
        emailSent = false;
    }

    return { user: sanitizeUser(user), emailSent };
}

export const verifyEmailService = async ({ email, code }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new AppError("Invalid code", 400);
    if (user.emailVerified) throw new AppError("Email already verified", 409);

    const attempts = await redis.incr(`verify:attempts:${user.id}`);
    if (attempts === 1) await redis.expire(`verify:attempts:${user.id}`, 900);

    if (attempts > 5) {
        await redis.del(`verify:code:${user.id}`);
        throw new AppError("Too many attempts, please request a new code", 429);
    }

    const storedCode = await redis.get(`verify:code:${user.id}`);
    if (!storedCode) {
        throw new AppError("Code expired, please request a new one", 400);
    }

    const hashedInput = crypto.createHash("sha256").update(code).digest("hex");
    if (hashedInput !== storedCode) {
        throw new AppError("Invalid code", 400);
    }

    await redis.del(`verify:code:${user.id}`, `verify:attempts:${user.id}`);

    const verifiedUser = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
    });

    try {
        await sendWelcomeEmail({
            email: verifiedUser.email,
            name: verifiedUser.firstName,
        });
    } catch { }

    const { accessToken, refreshToken } = generateTokens(verifiedUser.id);
    await storeRefreshToken(verifiedUser.id, refreshToken);

    return { user: sanitizeUser(verifiedUser), accessToken, refreshToken };
};

export const resendVerificationService = async ({ email }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerified) return;

    await sendVerificationCode(user);
};

export const loginService = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
        throw new AppError("Invalid email or password", 401);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        throw new AppError("Wrong password", 401);
    }

    if (!user.isActive) {
        throw new AppError("This account has been deactivated", 403);
    }

    if (!user.emailVerified) {
        throw new AppError("Please verify your email first", 403);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    await storeRefreshToken(user.id, refreshToken);

    return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const logoutService = async (refreshToken) => {
    if (!refreshToken) return;

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    } catch {
        return;
    }

    await deleteRefreshToken(decoded.userId);
};

export const forgotPasswordService = async ({ email }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return;

    const allowed = await redis.set(`reset:cooldown:${user.id}`, "1", "EX", 60, "NX");
    if (!allowed) return;

    const token = crypto.randomBytes(32).toString("hex");

    await redis.set(`reset:token:${sha256(token)}`, user.id, "EX", 3600);

    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendResetPasswordEmail({
        email: user.email,
        name: user.firstName,
        link,
    });
};

export const resetPasswordService = async ({ token, password }) => {
    const userId = await redis.getdel(`reset:token:${sha256(token)}`);
    if (!userId) {
        throw new AppError("Invalid or expired reset link", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    await deleteRefreshToken(userId);
};