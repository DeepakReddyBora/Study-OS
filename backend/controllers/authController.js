import bcrypt from "bcryptjs";
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

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,

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

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // CHECK OTP EXPIRY
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // VERIFY USER
    user.isVerified = true;

    // CLEAR OTP
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    // GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // RESPONSE
    res.status(200).json({
      message: "OTP verified successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
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

export const resendOTP = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, otp);

    res.status(200).json({
      message: "OTP resent successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};