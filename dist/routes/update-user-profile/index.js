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
exports.update_user_profile = void 0;
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = require("../../services/logs/logger");
const update_user_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, bio, social_links } = req.body;
    let bioLimit = 150;
    if (username.length < 3) {
        logger_1.logger.info("@@ Username must be at least 3 characters long");
        return res
            .status(400)
            .json({ error: "Username must be at least 3 characters long" });
    }
    if (bio.length > bioLimit) {
        return res
            .status(400)
            .json({ error: "Bio should be less than bioLimit characters long" });
    }
    let socialLinksArray = Object.keys(social_links);
    try {
        for (let i = 0; i < socialLinksArray.length; i++) {
            if (social_links[socialLinksArray[i]].length) {
                let hostname = new URL(social_links[socialLinksArray[i]]).hostname;
                if (!hostname.includes(`${socialLinksArray[i]}.com`) &&
                    socialLinksArray[i] != "website") {
                    return res.status(403).json({
                        error: `${socialLinksArray[i]} must be a valid ${socialLinksArray[i]}.com full link`,
                    });
                }
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`Error validating social links: ${error}`);
        res.status(500).json({
            error: `You must provide some social links with http(s) included`,
        });
    }
    let UpdateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links,
    };
    User_1.default.findOneAndUpdate({
        _id: req.user,
    }, UpdateObj, {
        runValidators: true,
    })
        .then(() => {
        logger_1.logger.info(`@@ User Profile updated successfully`);
        res.status(200).json({ username });
    })
        .catch((err) => {
        logger_1.logger.error(err.message);
        if (err.code === 11000) {
            return res.status(409).json({ error: "Username already taken" });
        }
        res.status(500).json({
            error: `Something went wrong when updating user profile : ${err.message}`,
        });
    });
});
exports.update_user_profile = update_user_profile;
