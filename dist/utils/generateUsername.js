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
const User_1 = __importDefault(require("../models/User"));
// generate username
const generateUsername = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
    let username = email.split("@")[0];
    // Check if the username already exists
    let isUsernameNotUnique = yield User_1.default.exists({
        "personal_info.username": username,
    });
    // Append a unique timestamp suffix if the username exists
    if (isUsernameNotUnique) {
        username += `_${Date.now().toString().slice(-5)}`;
    }
    return username;
});
exports.default = generateUsername;
