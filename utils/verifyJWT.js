import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// middleware to verify token
const verifyJWT = async (req, res, next) => {
  // const authHeader = req.headers["Authorization"];
  const authHeader = req.headers.Authorization || req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader && authHeader.split(" ")[1];
  }
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables!!");
  }

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decode = jwt.verify(token, jwtSecret);

    req.user = decode;
    req.role = decode.role;
    req.body.author = decode.id; // Add this line

    // console.log("@@@ (verifyJWT) The decoded user is =>", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default verifyJWT;
