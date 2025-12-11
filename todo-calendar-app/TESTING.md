# Testing Examples for To-Do Calendar App

This document provides test scenarios and expected behaviors for the app.

## Test Scenarios

### 1. Timed Task Parsing

**Test Case:** "Dentist at 3pm tomorrow"

Expected Output:
- Category: `timed`
- Clean Text: `Dentist`
- Parsed DateTime: Tomorrow at 15:00
- Badge: 🕐

**Test Case:** "Meeting tomorrow at 10:30am"

Expected Output:
- Category: `timed`
- Clean Text: `Meeting`
- Parsed DateTime: Tomorrow at 10:30
- Badge: 🕐

---

### 2. Deadline Task Parsing

**Test Case:** "Report due by Friday"

Expected Output:
- Category: `deadline`
- Clean Text: `Report`
- Parsed DateTime: Next Friday at 00:00
- Badge: 📌

**Test Case:** "Submit invoice by next week"

Expected Output:
- Category: `deadline`
- Clean Text: `Submit invoice`
- Parsed DateTime: Next Monday at 00:00
- Badge: 📌

---

### 3. Chore Task Parsing

**Test Case:** "Water plants"

Expected Output:
- Category: `chore`
- Clean Text: `Water plants`
- Parsed DateTime: `null`
- Badge: ✓
- Location: Chores List

**Test Case:** "Buy groceries"

Expected Output:
- Category: `chore`
- Clean Text: `Buy groceries`
- Parsed DateTime: `null`
- Badge: ✓

---

## UI/UX Test Checklist

### Task Input
- [ ] Can type in input field
- [ ] Placeholder text is visible
- [ ] Enter key submits form
- [ ] Button click submits form
- [ ] Input clears after submission
- [ ] Handles very long text (>200 chars)

### Calendar View
- [ ] Displays tasks grouped by date
- [ ] Shows "Today" label for today's tasks
- [ ] Shows "Tomorrow" label for tomorrow
- [ ] Tasks sorted chronologically
- [ ] Scrolls smoothly with many tasks
- [ ] Shows time for timed tasks

### Chores List
- [ ] Displays all non-dated tasks
- [ ] Sortable by name/status
- [ ] Shows completion count
- [ ] Empty state message displays

### Task Card
- [ ] Checkbox toggles done state
- [ ] Done tasks show strikethrough
- [ ] Category badge displays correctly
- [ ] Edit button enters edit mode
- [ ] Save/Cancel work in edit mode
- [ ] Delete removes task immediately

### Task Editing
- [ ] Can edit task text
- [ ] Re-parsing works on save
- [ ] Can change category manually
- [ ] Changes persist after reload

---

## API Test Cases

### POST /tasks

```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "Lunch with team tomorrow at noon"}'
```

Expected: `201` with task object containing parsed datetime

### GET /tasks

```bash
curl http://localhost:5000/tasks
```

Expected: `200` with array of all tasks

### PUT /tasks/:id

```bash
curl -X PUT http://localhost:5000/tasks/123 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

Expected: `200` with updated task object

### DELETE /tasks/:id

```bash
curl -X DELETE http://localhost:5000/tasks/123
```

Expected: `200` with success message

---

## Edge Cases

### Edge Case 1: Past Dates
**Input:** "Dentist at 3pm yesterday"
**Expected:** Should parse to yesterday's date (might be in past)
**Behavior:** Task still created; user can manually correct

### Edge Case 2: Ambiguous Dates
**Input:** "Meeting on 5/10"
**Expected:** chrono-node defaults to future interpretation
**Behavior:** May be May 10 or Oct 5 depending on locale

### Edge Case 3: Multiple Times in One Task
**Input:** "Meetings from 2pm to 3pm tomorrow"
**Expected:** Should capture first time (2pm)
**Behavior:** Creates timed task at 2pm

### Edge Case 4: Empty Input
**Input:** (blank)
**Expected:** Should show error or be disabled
**Behavior:** Button doesn't submit

### Edge Case 5: Very Long Task Text
**Input:** 1000+ character string
**Expected:** Should truncate in UI but store full text
**Behavior:** Preserves full text in DB, truncates display

---

## Performance Tests

### Load Test 1: Add Many Tasks
- Add 100 tasks rapidly
- Measure: Response time, UI lag
- Expected: No lag, <100ms per task

### Load Test 2: Calendar View with Many Tasks
- Display 50+ tasks in Calendar View
- Scroll through list
- Measure: Frame rate, scroll smoothness
- Expected: 60fps, smooth scrolling

### Load Test 3: JSON File Size
- Add 1000 tasks
- Check: `/backend/data/tasks.json` file size
- Expected: < 500KB (JSON overhead)

---

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Accessibility Checklist

- [ ] All buttons have visible focus states
- [ ] Input has accessible label/placeholder
- [ ] Checkboxes keyboard accessible
- [ ] Color not sole indicator (use badges)
- [ ] Text contrast meets WCAG AA
- [ ] Tab order is logical

---

## Integration Test Flow

**Full User Journey:**

1. Open http://localhost:3000
2. Add task: "Dentist at 3pm tomorrow"
   - Verify appears in Calendar View
   - Verify shows 🕐 badge
   - Verify shows time
3. Add task: "Grocery shopping"
   - Verify appears in Chores List
   - Verify has ✓ badge
4. Add task: "Report due Friday"
   - Verify appears in Calendar View
   - Verify shows 📌 badge
5. Mark dentist as done
   - Verify strikethrough applied
   - Verify count updates
6. Edit grocery task to "Buy milk"
   - Verify text updates
7. Delete report task
   - Verify removed from Calendar View
8. Reload page
   - Verify all changes persisted
9. Add 10 more tasks rapidly
   - Verify no lag or errors

---

## Known Limitations (as designed)

- ❌ No user authentication (single-user app)
- ❌ No recurring tasks (v1 feature)
- ❌ No time zones (assumes local)
- ❌ No task categories/tags (v2 feature)
- ❌ No drag-and-drop reordering (optional)
- ✅ Simple JSON storage (works for <5000 tasks)

---

## Debugging Tips

### Check Backend Parsing
```bash
cd backend
node -e "const p = require('./taskParser'); console.log(p.parseTask('Meeting Friday at 2pm'))"
```

### Check Browser Console
```javascript
// Fetch all tasks
fetch('/tasks').then(r => r.json()).then(console.log)

// Add task
fetch('/tasks', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({text: 'Test'})
}).then(r => r.json()).then(console.log)
```

### Check Task JSON File
```bash
cat backend/data/tasks.json | jq .
```

---

## Report Format for Issues

When reporting a bug, include:

**Title:** Brief description
**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected:** What should happen
**Actual:** What happens instead
**Browser:** Chrome/Firefox/Safari + version
**Environment:** macOS/Windows/Linux

---
