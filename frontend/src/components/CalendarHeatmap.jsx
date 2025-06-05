import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarHeatmap = ({ calendarData = [], year, onYearChange }) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  const startOfYear = new Date(year, 0, 1);
  const startDate = new Date(startOfYear);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const activityMap = calendarData.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {});

  const generateCalendarGrid = () => {
    const weeks = [];
    const currentDate = new Date(startDate);
    const totalWeeks = 53;

    for (let week = 0; week < totalWeeks; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const isCurrentYear = currentDate.getFullYear() === year;
        const activity = activityMap[dateStr];
        
        days.push({
          date: new Date(currentDate),
          dateStr,
          isCurrentYear,
          count: activity?.count || 0,
          level: activity?.level || 0
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(days);
    }
    return weeks;
  };

  const getIntensityClass = (level) => {
    const classes = {
      0: 'bg-base-200',
      1: 'bg-success/30',
      2: 'bg-success/50', 
      3: 'bg-success/70',
      4: 'bg-success'
    };
    return classes[level] || classes[0];
  };

  const weeks = generateCalendarGrid();
  const totalContributions = calendarData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">
            <Calendar className="w-6 h-6" />
            {totalContributions} contributions in {year}
          </h2>
          
          <div className="flex items-center gap-2">
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => onYearChange(year - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold">{year}</span>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => onYearChange(year + 1)}
              disabled={year >= new Date().getFullYear()}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <div className="flex gap-1 min-w-fit">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`
                      w-3 h-3 rounded-sm cursor-pointer border border-base-300
                      ${day.isCurrentYear ? getIntensityClass(day.level) : 'bg-base-100'}
                      hover:ring-2 hover:ring-primary
                    `}
                    onMouseEnter={() => setHoveredDate(day)}
                    onMouseLeave={() => setHoveredDate(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          {hoveredDate && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-base-content text-base-100 text-sm rounded shadow-lg pointer-events-none z-10">
              <div className="font-semibold">
                {hoveredDate.date.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div>{hoveredDate.count} problems solved</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-sm opacity-70">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm border border-base-300 ${getIntensityClass(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmap;