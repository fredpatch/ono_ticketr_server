import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret)
    throw new Error("JWT_SECRET is not defined in environment variables.");
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "15m",
  }); // Shorter lifespan
};

export const generateRefreshToken = (user) => {
  const jwtRefreshSecret = process.env.JWT_SECRET;
  if (!jwtRefreshSecret)
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables."
    );
  return jwt.sign({ id: user._id }, jwtRefreshSecret, {
    expiresIn: "7d",
  }); // Longer lifespan
};

export const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return false;
  }
};
