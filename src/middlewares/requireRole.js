import AppError from "../lib/AppError.js";

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError("You are not authorized to perform this action", 403);
        }

        next();
    };
};
