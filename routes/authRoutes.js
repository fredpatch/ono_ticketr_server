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

/**
 * Handles the signup process for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the result of the signup process.
 */

const signup = async (req, res, next) => {
  const { email, password, fullname, role } = req.body;

  // console.log(req.body);

  try {
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
      return res.status(500).json({ message: "Email already exists" });
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
      role,
      personal_info: {
        username,
        fullname,
        email,
        password: hashed_password,
      },
    });

    await user.save(); // Use await for user.save()
    logger.info("@@ User created...");

    return res.status(200).json(formatDataToSend(user)); // Send response here
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the request body is missing
    if (!req.body) {
      return res.status(400).send({ message: "Request body is missing" });
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
      return res.status(403).json({
        message: "Password not set for the user.",
      });
    }

    // logs
    logger.info("@@ End of data validation");
    // Check for Google authentication
    if (!user.google_auth) {
      // Compare passwords
      const result = await bcrypt.compare(password, personalInfo.password);

      if (!result) {
        logger.error("@@ Invalid password please try again.");
        return res.status(403).json({
          message: "Invalid password please try again.",
        });
      } else {
        logger.info("@@ User logged in");
        return res.status(200).json(formatDataToSend(user));
      }
    } else {
      logger.info(
        "@@ User can't logged in with email and password. Please try login with google account."
      );
      return res.status(403).json({
        message:
          "Account created with Google. Please try login with your google account.",
      });
    }
  } catch (err) {
    logger.error("@@ Something went wrong: " + err);
    return res.status(500).json({
      message: `Something wrong when trying to signin: ${err.message}`,
    });
  }
};

export { signup, signin };
