import express from "express";
import { signin, signup } from "../routes/authRoutes.ts";

const router = express.Router();

// @route   POST /api/v1/auth/signup
// @desc    Register a new user
// @access  Private
router.post("/signup", signup);

// @route   POST /api/v1/auth/signin
// @desc    Register a new user
// @access  Private
router.post("/signin", signin);

// @route   POST /api/v1/auth/google-auth
// @desc    Register a new user
// @access  Private
// router.post("/google-auth", googleAuth);

export default router;
