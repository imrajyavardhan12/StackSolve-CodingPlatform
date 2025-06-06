import React from 'react';
import { CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';

const StatisticsOverview = ({ statistics, progress }) => {
  if (!statistics || !progress) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="glass-effect rounded-2xl p-6 hover-scale">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Problems Solved</p>
            <p className="text-2xl font-bold gradient-text-primary">{statistics.totalSolved}</p>
          </div>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {progress.progressPercentage.toFixed(1)}% of total
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6 hover-scale">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Acceptance Rate</p>
            <p className="text-2xl font-bold gradient-text-primary">{statistics.acceptanceRate}%</p>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {statistics.totalSubmissions} total submissions
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6 hover-scale">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Avg Attempts</p>
            <p className="text-2xl font-bold gradient-text-primary">
              {statistics.averageAttempts.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-400">per problem</div>
      </div>

      <div className="glass-effect rounded-2xl p-6 hover-scale">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Problems</p>
            <p className="text-2xl font-bold gradient-text-primary">{progress.totalProblems}</p>
          </div>
        </div>
        <div className="text-xs text-gray-400">available</div>
      </div>
    </div>
  );
};

export default StatisticsOverview;