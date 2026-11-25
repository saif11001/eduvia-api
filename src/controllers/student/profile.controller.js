import { getProfileService } from "../../services/student/profile.service.js";

export const getProfile = async (req, res, next) => {
    const user = await getProfileService(req.user.id);
    res.status(200).json({ success: true, user });
}