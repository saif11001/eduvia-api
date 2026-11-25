import prisma from "../../config/prisma.js"
import AppError from "../../lib/AppError.js";
import { sanitizeUser } from "../../lib/sanitizeUser.js";

export const getProfileService = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return sanitizeUser(user);
}