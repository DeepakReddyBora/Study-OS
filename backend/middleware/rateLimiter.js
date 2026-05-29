import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  message: {
    message:
      "Too many OTP requests. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const verifyOtpLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,

    message: {
      message:
        "Too many verification attempts.",
    },
  });