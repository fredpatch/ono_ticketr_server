"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../services/logs/logger");
const formatDataToSend_1 = __importDefault(require("../utils/formatDataToSend"));
const validation_1 = require("../utils/validation");
const generateUsername_1 = __importDefault(require("../utils/generateUsername"));
/**
 * Handles the signup process for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the result of the signup process.
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullname } = req.body;
    try {
        logger_1.logger.info("@@ Start of data validation");
        // Validate inputs
        let errorMsg;
        errorMsg = (0, validation_1.validateFullname)(fullname);
        if (errorMsg) {
            logger_1.logger.error(errorMsg);
            return res.status(400).json({ error: errorMsg });
        }
        errorMsg = (0, validation_1.validateEmail)(email);
        if (errorMsg) {
            logger_1.logger.error(errorMsg);
            return res.status(400).json({ error: errorMsg });
        }
        errorMsg = (0, validation_1.validatePassword)(password);
        if (errorMsg) {
            logger_1.logger.error(errorMsg);
            return res.status(400).json({ error: errorMsg });
        }
        logger_1.logger.info("@@ End of data validation");
        // existing email
        const existingUser = yield User_1.default.findOne({ "personal_info.email": email });
        if (existingUser) {
            logger_1.logger.error("@@ Email already exists");
            return res.status(500).json({ error: "Email already exists" });
        }
        // Hash the password
        const hashed_password = yield new Promise((resolve, reject) => {
            bcryptjs_1.default.hash(password, 10, (err, hash) => {
                if (err) {
                    logger_1.logger.error("Error hashing password");
                    return reject(err); // Reject the promise if hashing fails
                }
                resolve(hash); // Resolve the promise with the hashed password
            });
        });
        const username = yield (0, generateUsername_1.default)({ email });
        logger_1.logger.info("@@ Start of user creation");
        let user = new User_1.default({
            personal_info: {
                username,
                fullname,
                email,
                password: hashed_password,
            },
        });
        yield user.save(); // Use await for user.save()
        logger_1.logger.info("@@ User created");
        return res.status(200).json((0, formatDataToSend_1.default)({ user })); // Send response here
    }
    catch (error) {
        logger_1.logger.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if the request body is missing
        if (!req.body) {
            return res.status(400).send("Request body is missing");
        }
        // logs
        logger_1.logger.info("@@ Start of data validation");
        // Find user by email
        const user = yield User_1.default.findOne({ "personal_info.email": email });
        if (!user) {
            logger_1.logger.error("@@ Email not found");
            return res.status(403).json({
                error: "Email not found",
            });
        }
        // Ensure personal_info exists
        const personalInfo = user.personal_info;
        if (!personalInfo || !personalInfo.password) {
            logger_1.logger.error("@@ Password not set for the user.");
            return res.status(403).json({
                error: "Password not set for the user.",
            });
        }
        // logs
        logger_1.logger.info("@@ End of data validation");
        // Check for Google authentication
        if (!user.google_auth) {
            // Compare passwords
            const result = yield bcryptjs_1.default.compare(password, personalInfo.password);
            if (!result) {
                logger_1.logger.error("@@ Invalid password please try again.");
                return res.status(403).json({
                    error: "Invalid password please try again.",
                });
            }
            else {
                logger_1.logger.info("@@ User logged in");
                return res.status(200).json((0, formatDataToSend_1.default)({ user }));
            }
        }
        else {
            logger_1.logger.info("@@ User can't logged in with email and password. Please try login with google account.");
            return res.status(403).json({
                error: "Account created with Google. Please try login with your google account.",
            });
        }
    }
    catch (err) {
        logger_1.logger.error("@@ Something went wrong: " + err);
        return res.status(500).json({
            error: `Something wrong when trying to signin: ${err.message}`,
        });
    }
});
exports.signin = signin;
