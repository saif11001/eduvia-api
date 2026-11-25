import { sendEmail } from "./mail.js";
import { verifyEmailTemplate, welcomeEmailTemplate } from "./emailTemplates.js";

export const sendVerificationEmail = async ({ email, name, code }) => {
    const html = verifyEmailTemplate(name, code);
    await sendEmail({ to: email, subject: "Verify your Eduvia account", html });
};

export const sendWelcomeEmail = async ({ email, name }) => {
    const html = welcomeEmailTemplate(name);
    await sendEmail({ to: email, subject: "Welcome to Eduvia", html });
};