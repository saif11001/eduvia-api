import { body } from "express-validator";

const emailField = body("email")
    .trim()
    .isEmail().withMessage("Invalid email")
    .toLowerCase();

const newPasswordField = body("password")
    .isLength({ min: 8, max: 72 }).withMessage("Password must be 8 to 72 characters");

export const signupRules = [
    body("firstName")
        .trim()
        .notEmpty().withMessage("First name is required")
        .isLength({ max: 50 }).withMessage("First name is too long"),

    body("lastName")
        .trim()
        .notEmpty().withMessage("Last name is required")
        .isLength({ max: 50 }).withMessage("Last name is too long"),

    emailField,
    newPasswordField,

    body("role")
        .isIn(["STUDENT", "INSTRUCTOR"]).withMessage("Role must be STUDENT or INSTRUCTOR"),
];

export const verifyEmailRules = [
    emailField,
    body("code")
        .trim()
        .isLength({ min: 6, max: 6 }).withMessage("Code must be 6 digits")
        .isNumeric().withMessage("Code must be numbers only"),
];

export const emailOnlyRules = [emailField];

export const loginRules = [
    emailField,
    body("password")
        .isString().withMessage("Password is required")
        .notEmpty().withMessage("Password is required")
        .isLength({ max: 72 }).withMessage("Password is too long"),
];

export const resetPasswordRules = [
    body("token")
        .trim()
        .isHexadecimal().withMessage("Invalid token")
        .isLength({ min: 64, max: 64 }).withMessage("Invalid token"),
    newPasswordField,
];