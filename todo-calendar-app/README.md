# To-Do + Calendar App

A full-stack to-do list application with intelligent date/time parsing and automatic task categorization. Built with React, Express, and featuring smart deadline detection.

## Features

✨ **Smart Task Parsing**
- Automatically detects dates, times, and deadlines in natural language
- Supports formats: "tomorrow", "3pm", "Friday", "by next week", etc.
- Uses `chrono-node` library for robust date parsing

📅 **Calendar View**
- Visual organization of timed tasks and deadlines by date
- Shows tasks with specific times and due dates
- Today/Tomorrow quick labels

✓ **Chores Management**
- Separate list for tasks without dates or times
- Sortable by name or status
- Quick completion tracking

🎯 **Task Management**
- Mark tasks as complete/incomplete
- Edit task text and re-parse dates
- Delete tasks instantly
- Real-time UI updates

## Project Structure

```
todo-calendar-app/
├── backend/
│   ├── server.js           # Express server & API routes
│   ├── taskParser.js       # Natural language parsing logic
│   ├── db.js              # JSON file database
│   ├── data/              # Task storage (auto-created)
│   └── package.json
├── frontend/
│   ├── index.html         # HTML entry point
│   ├── src/
│   │   ├── main.jsx       # React entry point
│   │   ├── App.jsx        # Main app component
│   │   ├── styles.css     # Global styles
│   │   └── components/
│   │       ├── TaskInput.jsx       # Input form
│   │       ├── CalendarView.jsx    # Calendar display
│   │       ├── ChoresList.jsx      # Chores list
│   │       └── TaskCard.jsx        # Task item component
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm installed

### Installation & Setup

1. **Clone and navigate to the project:**
```bash
cd todo-calendar-app
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

### Running the App

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
Backend runs on `http://localhost:5001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Task Parsing

When you add a task, the backend automatically:

1. **Detects simple, unambiguous date patterns:**
   - "today" → Today's date
   - "tomorrow" → Tomorrow's date  
   - "15 March" or "March 15" → Specific month/day (assumes next occurrence if already passed this year)

2. **Classifies the task based on keywords:**
   - **Timed Task** → Has a specific time (e.g., "Dentist at 3pm") or time keywords (at, @, am, pm)
   - **Deadline Task** → Has deadline keywords (by, due, deadline, before, until) + a date (e.g., "Report due 15 March")
   - **Chore** → Everything else (no date, or date without deadline keyword)

3. **Cleans the text** by removing date/time references

### Edit Dates with Date Picker

If a task is parsed with the wrong date:
1. Click the **📅 button** next to Edit/Delete on the task
2. Use the **date picker** to select the correct date
3. Click **Save Date**

### API Endpoints

**GET /tasks**
- Returns all tasks (array)

**POST /tasks**
- Create new task
- Body: `{ text: "Your task description", referenceDate?: "ISO date string" }`
- Returns: Task object with parsed metadata

**PUT /tasks/:id**
- Update existing task
- Body: `{ text?, category?, parsed_datetime?, done? }`
- Returns: Updated task

**DELETE /tasks/:id**
- Permanently delete a task

### Example Tasks

Try entering these to see parsing in action:

```
"Dentist at 3pm tomorrow"        → Timed task on tomorrow's date
"Report due by 15 March"         → Deadline task on March 15
"Grocery shopping"               → Chore (no date)
"Meeting today at 10:30am"       → Timed task on today's date
"Submit invoice by 20 December"  → Deadline task on December 20
"Water plants"                   → Chore (no date)
"Lunch at 12pm"                  → Timed task (time but no date = chore stays chore)
"Call Mom tomorrow"              → No time keyword = stays as chore
```

**Note**: If natural language parsing doesn't work, you can always manually set the date using the date picker on the task.


## Customization & Enhancement

### Modifying Date Parsing

Edit `/backend/taskParser.js`:
- **Add new date patterns:** Extend `parseSimpleDate()` function
- **Adjust chrono behavior:** Modify `chrono.parse()` call
- **Custom time formats:** Add regex patterns in `removeDateReferences()`

Example - Add "next Monday" support:
```javascript
// In parseSimpleDate function
{ regex: /\bnext\s+(Monday|Tuesday|...)\b/i, offset: null }
```

### Adding New Features

**1. Recurring Tasks**
- Add `recurrence` field to task object
- Modify `/backend/db.js` to generate recurring instances

**2. Task Categories/Tags**
- Add `tags` array to task object
- Create `TagFilter.jsx` component
- Filter tasks in calendar view

**3. Drag-and-Drop Reordering**
- Install `react-beautiful-dnd` in frontend
- Wrap ChoresList in DragDropContext

**4. Notifications/Reminders**
- Add `reminderTime` field to tasks
- Use browser Notification API in frontend
- Check reminders on component mount

**5. Export/Import**
- Add `GET /tasks/export` endpoint for JSON download
- Add file upload input for import

### Database Alternative (SQLite)

Replace `/backend/db.js` with:
```javascript
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./tasks.db');

function getAllTasks() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}
```

## Example Prompts for Future Iterations

### "Add multi-user support"
*Prompt your AI tool:*
> "Add user authentication to the To-Do Calendar app. Create a simple login/signup flow with JWT tokens. Store user IDs with tasks and add auth middleware to all API routes. Use bcrypt for password hashing."

### "Implement recurring tasks"
*Prompt your AI tool:*
> "Add recurrence support to tasks. Add a 'recurrence' field (none/daily/weekly/monthly) to the task model. When creating recurring tasks, generate instances for the next 3 months. Add UI controls to set recurrence type."

### "Create a dark mode"
*Prompt your AI tool:*
> "Add dark mode toggle to the app. Create a theme context in React, add a toggle button in the header, and modify styles.css to use CSS variables for colors. Save theme preference to localStorage."

### "Add task filtering and search"
*Prompt your AI tool:*
> "Add a search bar and date range filter to the Calendar View. Allow filtering by task category, completion status, and text search. Display filter results in real-time."

### "Build a mobile app version"
*Prompt your AI tool:*
> "Convert this to a React Native app targeting iOS and Android. Keep the same API backend, reuse parsing logic. Optimize UI for mobile screens with bottom navigation."

## Troubleshooting

**Backend won't start?**
- Check Node.js version: `node --version` (needs 16+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Try different port: `PORT=5002 npm start`

**Frontend shows errors?**
- Ensure backend is running on port 5001
- Clear browser cache: Ctrl+Shift+Delete
- Check console for CORS errors

**Tasks not parsing dates?**
- Check browser console for errors
- Verify chrono-node is installed: `npm list chrono-node` in backend
- Test with simpler formats: "tomorrow", "3pm"

**JSON file corruption?**
- Delete `/backend/data/tasks.json`
- Restart backend (will create fresh file)

## Performance Notes

- Current implementation handles ~1000 tasks smoothly
- For 10,000+ tasks, migrate to SQLite for better performance
- Calendar view scrolling optimized for 100+ tasks per day

## License & Attribution

Built with:
- [React 18](https://react.dev)
- [Express.js](https://expressjs.com)
- [Vite](https://vitejs.dev)
- [chrono-node](https://github.com/wanasit/chrono)

---

**Need Help?** Check the examples, read the code comments, or experiment with the parsing logic in `backend/taskParser.js`.
