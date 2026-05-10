import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getProfile, updateProfile, changePassword } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/update", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;