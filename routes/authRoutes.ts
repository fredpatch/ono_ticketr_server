import User from "../models/User";
import bcrypt from "bcryptjs";
import { logger } from "../services/logs/logger";
import formatDataToSend from "../utils/formatDataToSend";
import {
  validateEmail,
  validatePassword,
  validateFullname,
} from "../utils/validation";
import generateUsername from "../utils/generateUsername";

interface RequestProps {
  req: any;
  res: any;
}

/**
 * Handles the signup process for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the result of the signup process.
 */

const signup = async (req: any, res: any) => {
  const { email, password, fullname } = req.body;

  try {
    logger.info("@@ Start of data validation");

    // Validate inputs
    let errorMsg;

    errorMsg = validateFullname(fullname);
    if (errorMsg) {
      logger.error(errorMsg);
      return res.status(400).json({ error: errorMsg });
    }

    errorMsg = validateEmail(email);
    if (errorMsg) {
      logger.error(errorMsg);
      return res.status(400).json({ error: errorMsg });
    }

    errorMsg = validatePassword(password);
    if (errorMsg) {
      logger.error(errorMsg);
      return res.status(400).json({ error: errorMsg });
    }

    logger.info("@@ End of data validation");

    // existing email
    const existingUser = await User.findOne({ "personal_info.email": email });

    if (existingUser) {
      logger.error("@@ Email already exists");
      return res.status(500).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashed_password = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          logger.error("Error hashing password");
          return reject(err); // Reject the promise if hashing fails
        }
        resolve(hash); // Resolve the promise with the hashed password
      });
    });

    const username = await generateUsername({ email });

    logger.info("@@ Start of user creation");

    let user = new User({
      personal_info: {
        username,
        fullname,
        email,
        password: hashed_password,
      },
    });

    await user.save(); // Use await for user.save()

    logger.info("@@ User created");
    return res.status(200).json(formatDataToSend({ user })); // Send response here
  } catch (error: any) {
    logger.error(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const signin = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    // Check if the request body is missing
    if (!req.body) {
      return res.status(400).send("Request body is missing");
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
        error: "Password not set for the user.",
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
          error: "Invalid password please try again.",
        });
      } else {
        logger.info("@@ User logged in");
        return res.status(200).json(formatDataToSend({ user }));
      }
    } else {
      logger.info(
        "@@ User can't logged in with email and password. Please try login with google account."
      );
      return res.status(403).json({
        error:
          "Account created with Google. Please try login with your google account.",
      });
    }
  } catch (err: any) {
    logger.error("@@ Something went wrong: " + err);
    return res.status(500).json({
      error: `Something wrong when trying to signin: ${err.message}`,
    });
  }
};

export { signup, signin };
