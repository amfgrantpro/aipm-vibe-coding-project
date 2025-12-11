import React, { useState } from 'react';

function MonthView({ tasks, onToggleTask }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get current month details
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDay = firstDayOfMonth.getDay() || 7; // 1 (Mon) - 7 (Sun)
    const daysInMonth = lastDayOfMonth.getDate();

    // Generate calendar grid
    const days = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i > 0; i--) {
        days.push({
            day: prevMonthLastDay - i + 1,
            currentMonth: false,
            date: new Date(year, month - 1, prevMonthLastDay - i + 1)
        });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            currentMonth: true,
            today: new Date().toDateString() === new Date(year, month, i).toDateString(),
            date: new Date(year, month, i)
        });
    }

    // Next month padding
    const remainingCells = 42 - days.length; // 6 rows * 7 cols
    for (let i = 1; i <= remainingCells; i++) {
        days.push({
            day: i,
            currentMonth: false,
            date: new Date(year, month + 1, i)
        });
    }

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(year, month + direction, 1));
    };

    // Helper to format date key YYYY-MM-DD
    const getDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    return (
        <div className="page-month-view">
            <header className="page-header month-header">
                <button onClick={() => navigateMonth(-1)} className="btn btn-secondary">&lt;</button>
                <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => navigateMonth(1)} className="btn btn-secondary">&gt;</button>
            </header>

            <div className="calendar-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}

                {days.map((dayObj, index) => {
                    const dateKey = getDateKey(dayObj.date);
                    const dayTasks = tasks.filter(t => t.parsed_datetime === dateKey);

                    return (
                        <div key={index} className={`calendar-cell ${!dayObj.currentMonth ? 'other-month' : ''} ${dayObj.today ? 'today' : ''}`}>
                            <div className="cell-header">
                                <span className="day-number">{dayObj.day}</span>
                            </div>
                            <div className="cell-content">
                                {dayTasks.map(task => (
                                    <div key={task.id} className={`mini-task-card ${task.done ? 'done' : ''}`} title={task.text}>
                                        <div className="mini-task-text">{task.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MonthView;
