# Quick Start Testing Guide

## Reset and Restart (Fresh Test)

Copy-paste these commands in order:

```bash
# 1. Clear old task data
rm /Users/alastair/Github/aipm-vibe-coding-project/todo-calendar-app/backend/data/tasks.json

# 2. Start backend (Terminal 1)
cd /Users/alastair/Github/aipm-vibe-coding-project/todo-calendar-app/backend
npm start

# 3. Start frontend (Terminal 2)
cd /Users/alastair/Github/aipm-vibe-coding-project/todo-calendar-app/frontend
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## Common Tasks

### Add a Test Task
Just type in the input field and click "Add Task". Examples:
- "Buy groceries" → goes to Chores
- "Meeting tomorrow" → goes to Scheduled
- "Report due" → goes to Scheduled

### Set a Date
1. Click the **📅** button next to a Scheduled task
2. Use the date picker to select a date
3. Click "Save Date"

### Clear Everything
If you want to start completely fresh:
```bash
rm /Users/alastair/Github/aipm-vibe-coding-project/todo-calendar-app/backend/data/tasks.json
# Then restart both backend and frontend
```

## Troubleshooting

**Backend won't start?**
```bash
cd /Users/alastair/Github/aipm-vibe-coding-project/todo-calendar-app/backend
npm install
npm start
```

**Frontend won't start?**
```bash
cd /Users/alastair/Github/aipm-vibe-coding-project/todo-calendar-app/frontend
npm install
npm run dev
```

**Port already in use?**
Backend uses 5001, frontend uses 3000. If either is blocked:
```bash
# For backend on different port:
cd backend
PORT=5002 npm start

# For frontend on different port:
cd frontend
npm run dev -- --port 3001
```
