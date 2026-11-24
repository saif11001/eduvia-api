import { body } from "express-validator";

export const signupRules = [
    body("firstName")
        .trim()
        .notEmpty().withMessage("First name is required")
        .isLength({ max: 50 }).withMessage("First name is too long"),

    body("lastName")
        .trim()
        .notEmpty().withMessage("Last name is required")
        .isLength({ max: 50 }).withMessage("Last name is too long"),

    body("email")
        .trim()
        .isEmail().withMessage("Invalid email")
        .toLowerCase(),

    body("password")
        .isLength({ min: 8, max: 72 }).withMessage("Password must be 8 to 72 characters"),

    body("role")
        .isIn(["STUDENT", "INSTRUCTOR"]).withMessage("Role must be STUDENT or INSTRUCTOR"),
];