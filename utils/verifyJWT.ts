import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestProps } from "../types/index";

dotenv.config();

// middleware to verify token
const verifyJWT = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables!!");
  }

  if (token == null) {
    return res.status(401).json({
      error: "No access token provided",
    });
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid access token",
      });
    }

    req.user = user.id;
    req.admin = user.admin;
    req.body.author = user.id; // Add this line
    next();
  });
};

export default verifyJWT;
