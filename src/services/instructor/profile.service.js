import prisma from "../../config/prisma.js";
import AppError from "../../lib/AppError.js";

const userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    avatar: true,
    role: true,
    createdAt: true,
};

export const getInstructorProfileService = async (userId) => {
    const profile = await prisma.instructorProfile.findUnique({
        where: { userId },
        include: { user: { select: userSelect } },
    });
    if (!profile) {
        throw new AppError("Instructor profile not found", 404);
    }
    return profile;
};

export const updateInstructorProfileService = async (
    userId,
    { headline, about, expertise, website, linkedin, twitter, youtube }
) => {
    const data = { headline, about, expertise, website, linkedin, twitter, youtube };

    return prisma.instructorProfile.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data },
        include: { user: { select: userSelect } },
    });
};