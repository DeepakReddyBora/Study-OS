import aiRoutes from "./routes/aiRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

await connectDB();

app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);

export default app;