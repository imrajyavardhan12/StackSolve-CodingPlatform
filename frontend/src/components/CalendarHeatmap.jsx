import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const CalendarHeatmap = ({ calendarData = [] }) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const activityMap = calendarData.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {});

  const generateMonthlyGrid = () => {
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(oneYearAgo);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
      
      const weeks = [];
      const startDate = new Date(monthStart);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      while (startDate <= monthEnd) {
        const week = [];
        for (let day = 0; day < 7; day++) {
          const dateStr = startDate.toISOString().split('T')[0];
          const isCurrentMonth = startDate.getMonth() === monthStart.getMonth();
          const activity = activityMap[dateStr];
          
          week.push({
            date: new Date(startDate),
            dateStr,
            isCurrentMonth,
            count: activity?.count || 0
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

  const getIntensityClass = (count, isCurrentMonth) => {
    if (!isCurrentMonth) return 'bg-base-100';
    if (count === 0) return 'bg-base-200';
    if (count <= 3) return 'bg-success/40';
    if (count <= 9) return 'bg-success/60';
    if (count <= 19) return 'bg-success/80';
    return 'bg-success';
  };

  const months = generateMonthlyGrid();
  const totalSubmissions = calendarData.reduce((sum, item) => sum + item.count, 0);
  const activeDays = calendarData.filter(item => item.count > 0).length;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <Calendar className="w-6 h-6" />
          Submission Calendar
        </h2>

        <div className="mb-4">
          <div className="text-sm text-base-content/70">
            <span className="font-bold text-base-content">{totalSubmissions}</span> submissions in the past one year
          </div>
          <div className="text-sm text-base-content/70">
            Total active days: <span className="font-bold text-base-content">{activeDays}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((month, monthIndex) => (
            <div key={monthIndex} className="text-center">
              <h3 className="font-semibold text-sm mb-2">{month.name}</h3>
              <div className="flex flex-col gap-1">
                {month.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex gap-1 justify-center">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${monthIndex}-${weekIndex}-${dayIndex}`}
                        className={`
                          w-3 h-3 rounded-sm cursor-pointer border border-base-300
                          ${getIntensityClass(day.count, day.isCurrentMonth)}
                          hover:ring-1 hover:ring-primary
                        `}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hoveredDate && (
          <div className="mt-4 p-2 bg-base-200 rounded text-sm">
            {hoveredDate.count} submissions on{' '}
            {hoveredDate.date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarHeatmap;