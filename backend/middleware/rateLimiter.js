import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  message: {
    message:
      "Too many registration attempts. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  message: {
    message:
      "Too many OTP requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  message: {
    message:
      "Too many verification attempts. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  message: {
    message:
      "Too many login attempts. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});