import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import redis from "../lib/redis.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../lib/emails.js";
import { sanitizeUser } from "../lib/sanitizeUser.js";
import AppError from "../lib/AppError.js";

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

    return sanitizeUser(verifiedUser);
};