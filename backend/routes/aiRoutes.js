import express from "express";
import {
  generateStudyPlan,
  getStudyPlan,
  updateTaskStatus,
  getStudyProgress,
  getStudyStreak,
  getMissedTasks,
  rescheduleMissedTasks,
  adaptiveStudyPlanner,
  studyAssistant,
  getStudyAnalytics,
  deleteStudyPlan
} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below are protected
router.post("/generate", protect, generateStudyPlan);
router.get("/plan/:userId", protect, getStudyPlan);
router.put("/task/update", protect, updateTaskStatus);
router.get("/progress/:userId", protect, getStudyProgress);
router.get("/streak/:userId", protect, getStudyStreak);
router.get("/missed/:userId", protect, getMissedTasks);
router.post("/reschedule/:userId", protect, rescheduleMissedTasks);
router.post("/adaptive/:userId", protect, adaptiveStudyPlanner);
router.post("/assistant", protect, studyAssistant);
router.get("/analytics/:userId", protect, getStudyAnalytics);
router.delete("/plan/:userId", protect, deleteStudyPlan);

export default router;