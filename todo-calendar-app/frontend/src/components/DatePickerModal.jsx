import React, { useState } from 'react';

export default function DatePickerModal({ task, onSave, onClose }) {
  const [selectedDate, setSelectedDate] = useState(
    task.parsed_datetime || ''
  );

  const handleSave = () => {
    if (selectedDate) {
      onSave({ parsed_datetime: selectedDate });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Set Date for: {task.text}</h3>
        
        <div className="date-picker-section">
          <label>Choose Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <p className="date-preview">
              Selected: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
        </div>

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={!selectedDate}>
            Save Date
          </button>
        </div>
      </div>
    </div>
  );
}
