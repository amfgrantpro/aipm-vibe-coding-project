import React, { useState } from 'react';

function ScheduledInput({ onAddTask }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAddTask(input, 'scheduled');
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-input-form scheduled-input-form">
            <div className="input-group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add event (e.g., 'Meeting Friday 3pm')"
                    className="task-input scheduled-input"
                />
                <button type="submit" className="btn btn-primary">Add Event</button>
            </div>
            <small className="help-text">Natural language date parsing (e.g., "tomorrow", "next friday")</small>
        </form>
    );
}

export default ScheduledInput;
