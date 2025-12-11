import React, { useState } from 'react';
import DatePickerModal from './DatePickerModal';

function TaskCard({ task, isEditing, onToggle, onDelete, onEdit, onSave, onCancel }) {
  const [editText, setEditText] = useState(task.text);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (editText.trim()) {
      onSave({ text: editText });
    }
  };

  const handleDateSave = (updates) => {
    onSave(updates);
    setShowDatePicker(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    // European format: DD/MM/YYYY
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className={`task-card ${task.done ? 'done' : ''}`}>
        <div className="task-main">
          <input
            type="checkbox"
            checked={task.done}
            onChange={onToggle}
            className="task-checkbox"
          />

          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="task-edit-input"
              autoFocus
            />
          ) : (
            <span className="task-text">{task.text}</span>
          )}

          {task.parsed_datetime && (
            <button
              onClick={() => setShowDatePicker(true)}
              className="task-date-badge"
              title="Click to change date"
            >
              📅 {formatDate(task.parsed_datetime)}
            </button>
          )}
        </div>

        <div className="task-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn btn-sm btn-success">✓</button>
              <button onClick={onCancel} className="btn btn-sm btn-secondary">✕</button>
            </>
          ) : (
            <>
              <button onClick={onEdit} className="btn btn-sm btn-secondary">Edit</button>
              <button
                onClick={() => setShowDatePicker(true)}
                className="btn btn-sm btn-secondary"
                title="Set or change date"
              >
                📅
              </button>
              <button onClick={onDelete} className="btn btn-sm btn-danger">Delete</button>
            </>
          )}
        </div>
      </div>

      {showDatePicker && (
        <DatePickerModal
          task={task}
          onSave={handleDateSave}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </>
  );
}

export default TaskCard;