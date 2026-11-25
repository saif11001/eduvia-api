import { body } from "express-validator";

export const updateProfileRules = [
    body("firstName")
        .optional()
        .trim()
        .notEmpty().withMessage("First name cannot be empty")
        .isLength({ max: 50 }).withMessage("First name is too long"),

    body("lastName")
        .optional()
        .trim()
        .notEmpty().withMessage("Last name cannot be empty")
        .isLength({ max: 50 }).withMessage("Last name is too long"),

    body("avatar")
        .optional()
        .isString().withMessage("Avatar must be a string")
        .isLength({ max: 2_800_000 }).withMessage("Avatar is too large (max 2MB)")
        .matches(/^data:image\/(jpeg|png|webp);base64,/).withMessage("Avatar must be a JPG, PNG or WEBP image"),
];