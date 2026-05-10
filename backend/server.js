import aiRoutes from "./routes/aiRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js"; 
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection
// Note: In serverless, it's often better to check if mongoose is already connected
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log("MongoDB connection error:", err));
}

// Port Handling: Only run app.listen if NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// CRITICAL FOR VERCEL: Export the app instance
export default app;