"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = require("../routes/authRoutes");
const router = express_1.default.Router();
// @route   POST /api/v1/auth/signup
// @desc    Register a new user
// @access  Private
router.post("/signup", authRoutes_1.signup);
// @route   POST /api/v1/auth/signin
// @desc    Register a new user
// @access  Private
router.post("/signin", authRoutes_1.signin);
// @route   POST /api/v1/auth/google-auth
// @desc    Register a new user
// @access  Private
// router.post("/google-auth", googleAuth);
exports.default = router;
