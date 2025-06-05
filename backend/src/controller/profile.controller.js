import { 
  updateUserStreak,
  recordDailyActivity,
  updateUserStatistics,
  getProfileDashboardData,
  getStreakCalendarData,
  getDailyActivitySummary,
  initializeUserProfile
} from "../services/profile.service.js";

export const getProfileDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardData = await getProfileDashboardData(userId);
    res.status(200).json({
      success: true,
      message: "Profile dashboard data fetched successfully",
      data: dashboardData
    });
  } catch (error) {
    console.error("Error fetching profile dashboard:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile dashboard data"
    });
  }
};

export const getUserStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardData = await getProfileDashboardData(userId);
    res.status(200).json({
      success: true,
      message: "Streak data fetched successfully",
      streak: dashboardData.streak
    });
  } catch (error) {
    console.error("Error fetching streak data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch streak data"
    });
  }
};

export const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboardData = await getProfileDashboardData(userId);
    res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      statistics: dashboardData.statistics,
      progress: dashboardData.progress
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics"
    });
  }
};

export const getCalendarData = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.params.year) || new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    if (year < 2020 || year > currentYear + 1) {
      return res.status(400).json({
        success: false,
        error: "Invalid year. Year must be between 2020 and current year."
      });
    }
    const calendarData = await getStreakCalendarData(userId, year);
    res.status(200).json({
      success: true,
      message: "Calendar data fetched successfully",
      year: year,
      data: calendarData
    });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch calendar data"
    });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 30;
    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        error: "Days parameter must be between 1 and 365"
      });
    }
    const recentActivity = await getDailyActivitySummary(userId, days);
    res.status(200).json({
      success: true,
      message: "Recent activity fetched successfully",
      days: days,
      activities: recentActivity.map(activity => ({
        date: activity.date.toISOString().split('T')[0],
        problemsSolved: activity.problemsSolved,
        submissions: activity.submissionCount
      }))
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recent activity"
    });
  }
};

export const recalculateStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedStats = await updateUserStatistics(userId);
    res.status(200).json({
      success: true,
      message: "Statistics recalculated successfully",
      statistics: updatedStats
    });
  } catch (error) {
    console.error("Error recalculating statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to recalculate statistics"
    });
  }
};

export const initializeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = await initializeUserProfile(userId);
    res.status(201).json({
      success: true,
      message: "Profile initialized successfully",
      profile: profileData
    });
  } catch (error) {
    console.error("Error initializing profile:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: "Profile already exists for this user"
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to initialize profile"
    });
  }
};

export const handleProblemSolved = async (userId) => {
  try {
    await recordDailyActivity(userId, true, false);
    await updateUserStreak(userId);
    await updateUserStatistics(userId);
    return { success: true };
  } catch (error) {
    console.error("Error handling problem solved:", error);
    return { success: false, error: error.message };
  }
};

export const handleSubmissionMade = async (userId) => {
  try {
    await recordDailyActivity(userId, false, true);
    await updateUserStatistics(userId);
    return { success: true };
  } catch (error) {
    console.error("Error handling submission made:", error);
    return { success: false, error: error.message };
  }
};
