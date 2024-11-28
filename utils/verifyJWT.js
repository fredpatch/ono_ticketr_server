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
      message: "No token provided, unauthorized access",
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
    return res.status(403).json({
      message: "Invalid Token Provided",
      error: error,
    });
  }
};

export default verifyJWT;

// jwt.verify(token, jwtSecret, (err, user) => {
//   if (err) {
//     return res.status(403).json({
//       error: "Invalid access token",
//     });
//   }

//   req.user = user.id;
//   req.role = user.role;
//   req.body.author = user.id; // Add this line
//   next();
// });
