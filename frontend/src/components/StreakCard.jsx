import React from 'react';
import { Flame, Calendar, Target } from 'lucide-react';

const StreakCard = ({ streak }) => {
  if (!streak) return null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-primary">
          <Flame className="w-6 h-6" />
          Coding Streak
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Flame className="w-8 h-8" />
            </div>
            <div className="stat-title">Current Streak</div>
            <div className="stat-value text-2xl text-warning">
              {streak.currentStreak}
            </div>
            <div className="stat-desc">days</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <Target className="w-8 h-8" />
            </div>
            <div className="stat-title">Longest Streak</div>
            <div className="stat-value text-2xl text-success">
              {streak.longestStreak}
            </div>
            <div className="stat-desc">days</div>
          </div>
        </div>

        {streak.lastActivityDate && (
          <div className="mt-4 flex items-center gap-2 text-sm text-base-content/70">
            <Calendar className="w-4 h-4" />
            Last activity: {new Date(streak.lastActivityDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCard;