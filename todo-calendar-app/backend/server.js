const express = require('express');
const cors = require('cors');
const { parseTask } = require('./taskParser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

/**
 * GET /tasks
 * Retrieve all tasks
 */
app.get('/tasks', (req, res) => {
  const tasks = db.getAllTasks();
  res.json(tasks);
});

/**
 * POST /tasks
 * Create a new task with automatic parsing
 * Body: { text: string, referenceDate?: ISO string for timezone-aware parsing }
 */
app.post('/tasks', (req, res) => {
  const { text, type, referenceDate } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  // Default to chore if type not specified (though frontend should send it)
  const taskType = type === 'scheduled' ? 'scheduled' : 'chore';

  // Parse the task
  const parsed = parseTask(text, taskType, referenceDate);

  // Create task in database
  const task = db.createTask({
    text: parsed.clean_text,
    category: parsed.category,
    parsed_datetime: parsed.parsed_datetime,
    details: parsed.original_text // Save original text details
  });

  res.status(201).json(task);
});

/**
 * PUT /tasks/:id
 * Update an existing task
 * Body: { text?, category?, parsed_datetime?, done? }
 */
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // If text is being updated and no category/datetime override, re-parse
  if (updates.text && !updates.category) {
    const parsed = parseTask(updates.text);
    updates.text = parsed.clean_text;
    updates.category = parsed.category;
    updates.parsed_datetime = parsed.parsed_datetime;
  }

  const task = db.updateTask(id, updates);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

/**
 * DELETE /tasks/:id
 * Delete a task
 */
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const task = db.getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.deleteTask(id);
  res.json({ success: true, id });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎯 To-Do Calendar Backend running on http://localhost:${PORT}`);
});
