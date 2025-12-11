import React from 'react';
import ScheduledInput from '../components/ScheduledInput';
import CalendarView from '../components/CalendarView';
import ChoreInput from '../components/ChoreInput';
import ChoresList from '../components/ChoresList';

function Home({
    tasks,
    today,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTask
}) {
    const scheduledTasks = tasks.filter(t => t.category === 'scheduled');
    const choresTasks = tasks.filter(t => t.category === 'chore');

    return (
        <div className="page-home">
            <header className="page-header">
                <div className="header-top">
                    <h1>My Dashboard</h1>
                    <div className="today-badge">
                        {today.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                </div>
                <p>Manage your tasks and schedule</p>
            </header>

            <div className="content-grid">
                <section className="scheduled-section">
                    <h2>📅 Scheduled & Deadlines</h2>
                    <div className="section-input">
                        <ScheduledInput onAddTask={handleAddTask} />
                    </div>
                    <CalendarView
                        tasks={scheduledTasks}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        onUpdateTask={handleUpdateTask}
                    />
                </section>

                <section className="chores-section">
                    <h2>✓ Chores & Notes</h2>
                    <div className="section-input">
                        <ChoreInput onAddTask={handleAddTask} />
                    </div>
                    <ChoresList
                        tasks={choresTasks}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        onUpdateTask={handleUpdateTask}
                    />
                </section>
            </div>
        </div>
    );
}

export default Home;
