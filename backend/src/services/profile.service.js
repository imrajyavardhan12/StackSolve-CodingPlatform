import { db } from "../libs/db.js";

export const updateUserStreak = async (userId, activityDate = new Date()) => {
  try {
    const today = new Date(activityDate);
    const istDate = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const dateOnly = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());
    
    let streakRecord = await db.userStreak.findUnique({
      where: { userId }
    });

    if (!streakRecord) {
      streakRecord = await db.userStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: new Date(dateOnly),
          streakStartDate: new Date(dateOnly)
        }
      });
      return streakRecord;
    }

    const lastActivityDateStr = streakRecord.lastActivityDate 
      ? streakRecord.lastActivityDate.toISOString().split('T')[0] 
      : null;

    if (lastActivityDateStr === dateOnly) {
      return streakRecord;
    }

    const lastDate = new Date(lastActivityDateStr);
    const currentDate = new Date(dateOnly);
    const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

    let newCurrentStreak;
    let newStreakStartDate = streakRecord.streakStartDate;

    if (daysDiff === 1) {
      newCurrentStreak = streakRecord.currentStreak + 1;
    } else if (daysDiff > 1) {
      newCurrentStreak = 1;
      newStreakStartDate = new Date(dateOnly);
    } else {
      return streakRecord;
    }

    const newLongestStreak = Math.max(streakRecord.longestStreak, newCurrentStreak);

    const updatedStreak = await db.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: new Date(dateOnly),
        streakStartDate: newStreakStartDate
      }
    });

    return updatedStreak;
  } catch (error) {
    console.error("Error updating user streak:", error);
    throw error;
  }
};

export const getStreakCalendarData = async (userId, year = new Date().getFullYear()) => {
  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const dailyActivities = await db.userDailyActivity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

      const calendarData = dailyActivities.map(activity => ({
      date: activity.date.toISOString().split('T')[0],
      count: activity.submissionCount,
      problemsSolved: activity.problemsSolved,
      level: Math.min(Math.floor(activity.submissionCount / 2) + 1, 4)
    }));

    return calendarData;
  } catch (error) {
    console.error("Error getting calendar data:", error);
    throw error;
  }
};

export const recordDailyActivity = async (userId, problemSolved = false, submissionMade = false) => {
  try {
    const today = new Date();
    const istDate = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const dateOnly = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());

    const dailyActivity = await db.userDailyActivity.upsert({
      where: {
        userId_date: {
          userId,
          date: dateOnly
        }
      },
      update: {
        problemsSolved: problemSolved 
          ? { increment: 1 } 
          : undefined,
        submissionCount: submissionMade 
          ? { increment: 1 } 
          : undefined
      },
      create: {
        userId,
        date: dateOnly,
        problemsSolved: problemSolved ? 1 : 0,
        submissionCount: submissionMade ? 1 : 0
      }
    });

    return dailyActivity;
  } catch (error) {
    console.error("Error recording daily activity:", error);
    throw error;
  }
};

export const getDailyActivitySummary = async (userId, days = 30) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await db.userDailyActivity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return activities;
  } catch (error) {
    console.error("Error getting daily activity summary:", error);
    throw error;
  }
};

export const updateUserStatistics = async (userId) => {
  try {
    const solvedProblems = await db.problemSolved.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            difficulty: true
          }
        }
      }
    });

    const easyCount = solvedProblems.filter(p => p.problem.difficulty === 'EASY').length;
    const mediumCount = solvedProblems.filter(p => p.problem.difficulty === 'MEDIUM').length;
    const hardCount = solvedProblems.filter(p => p.problem.difficulty === 'HARD').length;
    const totalSolved = solvedProblems.length;

    const totalSubmissions = await db.submission.count({
      where: { userId }
    });

    const acceptanceRate = totalSubmissions > 0 
      ? Math.round((totalSolved / totalSubmissions) * 100 * 10) / 10
      : 0;

    const averageAttempts = totalSolved > 0 
      ? Math.round((totalSubmissions / totalSolved) * 10) / 10
      : 0;

    const statistics = await db.userStatistics.upsert({
      where: { userId },
      update: {
        totalSolved,
        totalSubmissions,
        easyCount,
        mediumCount,
        hardCount,
        acceptanceRate,
        averageAttempts,
        lastCalculated: new Date()
      },
      create: {
        userId,
        totalSolved,
        totalSubmissions,
        easyCount,
        mediumCount,
        hardCount,
        acceptanceRate,
        averageAttempts
      }
    });

    return statistics;
  } catch (error) {
    console.error("Error updating user statistics:", error);
    throw error;
  }
};

export const getProfileDashboardData = async (userId) => {
  try {
    const [user, streak, statistics, recentActivity, totalProblems] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),
      db.userStreak.findUnique({
        where: { userId }
      }),
      db.userStatistics.findUnique({
        where: { userId }
      }),
      getDailyActivitySummary(userId, 7),
      db.problem.groupBy({
        by: ['difficulty'],
        _count: {
          difficulty: true
        }
      })
    ]);

    const problemCounts = totalProblems.reduce((acc, item) => {
      acc[item.difficulty.toLowerCase()] = item._count.difficulty;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });

    const totalProblemsCount = problemCounts.easy + problemCounts.medium + problemCounts.hard;

    const dashboardData = {
      user: {
        ...user,
        joinDate: user?.createdAt?.toISOString().split('T')[0]
      },
      streak: streak || {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null
      },
      statistics: statistics || {
        totalSolved: 0,
        totalSubmissions: 0,
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
        acceptanceRate: 0,
        averageAttempts: 0
      },
      progress: {
        totalSolved: statistics?.totalSolved || 0,
        totalProblems: totalProblemsCount,
        progressPercentage: totalProblemsCount > 0 
          ? Math.round(((statistics?.totalSolved || 0) / totalProblemsCount) * 100 * 10) / 10
          : 0,
        byDifficulty: {
          easy: {
            solved: statistics?.easyCount || 0,
            total: problemCounts.easy
          },
          medium: {
            solved: statistics?.mediumCount || 0,
            total: problemCounts.medium
          },
          hard: {
            solved: statistics?.hardCount || 0,
            total: problemCounts.hard
          }
        }
      },
      recentActivity: recentActivity.map(activity => ({
        date: activity.date.toISOString().split('T')[0],
        problemsSolved: activity.problemsSolved,
        submissions: activity.submissionCount
      }))
    };

    return dashboardData;
  } catch (error) {
    console.error("Error getting profile dashboard data:", error);
    throw error;
  }
};

export const initializeUserProfile = async (userId) => {
  try {
    const [streak, statistics] = await Promise.all([
      db.userStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0
        }
      }),
      db.userStatistics.create({
        data: {
          userId
        }
      })
    ]);

    return { streak, statistics };
  } catch (error) {
    console.error("Error initializing user profile:", error);
    throw error;
  }
};
