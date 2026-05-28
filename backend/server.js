import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        isConnected = db.connections[0].readyState;

        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

// Connect DB before handling routes
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;