import React from 'react';
import { Flame, Calendar, Target } from 'lucide-react';

const StreakCard = ({ streak }) => {
  if (!streak) return null;

  return (
    <div className="glass-effect rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold gradient-text-primary">
          Coding Streak
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Current Streak</p>
          <p className="text-2xl font-bold gradient-text-primary">
            {streak.currentStreak}
          </p>
          <p className="text-xs text-gray-400">days</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Longest Streak</p>
          <p className="text-2xl font-bold gradient-text-primary">
            {streak.longestStreak}
          </p>
          <p className="text-xs text-gray-400">days</p>
        </div>
      </div>

      {streak.lastActivityDate && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-dark-surface/50 rounded-xl p-3">
          <Calendar className="w-4 h-4" />
          Last activity: {new Date(streak.lastActivityDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default StreakCard;