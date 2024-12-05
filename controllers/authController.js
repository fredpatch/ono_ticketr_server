import express from "express";
import { signin, signup, me, logout } from "../routes/authRoutes.js";
import { refresh_token } from "../routes/refresh-token/index.js";
import verifyJWT from "../utils/verifyJWT.js";
import { globalLogout } from "../routes/authRoutes.js";

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

router.get("/refresh-token", refresh_token);

router.post("/logout", logout);

router.get("/global-logout", verifyJWT, globalLogout);

router.get("/me", me);

export default router;
