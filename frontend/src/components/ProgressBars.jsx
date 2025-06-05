import React from 'react';

const ProgressBars = ({ progress }) => {
  if (!progress) return null;

  const difficulties = [
    {
      name: 'Easy',
      key: 'easy',
      color: 'progress-success',
      bgColor: 'bg-success/10',
      textColor: 'text-success'
    },
    {
      name: 'Medium',
      key: 'medium',
      color: 'progress-warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning'
    },
    {
      name: 'Hard',
      key: 'hard',
      color: 'progress-error',
      bgColor: 'bg-error/10',
      textColor: 'text-error'
    }
  ];

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Problem Progress</h2>
        
        <div className="space-y-6">
          {difficulties.map((diff) => {
            const data = progress.byDifficulty[diff.key];
            const percentage = data.total > 0 ? (data.solved / data.total) * 100 : 0;
            
            return (
              <div key={diff.key} className={`p-4 rounded-lg ${diff.bgColor}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-semibold ${diff.textColor}`}>
                    {diff.name}
                  </span>
                  <span className="text-sm font-medium">
                    {data.solved}/{data.total}
                  </span>
                </div>
                
                <progress 
                  className={`progress ${diff.color} w-full`} 
                  value={percentage} 
                  max="100"
                ></progress>
                
                <div className="text-right text-sm text-base-content/70 mt-1">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        <div className="divider"></div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {progress.progressPercentage.toFixed(1)}%
          </div>
          <div className="text-sm text-base-content/70">
            Overall Progress ({progress.totalSolved}/{progress.totalProblems})
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBars;