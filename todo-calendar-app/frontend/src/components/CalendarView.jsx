import React, { useState } from 'react';
import TaskCard from './TaskCard';

function CalendarView({ tasks, selectedDate, onSelectDate, onToggleTask, onDeleteTask, onUpdateTask }) {
  const [editingId, setEditingId] = useState(null);

  // Helper to check if a date string is in the current week (Mon-Sun)
  const isThisWeek = (dateStr) => {
    const today = new Date();
    // Adjust to Monday of this week
    const day = today.getDay() || 7; // Get current day number, converting Sun (0) to 7
    if (day !== 1) today.setHours(-24 * (day - 1));
    today.setHours(0, 0, 0, 0); // Monday 00:00

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const checkDate = new Date(dateStr);
    return checkDate >= today && checkDate < nextWeek;
  };

  const isNextWeek = (dateStr) => {
    const today = new Date();
    const day = today.getDay() || 7;
    if (day !== 1) today.setHours(-24 * (day - 1));
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);

    const checkDate = new Date(dateStr);
    return checkDate >= nextWeek && checkDate < twoWeeks;
  };

  const getWeekStart = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay() || 7;
    if (day !== 1) date.setHours(-24 * (day - 1));
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Group tasks
  const groupedTasks = {};
  const sortedTasks = [...tasks].sort((a, b) => a.parsed_datetime.localeCompare(b.parsed_datetime));

  sortedTasks.forEach(task => {
    if (!task.parsed_datetime) return;

    let groupKey;
    if (isThisWeek(task.parsed_datetime)) {
      groupKey = "This Week";
    } else if (isNextWeek(task.parsed_datetime)) {
      groupKey = "Next Week";
    } else {
      const weekStart = getWeekStart(task.parsed_datetime);
      groupKey = `Week of ${weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    }


    // Better to use an array of groups to maintain order, or just iterate specific keys if we knew them.
    // But since "Week of..." is dynamic, we should probably just use the groupKey and sort sections later.
    if (!groupedTasks[groupKey]) groupedTasks[groupKey] = [];
    groupedTasks[groupKey].push(task);
  });

  // Determine order of keys
  // "This Week", "Next Week", then everything else chronologically
  const groupKeys = Object.keys(groupedTasks).sort((a, b) => {
    if (a === "This Week") return -1;
    if (b === "This Week") return 1;
    if (a === "Next Week") return -1;
    if (b === "Next Week") return 1;

    // Extract date from "Week of ..."
    // This is a bit hacky, cleaner is to store sortable key.
    // Let's rely on the first task's date in each group for sorting.
    const taskA = groupedTasks[a][0];
    const taskB = groupedTasks[b][0];
    return taskA.parsed_datetime.localeCompare(taskB.parsed_datetime);
  });

  return (
    <div className="calendar-view">
      <div className="calendar-container">
        {groupKeys.length === 0 ? (
          <p className="empty-state">No scheduled tasks yet. Add a task with a date!</p>
        ) : (
          groupKeys.map(key => (
            <div key={key} className="date-group week-group">
              <h3 className="section-subheader">{key}</h3>
              <div className="tasks-list">
                {groupedTasks[key].map(task => (
                  <div key={task.id} className="task-wrapper">
                    <div className="task-date-badge">
                      {new Date(task.parsed_datetime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
                    </div>
                    <TaskCard
                      task={task}
                      isEditing={editingId === task.id}
                      onToggle={() => onToggleTask(task.id, !task.done)}
                      onDelete={() => onDeleteTask(task.id)}
                      onEdit={() => setEditingId(task.id)}
                      onSave={(updates) => {
                        onUpdateTask(task.id, updates);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CalendarView;
