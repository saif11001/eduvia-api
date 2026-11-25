import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, { expiresIn: "1d" });

    return { accessToken, refreshToken };
}

export const generateAccessToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });

    return { accessToken };
}