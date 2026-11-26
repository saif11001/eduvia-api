import { getInstructorProfileService, updateInstructorProfileService } from "../../services/instructor/profile.service.js";

export const getInstructorProfile = async (req, res, next) => {
    const profile = await getInstructorProfileService(req.user.id);
    res.status(200).json({ success: true, profile });
}

export const updateInstructorProfile = async (req, res, next) => {
    const profile = await updateInstructorProfileService(req.user.id, req.body);
    res.status(200).json({ success: true, profile });
}