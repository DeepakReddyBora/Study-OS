import express from "express";

import {
  getAnalytics,
  getProgress,
  getStreak,
  getMissedTasks,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get(
  "/analytics/:userId",
  getAnalytics
);

router.get(
  "/progress/:userId",
  getProgress
);

router.get(
  "/streak/:userId",
  getStreak
);

router.get(
  "/missed/:userId",
  getMissedTasks
);

export default router;