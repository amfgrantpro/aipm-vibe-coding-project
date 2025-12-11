# Task Manager App

A minimal, fast task management application. Stay organized, track what needs doing, and mark tasks complete.

## Features

✅ **Add Tasks** - Create tasks with title, description, due date, and priority  
✅ **Organize** - Filter by All, Active, or Completed  
✅ **Mark Complete** - Check off tasks as you finish them  
✅ **Manage** - Delete tasks, set priorities, and see due dates  
✅ **Minimal** - Fast, simple, no bloat

## Quick Start

### 1. Install Dependencies

Backend:
```bash
cd task-app/backend
npm install
```

Frontend:
```bash
cd task-app/frontend
npm install
```

### 2. Start the Backend

```bash
cd task-app/backend
npm start
```

The API will run on `http://localhost:3001`

### 3. Start the Frontend (in a new terminal)

```bash
cd task-app/frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Task Structure

```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Optional details",
  "dueDate": "2025-12-25",
  "priority": "low|medium|high",
  "completed": false,
  "createdAt": "2025-12-10T..."
}
```

## How to Use

1. **Add a task**: Type in the input field, optionally set a due date and priority
2. **View tasks**: See all tasks or filter by Active/Completed
3. **Complete a task**: Check the box next to it
4. **Delete a task**: Click the ✕ button
5. **See details**: Hover over a task to see its priority and due date

## Design Principles

- **Minimal**: Only essential features
- **Fast**: Instant feedback, no waiting
- **Clean**: Simple, focused UI
- **Persistent**: Tasks saved in JSON file
- **Scalable**: Easy API to extend

## File Structure

```
task-app/
├── backend/
│   ├── package.json
│   ├── server.js        (Express API)
│   └── data.json        (Task storage)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue      (Main component)
│       └── components/
│           ├── TaskInput.vue  (Add tasks)
│           └── TaskCard.vue   (Display tasks)
└── README.md
```

## Next Steps

- Add task search/filtering
- Add categories/labels
- Add recurring tasks
- Add task notifications
- Add dark mode
- Export/backup tasks
