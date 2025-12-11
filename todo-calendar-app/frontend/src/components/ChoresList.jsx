import React, { useState } from 'react';
import TaskCard from './TaskCard';

function ChoresList({ tasks, onToggleTask, onDeleteTask, onUpdateTask }) {
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // 'name' or 'done'

  let sorted = [...tasks];
  if (sortBy === 'done') {
    sorted.sort((a, b) => a.done - b.done);
  } else {
    sorted.sort((a, b) => a.text.localeCompare(b.text));
  }

  return (
    <div className="chores-list">
      <div className="chores-toolbar">
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="done">Status</option>
          </select>
        </label>
        <span className="count">{tasks.filter(t => !t.done).length} remaining</span>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="empty-state">All set! No chores yet.</p>
        ) : (
          sorted.map(task => (
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
          ))
        )}
      </div>
    </div>
  );
}

export default ChoresList;
