import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { getInstructorProfile, updateInstructorProfile } from "../../controllers/instructor/profile.controller.js";
import { updateInstructorProfileRules } from "../../validators/instructorProfile.validator.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", verifyToken, requireRole("INSTRUCTOR"), getInstructorProfile);

router.patch("/",
    verifyToken,
    requireRole("INSTRUCTOR"),
    updateInstructorProfileRules,
    validate,
    updateInstructorProfile
);

export default router;