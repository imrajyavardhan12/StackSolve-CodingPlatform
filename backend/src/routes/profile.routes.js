import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  getProfileDashboard,
  getUserStreak,
  getUserStatistics,
  getCalendarData,
  getRecentActivity,
  recalculateStatistics,
  initializeProfile
} from "../controller/profile.controller.js";

const profileRoutes = express.Router();

profileRoutes.get("/dashboard", authMiddleware, getProfileDashboard);
profileRoutes.get("/streak", authMiddleware, getUserStreak);
profileRoutes.get("/stats", authMiddleware, getUserStatistics);
profileRoutes.get("/calendar/:year", authMiddleware, getCalendarData);
profileRoutes.get("/calendar", authMiddleware, (req, res, next) => {
  req.params.year = new Date().getFullYear().toString();
  next();
}, getCalendarData);
profileRoutes.get("/activity", authMiddleware, getRecentActivity);
profileRoutes.post("/recalculate-stats", authMiddleware, recalculateStatistics);
profileRoutes.post("/initialize", authMiddleware, initializeProfile);

export default profileRoutes;
