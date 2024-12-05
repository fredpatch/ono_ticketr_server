import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// generate access token
const generateAccessToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const access_token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15s",
  });

  return access_token;
};

const generateRefreshToken = (user) => {
  const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!refreshSecret) {
    throw new Error("REFRESH_SECRET is not defined in environment variables.");
  }

  const refresh_token = jwt.sign({ id: user._id }, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });

  return refresh_token;
};

const formatDataToSend = (user) => {
  return {
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    role: user.role,
  };
};

export { generateAccessToken, generateRefreshToken, formatDataToSend };
