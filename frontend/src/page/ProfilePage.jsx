import React, { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';
import StreakCard from '../components/StreakCard';
import StatisticsOverview from '../components/StatisticsOverview';
import ProgressBars from '../components/ProgressBars';
import { Loader, RefreshCw, User, Calendar } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">
                <User className="w-6 h-6" />
                Initialize Your Profile
              </h2>
              <p className="text-center text-base-content/70">
                Set up your coding profile to start tracking your progress and streaks!
              </p>
              <div className="card-actions justify-center">
                <button 
                  className="btn btn-primary"
                  onClick={handleInitializeProfile}
                >
                  Initialize Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Dashboard</h1>
          <p className="text-base-content/70">
            Welcome back, {dashboardData.user?.name}!
          </p>
        </div>
        <button 
          className="btn btn-outline btn-sm"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <StatisticsOverview 
        statistics={dashboardData.statistics} 
        progress={dashboardData.progress} 
      />

      <div className="mb-6">
  {isCalendarLoading ? (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin mr-2" />
          <span>Loading calendar data...</span>
        </div>
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


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StreakCard streak={dashboardData.streak} />
        <ProgressBars progress={dashboardData.progress} />
      </div>

      {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <Calendar className="w-6 h-6" />
              Recent Activity
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Problems Solved</th>
                    <th>Submissions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-success">
                          {activity.problemsSolved}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">
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
    </div>
  );
};

export default ProfilePage;