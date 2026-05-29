import express from "express";

import {
  register,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { otpLimiter, verifyOtpLimiter, loginLimiter, registerLimiter} from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/register",
  otpLimiter,
  register
);

router.post(
  "/verify-otp",
  verifyOtpLimiter,
  verifyOTP
);

router.post(
  "/resend-otp",
  otpLimiter,
  resendOTP
);

router.post(
  "/forgot-password",
  otpLimiter,
  forgotPassword
);

router.post(
  "/reset-password",
  verifyOtpLimiter,
  resetPassword
);

router.post("/login", loginLimiter, login);

export default router;