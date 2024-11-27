"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_profile = void 0;
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = require("../../services/logs/logger");
const get_profile = (req, res) => {
    let { username } = req.body;
    // console.log("@@ username ==>", username);
    try {
        User_1.default.findOne({ "personal_info.username": username })
            .select("-personal_info.password -google_auth -updatedAt -events")
            .then((user) => {
            if (!user) {
                logger_1.logger.error("@@ User not found");
                return res.status(404).json({ error: "User not found" });
            }
            logger_1.logger.info("@@ User found successfully");
            return res.status(200).json(user);
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        return res
            .status(500)
            .json({ error: `Something went wrong when fetching user: ${error}` });
    }
};
exports.get_profile = get_profile;
