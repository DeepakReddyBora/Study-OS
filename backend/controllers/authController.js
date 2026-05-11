import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import otpGenerator from "otp-generator";
import { SendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK IF USER EXISTS
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
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

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};

export const login = async (req,res)=>{
  try{

    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const token = jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );

    res.json({
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email
      }
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};