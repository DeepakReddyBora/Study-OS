import bcrypt from "bcryptjs";

const OTP_EXPIRY = 5 * 60 * 1000;
const OTP_COOLDOWN = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

import User from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";


// ================= REGISTER =================
export const register = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // CHECK USER EXISTS
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // GENERATE OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const hashedOtp = await bcrypt.hash(otp, 10);

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      otp: hashedOtp,
      otpExpires: Date.now() + OTP_EXPIRY,
      otpAttempts: 0,
      lastOtpSentAt: Date.now(),
      isVerified: false,
    });

    // SEND OTP EMAIL
    await sendEmail(email, otp);

    // RESPONSE
    res.status(201).json({
      message: "OTP sent to email",
      email: user.email,
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK LOCK
    if (
      user.otpLockedUntil &&
      user.otpLockedUntil > Date.now()
    ) {
      return res.status(403).json({
        message:
          "Too many failed attempts. Try again after 15 minutes.",
      });
    }

    // CHECK EXPIRY
    if (
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // COMPARE HASHED OTP
    const isOtpValid = await bcrypt.compare(
      otp,
      user.otp
    );

    if (!isOtpValid) {
      user.otpAttempts += 1;

      if (
        user.otpAttempts >= MAX_OTP_ATTEMPTS
      ) {
        user.otpLockedUntil =
          Date.now() + LOCK_TIME;

        user.otp = null;
        user.otpExpires = null;
      }

      await user.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;

    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    user.otpLockedUntil = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message:
        "OTP verified successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(
      "VERIFY OTP ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK EMAIL VERIFIED
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // RESPONSE
    res.status(200).json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });

  }
};


// ================= RESEND OTP =================
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    // Prevent account enumeration
    if (!user) {
      return res.status(200).json({
        message:
          "If the account exists, OTP has been sent.",
      });
    }

    // Cooldown check
    if (
      user.lastOtpSentAt &&
      Date.now() -
        user.lastOtpSentAt <
        OTP_COOLDOWN
    ) {
      return res.status(429).json({
        message:
          "Please wait 60 seconds before requesting another OTP.",
      });
    }

    const otp =
      otpGenerator.generate(6, {
        upperCaseAlphabets:
          false,
        lowerCaseAlphabets:
          false,
        specialChars: false,
      });

    const hashedOtp =
      await bcrypt.hash(
        otp,
        10
      );

    user.otp = hashedOtp;

    user.otpExpires =
      Date.now() +
      OTP_EXPIRY;

    user.otpAttempts = 0;

    user.otpLockedUntil =
      null;

    user.lastOtpSentAt =
      Date.now();

    await user.save();

    await sendEmail(
      email,
      otp
    );

    return res.status(200).json({
      message:
        "OTP resent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const user =
      await User.findOne({
        email,
      });

    // Prevent enumeration
    if (!user) {
      return res.status(200).json({
        message:
          "If the account exists, reset OTP has been sent.",
      });
    }

    const otp =
      otpGenerator.generate(6, {
        upperCaseAlphabets:
          false,
        lowerCaseAlphabets:
          false,
        specialChars: false,
      });

    const hashedOtp =
      await bcrypt.hash(
        otp,
        10
      );

    user.resetOTP =
      hashedOtp;

    user.resetOTPExpires =
      Date.now() +
      OTP_EXPIRY;

    user.resetOtpAttempts = 0;

    user.resetOtpLockedUntil =
      null;

    await user.save();

    await sendEmail(
      email,
      otp
    );

    return res.status(200).json({
      message:
        "Reset OTP sent to email",
    });

  } catch (error) {
    console.log(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    if (
      user.resetOtpLockedUntil &&
      user.resetOtpLockedUntil >
        Date.now()
    ) {
      return res.status(403).json({
        message:
          "Too many attempts. Try again later.",
      });
    }

    if (
      !user.resetOTPExpires ||
      user.resetOTPExpires <
        Date.now()
    ) {
      return res.status(400).json({
        message:
          "OTP expired",
      });
    }

    const isOtpValid =
      await bcrypt.compare(
        otp,
        user.resetOTP
      );

    if (!isOtpValid) {
      user.resetOtpAttempts += 1;

      if (
        user.resetOtpAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        user.resetOtpLockedUntil =
          Date.now() +
          LOCK_TIME;

        user.resetOTP = null;
        user.resetOTPExpires =
          null;
      }

      await user.save();

      return res.status(400).json({
        message:
          "Invalid OTP",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    user.isVerified =
      true;

    user.resetOTP = null;
    user.resetOTPExpires =
      null;

    user.resetOtpAttempts = 0;
    user.resetOtpLockedUntil =
      null;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successful",
    });

  } catch (error) {
    console.log(
      "RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};