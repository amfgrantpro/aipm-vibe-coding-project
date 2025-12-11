# AI Tool Instructions for To-Do + Calendar App

This document provides guidance for using AI tools (Claude, ChatGPT, Copilot, etc.) to enhance and maintain this project.

## System Overview

**Project Type:** Full-stack web application (React frontend + Express backend)

**Core Components:**
- Natural language task parsing (`backend/taskParser.js`)
- REST API with CRUD operations (`backend/server.js`)
- React component hierarchy with state management (`frontend/src/`)
- JSON-based data persistence (`backend/data/tasks.json`)

**Technology Stack:**
- Backend: Node.js, Express, chrono-node
- Frontend: React, Vite, CSS modules
- Database: JSON file (can upgrade to SQLite)

---

## Effective Prompting Patterns

### Pattern 1: Feature Addition
Use this structure when adding new capabilities:

```
"Add [feature] to the To-Do Calendar app.

Requirements:
- [Specific requirement 1]
- [Specific requirement 2]
- [Implementation detail]

Architecture notes:
- Backend: [Should this be an API change?]
- Frontend: [Which components affected?]
- Database: [New fields needed?]

Keep the changes minimal and preserve existing functionality."
```

**Example:**
```
"Add task color coding based on category to the To-Do Calendar app.

Requirements:
- Timed tasks: Red border
- Deadline tasks: Yellow border
- Chores: Green border

Architecture notes:
- Backend: No changes needed
- Frontend: Modify TaskCard.jsx to add dynamic CSS classes
- Database: No new fields

Keep changes to styles.css and TaskCard.jsx only."
```

### Pattern 2: Parsing Logic Enhancement
Use this for improving date/time detection:

```
"Enhance task parsing in backend/taskParser.js to recognize [specific pattern].

Current behavior:
[How it works now]

Desired behavior:
[What should happen]

Examples that should work:
- [Example 1]
- [Example 2]
- [Example 3]

Keep chrono-node as the primary parser and add regex fallbacks for edge cases."
```

**Example:**
```
"Enhance task parsing to recognize relative time formats like 'in 3 days' and 'next Tuesday'.

Current behavior:
Parses 'tomorrow', 'Friday', 'next week' but not 'in 3 days'.

Desired behavior:
Should recognize both absolute ('Friday') and relative ('in X days') formats.

Examples:
- 'Meeting in 3 days at 2pm'
- 'Deadline in 2 weeks'
- 'Call John in 5 days'

Keep chrono-node as primary and ensure regex fallbacks work."
```

### Pattern 3: Bug Fixing
Use this to diagnose and fix issues:

```
"Debug and fix [issue] in the To-Do Calendar app.

Symptom:
[What's broken]

Expected behavior:
[What should happen]

Steps to reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Affected file(s):
[Likely files]

Make minimal changes and add comments explaining the fix."
```

### Pattern 4: Code Refactoring
Use this to improve code structure:

```
"Refactor [component/module] in the To-Do Calendar app.

Current issues:
- [Issue 1]
- [Issue 2]

Goals:
- [Goal 1: e.g., 'Improve readability']
- [Goal 2: e.g., 'Reduce component size']

Constraints:
- Must not change public API
- Must maintain existing tests
- Must preserve styling

Provide before/after comparison."
```

---

## Common Enhancement Requests & Suggested Prompts

### 1. **Add Recurring Tasks**
```
"Add recurring task support to the To-Do Calendar app.

New field in task model:
- recurrence: 'none' | 'daily' | 'weekly' | 'monthly'
- recurrence_end_date: ISO date string (optional)

Backend changes:
- Modify db.js to generate recurrence instances (next 3 months)
- Modify taskParser.js to extract recurrence keywords ('every Monday', 'daily', etc.)
- Add recurrence field to POST /tasks and PUT /tasks/:id

Frontend changes:
- Add recurrence select in TaskInput
- Show recurrence badge in TaskCard
- Update CalendarView to group recurring instances

Start simple: just support daily/weekly/monthly."
```

### 2. **Add Task Priorities**
```
"Add priority levels to the To-Do Calendar app (High/Medium/Low).

Changes:
- Add 'priority' field to task model (default: 'medium')
- Parse priority keywords: '!!!' or 'urgent' = high, '!' = medium, etc.
- Sort chores by priority (high first)
- Color-code by priority in UI: red/yellow/gray

Frontend:
- Add priority select in task editor
- Show priority indicator in TaskCard
- Update TaskInput to parse priority keywords

Keep it simple: just visual indicators, no complex sorting yet."
```

### 3. **Add Time Zone Support**
```
"Add time zone support to the To-Do Calendar app.

Requirements:
- Store user's time zone preference
- Display all times in user's local zone
- Parse times correctly regardless of browser zone

Implementation:
- Add 'timezone' field to tasks (e.g., 'America/New_York')
- Install date-fns-tz for time zone handling
- Update taskParser to use user timezone
- Display timezone indicator in CalendarView

Store timezone in localStorage initially; can add user profiles later."
```

### 4. **Add Task Templates**
```
"Add task templates feature to speed up task creation.

Features:
- Create 'Morning Routine', 'Weekly Review', etc. templates
- Templates contain preset text and recurrence
- One-click task generation from template
- Manage templates: add, edit, delete

Implementation:
- Add /templates API endpoints (CRUD)
- Store templates in separate JSON file
- Add 'Use Template' button in UI
- Template modal/form

Start with 3 built-in templates; allow creating custom ones."
```

### 5. **Add Task Statistics**
```
"Add a statistics dashboard to the To-Do Calendar app.

Metrics to show:
- Tasks completed today/week/month
- Average tasks per day
- Most productive day of week
- Task completion rate by category

Implementation:
- Add /stats API endpoint
- Calculate metrics from task history
- Create StatsPanel.jsx component
- Add stats section to App.jsx

Store completion timestamps; chart with simple bar graph."
```

### 6. **Add Categories**
```
"Add custom categories to the To-Do Calendar app.

Features:
- Create custom categories (Work, Personal, Health, etc.)
- Assign tasks to categories
- Filter by category
- Color-code categories

Implementation:
- Add 'categories.json' file for storing category definitions
- Add 'category_id' field to tasks
- Create /categories API endpoints
- Add category select in TaskInput
- Add category filter in CalendarView

Start with 5 default categories; allow custom ones."
```

---

## Code Quality Guidelines

### When Requesting AI Assistance, Emphasize:

```
"When making changes, please:

1. **Preserve Existing Functionality**
   - Don't modify public API signatures
   - Don't break existing tests
   - Maintain backward compatibility

2. **Follow Project Conventions**
   - React: Functional components with hooks
   - Naming: camelCase for variables/functions, PascalCase for components
   - Styling: CSS modules, avoid inline styles
   - Comments: JSDoc for functions, inline for complex logic

3. **Code Style**
   - Use const/let (no var)
   - Add error handling
   - Include TypeScript-style JSDoc comments
   - Keep functions small (<50 lines)

4. **Testing Recommendations**
   - Write example usage in comments
   - Test in browser before suggesting
   - Provide simple test cases

5. **Documentation**
   - Update README if behavior changes
   - Add inline comments for non-obvious logic
   - Include usage examples"
```

---

## Testing & Validation Prompts

### "Add Test Examples"
```
"Add test examples for the [component/function] in the To-Do Calendar app.

For each test, provide:
- Description of what's being tested
- Input data
- Expected output
- Example: const result = parseTask('Meeting tomorrow at 3pm')

Make examples runnable in the browser console or as React Testing Library tests."
```

### "Validate Against Edge Cases"
```
"Test the [component/function] against these edge cases:

Edge cases to handle:
- Empty input
- Very long strings (>500 chars)
- Special characters
- Dates in past
- Invalid formats
- Null/undefined inputs

For each case: show current behavior vs. desired behavior."
```

---

## Performance & Optimization

### "Optimize for Large Task Lists"
```
"Optimize the To-Do Calendar app for users with 10,000+ tasks.

Current bottlenecks to address:
- CalendarView rendering all tasks
- TaskCard re-renders on parent updates
- JSON file I/O performance

Suggested optimizations:
- Virtual scrolling in CalendarView
- React.memo for TaskCard
- Pagination/lazy loading
- Consider SQLite migration

Implement without breaking UI."
```

### "Add Caching"
```
"Add client-side caching to reduce API calls.

Implement:
- localStorage cache for task list
- Cache expiry (e.g., 5 minutes)
- Sync button to force refresh
- Conflict resolution if backend changes

Keep it simple: don't add complex state management."
```

---

## Deployment & DevOps Prompts

### "Prepare for Deployment"
```
"Prepare the To-Do Calendar app for deployment to [Vercel/Heroku/AWS].

Steps:
1. Generate .env.example with required variables
2. Add build scripts to package.json
3. Create Dockerfile for backend (optional)
4. Add environment variable handling
5. Generate deployment instructions in README

Target: One-command deploy."
```

---

## Important: Prompt Hygiene

### DO:
✅ Be specific about what component/file to modify
✅ Provide examples of desired behavior
✅ Mention constraints (performance, compatibility)
✅ Ask to preserve existing functionality
✅ Request inline documentation

### DON'T:
❌ Ask for "add everything" - be granular
❌ Ignore performance implications
❌ Accept breaking changes without review
❌ Skip testing recommendations
❌ Add unnecessary dependencies

---

## Escalation: When to Use Tools vs Manual Work

**Use AI Tools For:**
- Generating boilerplate code
- Writing repetitive functions
- Refactoring existing code
- Finding bugs
- Writing tests
- Creating documentation

**Do Manually:**
- Critical business logic reviews
- Security-sensitive changes (auth, validation)
- Performance-critical paths
- Architectural decisions

---

## Version Control Tips

When AI generates code, always:
```bash
# Create a feature branch
git checkout -b feature/description

# Make changes with AI tool
# Test locally

# Review diff carefully
git diff

# Commit with clear message
git commit -m "Add [feature]: Brief description

- Changed X to do Y
- Added new endpoint /api/z
- Updated component ABC

AI Tool: [Describe how you used it]
"

# Push and create PR
git push origin feature/description
```

---

## Summary

This project is structured to be AI-friendly. Use these patterns and guidelines to:
1. **Add features quickly** with minimal manual work
2. **Maintain code quality** through clear prompting
3. **Preserve functionality** with architectural awareness
4. **Scale efficiently** with refactoring and optimization

The combination of clear structure, documented APIs, and focused prompting enables rapid, reliable development.

**Happy building!** 🎯
