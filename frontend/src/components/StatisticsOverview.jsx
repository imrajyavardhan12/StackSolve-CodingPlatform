import React from 'react';
import { CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';

const StatisticsOverview = ({ statistics, progress }) => {
  if (!statistics || !progress) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-error';
      default: return 'text-base-content';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10';
      case 'medium': return 'bg-warning/10';
      case 'hard': return 'bg-error/10';
      default: return 'bg-base-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-primary">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="stat-title">Problems Solved</div>
        <div className="stat-value text-primary">{statistics.totalSolved}</div>
        <div className="stat-desc">
          {progress.progressPercentage.toFixed(1)}% of total
        </div>
      </div>

      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-info">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="stat-title">Acceptance Rate</div>
        <div className="stat-value text-info">{statistics.acceptanceRate}%</div>
        <div className="stat-desc">
          {statistics.totalSubmissions} total submissions
        </div>
      </div>

      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-warning">
          <Clock className="w-8 h-8" />
        </div>
        <div className="stat-title">Avg Attempts</div>
        <div className="stat-value text-warning">
          {statistics.averageAttempts.toFixed(1)}
        </div>
        <div className="stat-desc">per problem</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-success">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Problems</div>
        <div className="stat-value text-success">{progress.totalProblems}</div>
        <div className="stat-desc">available</div>
      </div>
    </div>
  );
};

export default StatisticsOverview;