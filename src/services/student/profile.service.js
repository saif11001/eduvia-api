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

export const updateProfileServce = async (userId, { firstName, lastName, avatar }) => {
    let avatarUrl;

    if (avatar) {
        const result = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            public_id: `user_${userId}`,
            overwrite: true,
            transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
        });
        avatarUrl = result.secure_url;
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, avatar: avatarUrl },
    });

    return sanitizeUser(user);
}