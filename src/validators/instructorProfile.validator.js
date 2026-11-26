import { body } from "express-validator";

const urlField = (name) =>
    body(name)
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage(`${name} is too long`)
        .isURL({ protocols: ["http", "https"], require_protocol: true })
        .withMessage(`${name} must be a valid URL starting with http:// or https://`);

export const updateInstructorProfileRules = [
    body("headline")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Headline is too long (max 100)"),

    body("about")
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage("About is too long (max 2000)"),

    body("expertise")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Expertise is too long (max 200)"),

    urlField("website"),
    urlField("linkedin"),
    urlField("twitter"),
    urlField("youtube"),
];