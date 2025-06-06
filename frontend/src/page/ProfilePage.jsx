import React, { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';
import StreakCard from '../components/StreakCard';
import StatisticsOverview from '../components/StatisticsOverview';
import ProgressBars from '../components/ProgressBars';
import { Loader, RefreshCw, User, Calendar, Trophy, Code, Zap, Target } from 'lucide-react';
import CalendarHeatmap from '../components/CalendarHeatmap';

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { dashboardData, isLoading, fetchDashboard, initializeProfile, calendarData, calendarYear, isCalendarLoading, fetchCalendarData, changeCalendarYear } = useProfileStore();

  useEffect(() => {
    if (authUser) {
      fetchDashboard();
      fetchCalendarData();
    }
  }, [authUser, fetchDashboard, fetchCalendarData]);

  const handleInitializeProfile = async () => {
    await initializeProfile();
  };

  const handleRefresh = () => {
    fetchDashboard();
    fetchCalendarData(calendarYear);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <span className="text-white text-lg font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="glass-effect rounded-2xl p-8 text-center hover-scale">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-dark-navy" />
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Initialize Your Profile
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Set up your coding profile to start tracking your progress, streaks, and achievements on your journey to mastering DSA!
            </p>
            <button 
              className="btn btn-lg bg-gradient-to-r from-primary to-secondary text-dark-navy border-0 hover-glow font-bold w-full rounded-xl"
              onClick={handleInitializeProfile}
            >
              <Zap className="w-5 h-5 mr-2" />
              Initialize Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-0 w-1/3 h-1/3 bg-primary/20 opacity-30 blur-3xl rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-20 right-0 w-1/4 h-1/4 bg-secondary/20 opacity-30 blur-3xl rounded-full animate-pulse delay-300"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl">
                <User className="w-10 h-10 text-dark-navy" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black gradient-text mb-2">
                  Welcome back, {dashboardData.user?.name}!
                </h1>
                <p className="text-lg text-gray-300">
                  Ready to conquer more coding challenges today?
                </p>
              </div>
            </div>
            <button 
              className="btn btn-sm glass-effect border-primary/20 text-white hover:bg-primary/20 font-medium"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          {/* Quick Stats Hero Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-effect rounded-2xl p-6 hover-scale">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Problems Solved</p>
                  <p className="text-2xl font-bold text-white">{dashboardData.statistics?.totalSolved || 0}</p>
                </div>
              </div>
              <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                  style={{ width: `${dashboardData.progress?.progressPercentage || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 hover-scale">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Current Streak</p>
                  <p className="text-2xl font-bold text-white">{dashboardData.streak?.currentStreak || 0} days</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Longest: {dashboardData.streak?.longestStreak || 0} days</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 hover-scale">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Accuracy</p>
                  <p className="text-2xl font-bold text-white">{dashboardData.statistics?.acceptanceRate || 0}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{dashboardData.statistics?.totalSubmissions || 0} submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Enhanced Statistics Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-6">Detailed Statistics</h2>
          <StatisticsOverview 
            statistics={dashboardData.statistics} 
            progress={dashboardData.progress} 
          />
        </div>

        {/* Calendar Heatmap */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
            <Code className="w-6 h-6" />
            Coding Activity
          </h2>
          {isCalendarLoading ? (
            <div className="glass-effect rounded-2xl p-8">
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin mr-3 text-primary" />
                <span className="text-white font-medium">Loading calendar data...</span>
              </div>
            </div>
          ) : (
            <CalendarHeatmap
              calendarData={calendarData}
              year={calendarYear}
              onYearChange={changeCalendarYear}
            />
          )}
        </div>

        {/* Streak and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Streak Information
            </h3>
            <StreakCard streak={dashboardData.streak} />
          </div>
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Progress Overview
            </h3>
            <ProgressBars progress={dashboardData.progress} />
          </div>
        </div>

        {/* Recent Activity */}
        {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              Recent Activity
            </h2>
            <div className="glass-effect rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <tr className="border-b border-primary/20">
                      <th className="text-white font-semibold">Date</th>
                      <th className="text-white font-semibold">Problems Solved</th>
                      <th className="text-white font-semibold">Submissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentActivity.map((activity, index) => (
                      <tr key={index} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                        <td className="text-white font-medium">
                          {new Date(activity.date).toLocaleDateString()}
                        </td>
                        <td>
                          <span className="badge badge-success font-medium">
                            {activity.problemsSolved}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-info font-medium">
                            {activity.submissions}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Footer */}
        <div className="glass-effect rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold gradient-text mb-3">
            Keep Building Your Coding Legacy! 🚀
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Every problem solved is a step closer to your dream job. Stay consistent, stay motivated!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;