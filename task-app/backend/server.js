const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const TASKS_FILE = path.join(__dirname, 'data.json');

// Initialize data file
function initializeData() {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  }
}

// Read all tasks
function getTasks() {
  const data = fs.readFileSync(TASKS_FILE, 'utf8');
  return JSON.parse(data);
}

// Write tasks
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

initializeData();

// GET all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

// POST create task
app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description || '',
    dueDate: dueDate || null,
    priority: priority || 'medium',
    completed: false,
    createdAt: new Date().toISOString()
  };

  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  
  res.status(201).json(newTask);
});

// PATCH update task
app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  let tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  saveTasks(tasks);
  
  res.json(tasks[taskIndex]);
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  let tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
});
