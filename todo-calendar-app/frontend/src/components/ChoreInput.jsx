import React, { useState } from 'react';

function ChoreInput({ onAddTask }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAddTask(input, 'chore');
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-input-form chore-input-form">
            <div className="input-group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a chore (e.g., 'Buy Milk')"
                    className="task-input chore-input"
                />
                <button type="submit" className="btn btn-secondary">Add Chore</button>
            </div>
        </form>
    );
}

export default ChoreInput;
