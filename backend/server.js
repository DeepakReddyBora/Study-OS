import aiRoutes from "./routes/aiRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js"; 
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/ai",aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

