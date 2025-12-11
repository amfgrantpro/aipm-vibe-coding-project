# API Reference - To-Do Calendar App

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. Get All Tasks

**Endpoint:** `GET /tasks`

**Description:** Retrieve all tasks stored in the system.

**Response:** `200 OK`

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "text": "Dentist appointment",
    "category": "timed",
    "parsed_datetime": "2025-12-12T15:00:00.000Z",
    "done": false,
    "createdAt": "2025-12-10T10:30:00.000Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174000",
    "text": "Water plants",
    "category": "chore",
    "parsed_datetime": null,
    "done": false,
    "createdAt": "2025-12-10T10:35:00.000Z"
  }
]
```

**Example:**
```bash
curl http://localhost:5000/tasks
```

---

### 2. Create Task

**Endpoint:** `POST /tasks`

**Description:** Create a new task with automatic date/time parsing.

**Request Body:**

```json
{
  "text": "Dentist at 3pm tomorrow"
}
```

**Response:** `201 Created`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "text": "Dentist",
  "category": "timed",
  "parsed_datetime": "2025-12-12T15:00:00.000Z",
  "done": false,
  "createdAt": "2025-12-10T10:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Missing or empty text field
  ```json
  { "error": "Task text is required" }
  ```

**Examples:**

```bash
# Timed task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "Meeting at 2pm tomorrow"}'

# Deadline task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "Report due by Friday"}'

# Chore
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "Buy groceries"}'
```

**Parsing Examples:**

| Input | Category | Parsed DateTime | Clean Text |
|-------|----------|-----------------|-----------|
| "Dentist at 3pm tomorrow" | timed | 2025-12-12T15:00:00Z | Dentist |
| "Report due by Friday" | deadline | 2025-12-12T00:00:00Z | Report |
| "Water plants" | chore | null | Water plants |
| "Meeting Monday at 10:30am" | timed | 2025-12-15T10:30:00Z | Meeting |

---

### 3. Update Task

**Endpoint:** `PUT /tasks/:id`

**Description:** Update an existing task. If text is modified and no category is specified, the task will be re-parsed.

**URL Parameters:**
- `id` (string, required) - Task UUID

**Request Body (all optional):**

```json
{
  "text": "Updated task description",
  "done": true,
  "category": "timed",
  "parsed_datetime": "2025-12-15T14:00:00.000Z"
}
```

**Response:** `200 OK`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "text": "Updated task description",
  "category": "timed",
  "parsed_datetime": "2025-12-15T14:00:00.000Z",
  "done": true,
  "createdAt": "2025-12-10T10:30:00.000Z",
  "updatedAt": "2025-12-10T10:35:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` - Task doesn't exist
  ```json
  { "error": "Task not found" }
  ```

**Examples:**

```bash
# Mark task as complete
curl -X PUT http://localhost:5000/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'

# Update text and re-parse
curl -X PUT http://localhost:5000/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"text": "New dentist time at 4pm"}'

# Override category
curl -X PUT http://localhost:5000/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"category": "chore"}'
```

---

### 4. Delete Task

**Endpoint:** `DELETE /tasks/:id`

**Description:** Permanently delete a task.

**URL Parameters:**
- `id` (string, required) - Task UUID

**Response:** `200 OK`

```json
{
  "success": true,
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Error Responses:**

- `404 Not Found` - Task doesn't exist
  ```json
  { "error": "Task not found" }
  ```

**Example:**

```bash
curl -X DELETE http://localhost:5000/tasks/123e4567-e89b-12d3-a456-426614174000
```

---

## Data Models

### Task Object

```typescript
{
  id: string,              // UUID v4
  text: string,            // Task description
  category: "timed" | "deadline" | "chore",  // Task type
  parsed_datetime: string | null,  // ISO 8601 datetime or null
  done: boolean,           // Completion status
  createdAt: string,       // ISO 8601 timestamp
  updatedAt?: string       // ISO 8601 timestamp (optional)
}
```

### Category Definitions

**timed:** Task with a specific date AND time
- Example: "Dentist at 3pm tomorrow"
- Has: `parsed_datetime` with time component

**deadline:** Task with a date but no specific time
- Example: "Report due by Friday"
- Has: `parsed_datetime` (time set to 00:00)

**chore:** Task without date or time
- Example: "Water plants"
- Has: `parsed_datetime` as null

---

## Date/Time Parsing

### Supported Formats

The backend uses `chrono-node` library with custom regex patterns:

#### Absolute Dates
- "tomorrow"
- "today"
- "Monday", "Tuesday", etc. (next occurrence)
- "Friday", "next Wednesday"
- Specific dates: "March 12", "12/25"

#### Relative Dates
- "next week"
- "this month"
- "in 3 days" (via chrono-node)

#### Times
- "3pm", "15:00"
- "10:30am", "22:30"
- With `@` symbol: "@3pm"

#### Deadline Keywords
- "by", "due", "before", "until"

#### Examples
```
"Dentist at 3pm tomorrow"
  → category: timed
  → parsed_datetime: 2025-12-12T15:00:00Z

"Report due by Friday"
  → category: deadline
  → parsed_datetime: 2025-12-12T00:00:00Z

"Meeting next Monday at 10:30am"
  → category: timed
  → parsed_datetime: 2025-12-15T10:30:00Z

"Water plants"
  → category: chore
  → parsed_datetime: null
```

---

## Error Handling

All errors return consistent format:

```json
{
  "error": "Human-readable error message"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently: No rate limiting (development version)

For production deployment, consider adding:
- Per-IP rate limits
- User-based rate limits
- Burst allowances

---

## CORS

**Allowed Origins:** All origins (configured with `*`)

For production, restrict to specific frontend domain:

```javascript
// In server.js
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Testing with cURL

### Get all tasks
```bash
curl http://localhost:5000/tasks | jq
```

### Add a task
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"text":"Lunch at noon tomorrow"}' | jq
```

### Update a task
```bash
TASK_ID="your-uuid-here"
curl -X PUT http://localhost:5000/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"done":true}' | jq
```

### Delete a task
```bash
TASK_ID="your-uuid-here"
curl -X DELETE http://localhost:5000/tasks/$TASK_ID | jq
```

---

## Testing with JavaScript

```javascript
// Get all tasks
const tasks = await fetch('/tasks').then(r => r.json());

// Add task
const newTask = await fetch('/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'My new task' })
}).then(r => r.json());

// Update task
const updated = await fetch(`/tasks/${newTask.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ done: true })
}).then(r => r.json());

// Delete task
await fetch(`/tasks/${newTask.id}`, { method: 'DELETE' });
```

---

## Performance Notes

### Response Times (approximate)

- `GET /tasks` (100 tasks): ~5ms
- `POST /tasks`: ~15ms (includes parsing)
- `PUT /tasks/:id`: ~10ms
- `DELETE /tasks/:id`: ~8ms

### Payload Sizes

- Single task: ~200 bytes
- 100 tasks: ~20KB
- 1000 tasks: ~200KB

### File I/O

- Sync write to `tasks.json` (consider async for >10K tasks)
- No indexing (linear search for ID lookup)

---
