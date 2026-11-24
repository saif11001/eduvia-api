import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import redis from "../lib/redis.js";
import { sendEmail } from "../lib/mail.js";
import { sanitizeUser } from "../lib/sanitizeUser.js";
import AppError from "../lib/AppError.js";

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

    return sanitizeUser(user);
}
