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
exports.change_password = void 0;
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = require("../../services/logs/logger");
const utils_1 = require("../../utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import crypto from "crypto";
const change_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user;
    let { currentPassword, newPassword } = req.body;
    if (!utils_1.password_validation.test(currentPassword) ||
        !utils_1.password_validation.test(newPassword)) {
        return res.status(400).json({
            error: "Password should be between 6 to 20 characters and should contain at least 1 uppercase letter, 1 lowercase letter and 1 digit",
        });
    }
    User_1.default.findOne({ _id: user_id })
        .then((user) => {
        var _a;
        if (user === null || user === void 0 ? void 0 : user.google_auth) {
            return res
                .status(400)
                .json({ error: "Google user cannot change password" });
        }
        const storedPassword = (_a = user === null || user === void 0 ? void 0 : user.personal_info) === null || _a === void 0 ? void 0 : _a.password;
        if (!storedPassword) {
            return res.status(500).json({ error: "Password not found" });
        }
        bcryptjs_1.default.compare(currentPassword, storedPassword, (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: "Something went wrong while changing password please try again later",
                });
            }
            if (!result) {
                return res.status(403).json({
                    error: "Current password is incorrect",
                });
            }
            if (currentPassword == newPassword) {
                return res.status(403).json({
                    error: "New password can't be same as current password",
                });
            }
            bcryptjs_1.default.hash(newPassword, 10, (err, hashed_password) => {
                if (err) {
                    return res.status(500).json({
                        error: "Something went wrong while changing password please try again later",
                    });
                }
                User_1.default.findOneAndUpdate({
                    _id: user_id,
                }, {
                    "personal_info.password": hashed_password,
                })
                    .then((u) => {
                    return res.status(200).json({
                        message: "Password changed successfully",
                        user: u,
                    });
                })
                    .catch((err) => res.status(500).json({
                    error: `Error happened while changing password ${err.message}`,
                }));
            });
        });
    })
        .catch((error) => {
        logger_1.logger.info("Error user not found !");
        return res.status(500).json({
            error: `User not found ${error.message}`,
        });
    });
});
exports.change_password = change_password;
