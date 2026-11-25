import { sendEmail } from "./mail.js";
import { verifyEmailTemplate, welcomeEmailTemplate, resetPasswordTemplate } from "./emailTemplates.js";

export const sendVerificationEmail = async ({ email, name, code }) => {
    const html = verifyEmailTemplate(name, code);
    await sendEmail({ to: email, subject: "Verify your Eduvia account", html });
};

export const sendWelcomeEmail = async ({ email, name }) => {
    const html = welcomeEmailTemplate(name);
    await sendEmail({ to: email, subject: "Welcome to Eduvia", html });
};

export const sendResetPasswordEmail = async ({ email, name, link }) => {
    const html = resetPasswordTemplate(name, link);
    await sendEmail({ to: email, subject: "Reset your Eduvia password", html });
};