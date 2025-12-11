import React, { useState } from 'react';
import TaskCard from './TaskCard';

function ScheduledList({ tasks, onToggleTask, onDeleteTask, onUpdateTask }) {
  const [editingId, setEditingId] = useState(null);

  // Sort by date if available
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.parsed_datetime && !b.parsed_datetime) return 0;
    if (!a.parsed_datetime) return 1;
    if (!b.parsed_datetime) return -1;
    return a.parsed_datetime.localeCompare(b.parsed_datetime);
  });

  return (
    <div className="tasks-list-container">
      {sortedTasks.length === 0 ? (
        <p className="empty-state">No scheduled tasks yet. Type "due by..." or "at..." to schedule.</p>
      ) : (
        <div className="tasks-list">
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
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
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledList;
