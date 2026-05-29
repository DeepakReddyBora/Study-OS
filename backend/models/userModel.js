import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // EMAIL VERIFICATION OTP
    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    lastOtpSentAt: {
      type: Date,
    },

    otpLockedUntil: {
      type: Date,
    },

    // USER STATUS
    isVerified: {
      type: Boolean,
      default: false,
    },

    // PASSWORD RESET OTP
    resetOTP: {
      type: String,
    },

    resetOTPExpires: {
      type: Date,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
    },

    resetOtpLockedUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);