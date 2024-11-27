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
const logger_1 = require("../../services/logs/logger");
const User_1 = __importDefault(require("../../models/User"));
const search_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { query } = req.body;
    console.log("query", query);
    User_1.default.find({
        "personal_info.username": new RegExp(query, "i"),
    })
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .then((user) => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        logger_1.logger.info("@@ User found successfully");
        return res.status(200).json({ user });
    })
        .catch((error) => {
        logger_1.logger.error(error);
        return res
            .status(500)
            .json({ error: `Something went wrong when fetching user: ${error}` });
    });
});
exports.default = search_users;
