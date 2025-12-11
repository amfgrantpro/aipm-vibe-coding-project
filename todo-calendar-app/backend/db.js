const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

/**
 * Ensure data directory and file exist
 */
function initDb() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Read all tasks from JSON file
 */
function getAllTasks() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const tasks = JSON.parse(data);

    // Sort tasks
    // 1. Scheduled tasks with dates come first, sorted by date (earliest to latest)
    // 2. Then others (chores), sorted by creation (newest first)
    return tasks.sort((a, b) => {
      // Both have dates
      if (a.parsed_datetime && b.parsed_datetime) {
        return a.parsed_datetime.localeCompare(b.parsed_datetime);
      }
      // One has date, one doesn't
      if (a.parsed_datetime) return -1;
      if (b.parsed_datetime) return 1;

      // Neither has date (chores) - sort by creation, new first
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  } catch (err) {
    console.error('Error reading tasks:', err);
    return [];
  }
}

/**
 * Write tasks to JSON file
 */
function saveTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Error saving tasks:', err);
  }
}

/**
 * Get a task by ID
 */
function getTaskById(id) {
  const tasks = getAllTasks();
  return tasks.find(t => t.id === id);
}

/**
 * Create a new task
 */
function createTask(taskData) {
  const tasks = getAllTasks();
  const task = {
    id: uuidv4(),
    text: taskData.text,
    category: taskData.category,
    parsed_datetime: taskData.parsed_datetime,
    details: taskData.details || null, // Add details field support
    done: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

/**
 * Update a task
 */
function updateTask(id, updates) {
  const tasks = getAllTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;

  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveTasks(tasks);
  return tasks[index];
}

/**
 * Delete a task
 */
function deleteTask(id) {
  const tasks = getAllTasks();
  const filtered = tasks.filter(t => t.id !== id);
  saveTasks(filtered);
  return true;
}

// Initialize on load
initDb();

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
