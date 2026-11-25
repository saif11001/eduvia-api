import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { getProfile } from "../../controllers/student/profile.controller.js";
import { updateProfileRules } from "../../validators/profile.validator.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateProfile } from "../../controllers/student/profile.controller.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);

router.patch("/", verifyToken, updateProfileRules, validate, updateProfile);

export default router;