import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const CalendarHeatmap = ({ calendarData = [] }) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  const currentYear = new Date().getFullYear();

  const activityMap = calendarData.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {});

  const generateMonthlyGrid = () => {
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentYear, i, 1);
      const monthEnd = new Date(currentYear, i + 1, 0);
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
      
      const weeks = [];
      const startDate = new Date(monthStart);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      while (startDate <= monthEnd) {
        const week = [];
        for (let day = 0; day < 7; day++) {
          const dateStr = startDate.toISOString().split('T')[0];
          const isCurrentMonth = startDate.getMonth() === i;
          const activity = activityMap[dateStr];
          
          week.push({
            date: new Date(startDate),
            dateStr,
            isCurrentMonth,
            submissions: activity?.count || 0,
            problems: activity?.problemsSolved || 0,
            dayOfMonth: startDate.getDate()
          });
          
          startDate.setDate(startDate.getDate() + 1);
        }
        weeks.push(week);
        if (startDate > monthEnd) break;
      }
      
      months.push({ name: monthName, weeks });
    }
    
    return months;
  };

  const getIntensityClass = (submissions, isCurrentMonth) => {
    if (!isCurrentMonth) return 'bg-dark-surface/30 opacity-30';
    if (submissions === 0) return 'bg-dark-surface/60';
    if (submissions >= 1 && submissions <= 3) return 'bg-orange-400/40';
    if (submissions >= 4 && submissions <= 9) return 'bg-orange-400/60';
    if (submissions >= 10 && submissions <= 19) return 'bg-orange-400/80';
    return 'bg-orange-400';
  };

  const months = generateMonthlyGrid();
  const totalSubmissions = calendarData.reduce((sum, item) => sum + (item.count || 0), 0);
  const activeDays = calendarData.filter(item => (item.count || 0) > 0).length;

  return (
    <div className="glass-effect rounded-2xl border border-primary/20 bg-dark-surface/40">
      <div className="p-6">
        <h2 className="flex items-center gap-3 text-lg font-bold gradient-text-primary mb-4">
          <Calendar className="w-5 h-5" />
          {currentYear} Submission Calendar
        </h2>

        <div className="mb-6 flex gap-6">
          <div className="text-sm text-gray-300">
            <span className="font-bold text-white text-base">{totalSubmissions}</span> submissions in {currentYear}
          </div>
          <div className="text-sm text-gray-300">
            Total active days: <span className="font-bold text-white text-base">{activeDays}</span>
          </div>
        </div>

        <div className="w-full max-w-full">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-8">
            {months.map((month, monthIndex) => (
              <div key={monthIndex} className="flex flex-col items-center">
                <h3 className="font-semibold text-sm mb-3 text-center w-full text-white">{month.name}</h3>
                <div className="space-y-1">
                  {month.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${monthIndex}-${weekIndex}-${dayIndex}`}
                          className={`
                            relative w-4 h-4 rounded-sm cursor-pointer border border-primary/30
                            flex items-center justify-center
                            ${getIntensityClass(day.submissions, day.isCurrentMonth)}
                            hover:ring-1 hover:ring-orange-400 hover:scale-125
                            transition-all duration-200
                            ${day.submissions > 0 && day.isCurrentMonth ? 'shadow-sm' : ''}
                          `}
                          onMouseEnter={() => setHoveredDate(day)}
                          onMouseLeave={() => setHoveredDate(null)}
                        >
                          {day.isCurrentMonth && day.submissions > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[7px] font-bold text-white leading-none">
                                {day.submissions}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {hoveredDate && (
          <div className="mt-4 p-3 bg-dark-surface/80 border border-primary/20 text-white rounded-xl text-sm">
            <strong>{hoveredDate.submissions}</strong> submissions on{' '}
            <strong>
              {hoveredDate.date.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </strong>
            {hoveredDate.problems > 0 && (
              <span className="text-gray-300">
                {' '}• {hoveredDate.problems} problems solved
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-center mt-6 text-xs text-gray-400">
          <span className="mr-2">Less</span>
          <div className="flex gap-1 mx-2">
            <div className="w-2 h-2 rounded-sm bg-dark-surface/60 border border-primary/30" />
            <div className="w-2 h-2 rounded-sm bg-orange-400/40 border border-primary/30" />
            <div className="w-2 h-2 rounded-sm bg-orange-400/60 border border-primary/30" />
            <div className="w-2 h-2 rounded-sm bg-orange-400/80 border border-primary/30" />
            <div className="w-2 h-2 rounded-sm bg-orange-400 border border-primary/30" />
          </div>
          <span className="ml-2">More</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmap;