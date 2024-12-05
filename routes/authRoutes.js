import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { logger } from "../services/logs/logger.js";
import formatDataToSend from "../utils/formatDataToSend.js";
import {
  validateEmail,
  validatePassword,
  validateFullname,
} from "../utils/validation.js";
import generateUsername from "../utils/generateUsername.js";
import jwt from "jsonwebtoken";
import { ConflictError } from "./../utils/errorClass.js";
// import { formatDataToSend } from "../utils/dataFormat.js";
import sendErrorResponse from "../middlewares/sendErrorResponse.js";
import { revokeToken } from "../utils/revokedTokens.js";

/**
 * Handles the signup process for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the result of the signup process.
 */

const signup = async (req, res, next) => {
  const { email, password, fullname, role } = req.body;

  try {
    if (!email || !password || !fullname) {
      return res.status(422).json({
        message: "Please fill in all fields (fullname, email and password)",
      });
    }
    logger.info("@@ Start of data validation...");

    // Validate inputs
    validateFullname(fullname, res, next);
    logger.info("@@ Fullname validated...");
    validateEmail(email, res, next);
    logger.info("@@ Email validated...");
    validatePassword(password, res, next);
    logger.info("@@ Password validated...");

    logger.info("@@ End of data validation...");

    // existing email
    const existingUser = await User.findOne({ "personal_info.email": email });

    if (existingUser) {
      logger.error("@@ Email already exists", existingUser);
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    logger.info("Hashing password...");
    // Hash the password
    const hashed_password = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 12, (err, hash) => {
        if (err) {
          logger.error("Error hashing password");
          return reject(err); // Reject the promise if hashing fails
        }
        logger.info("Password hashed...");
        resolve(hash); // Resolve the promise with the hashed password
      });
    });

    logger.info("Generating username...");
    const username = await generateUsername(email);
    logger.info("Username generated...");

    logger.info("@@ Start of user creation");

    let user = new User({
      role: role ?? "user",
      personal_info: {
        username,
        fullname,
        email,
        password: hashed_password,
      },
    });

    await user.save(); // Use await for user.save()
    logger.info("@@ User created...");

    return res.status(201).json(formatDataToSend(user)); // Send response here
  } catch (error) {
    logger.error("error", error);
    next(error);
  }
};

/**
 * Handles the signin process for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {Object} - The response object containing the result of the signin process.
 */
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if the request body is missing
    if (!email || !password) {
      return res.status(422).json({
        message: "Please fill in all fields (email and password)",
      });
    }

    // logs
    logger.info("@@ Start of data validation");
    // Find user by email
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      logger.error("@@ Email not found");
      return res.status(403).json({
        error: "Email not found",
      });
    }

    // Ensure personal_info exists
    const personalInfo = user.personal_info;
    if (!personalInfo || !personalInfo.password) {
      logger.error("@@ Password not set for the user.");
      return sendErrorResponse(
        res,
        403,
        "Password not set for the user.",
        "FORBIDDEN_ERROR"
      );
    }

    // logs
    logger.info("@@ End of data validation");
    // Check for Google authentication
    if (!user.google_auth) {
      // Compare passwords
      const result = await bcrypt.compare(password, personalInfo.password);

      if (!result) {
        logger.error("@@ Invalid password please try again.");
        return sendErrorResponse(
          res,
          401,
          "Email or password is incorrect.",
          "FORBIDDEN_ERROR"
        );
      } else {
        logger.info("@@ User logged in");

        return res.status(200).json(formatDataToSend(user, res));
      }
    } else {
      logger.info(
        "@@ User can't logged in with email and password. Please try login with google account."
      );
      return sendErrorResponse(
        res,
        403,
        "User can't logged in with email and password. Please try login with google account.",
        "FORBIDDEN_ERROR"
      );
    }
  } catch (err) {
    // logger.error("@@ Something went wrong: " + err);
    next(err);
  }
};

/**
 * Handles the request to retrieve the current user's information.
 *
 * @param {Object} req - The request object containing headers and other data.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Object} - Returns a JSON response with user data or an error message.
 */
const me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // console.log("@@@ ME req.headers.authorization", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(" ")[1];
    // console.log("@@@ ME token", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`@@@ ME decoded: `, decoded);

    // Find the user in the database
    const user = await User.findOne({ _id: decoded.id }); // Avoid exposing sensitive data

    if (!user) {
      console.error("@@@@ User not found @@@@@");
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data back to the client
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ message: "Invalid or Expired token" });
  }
};

/**
 * Handles user logout by revoking the refresh token and clearing the cookie.
 *
 * @param {Object} req - The request object containing cookies.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
 */
const logout = async (req, res) => {
  try {
    // Access the refresh token from cookies
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    await revokeToken(refreshToken);

    // Clear the refresh token cookie
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure flag in production
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const globalLogout = async (req, res) => {
  try {
    const userId = req.user._id; // Assume `req.user` is populated by middleware
    await Token.updateMany(
      { userId, revoked: false },
      { revoked: true, revokedAt: new Date() }
    );

    return res.status(200).json({ message: "Logged out from all sessions" });
  } catch (error) {
    console.error("Global logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, signin, me, logout };
