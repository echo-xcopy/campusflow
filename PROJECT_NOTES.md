# Sprint 1 planning notes

This file is for the build record and is not required in the final SourceCode folder.

## Sprint goal
Allow a student to add a task with a category and optional due date, manage its completion status, and have the task remain visible after refreshing the same browser profile.

## User stories selected before implementation

### US-01 - Add a task
As a student, I want to add a task with a category and optional due date so that I can keep track of schoolwork.

Acceptance criteria:
- A student can enter a task title and select a category.
- Due date is optional.
- Adding a non-empty title makes the task appear in the list.
- Empty or whitespace-only titles are rejected with a clear error and no task is added.

Development tasks: Build the form; add title validation; create task data; render saved task; verify valid and invalid input.

### US-02 - Track task status
As a student, I want to mark a task complete or reopen it so that my list reflects my progress.

Acceptance criteria:
- A task can be marked complete and reopened.
- Task completion styling reflects status.
- All, To do, and Completed filters show the appropriate tasks.
- A task can be deleted, and completed tasks can be cleared after confirmation.

Development tasks: Add completion control; implement status styling; add filters; implement deletion and clear-completed behavior.

### US-03 - Keep tasks after refresh
As a student, I want my task list to remain after refreshing the page so that I do not have to enter my tasks again during the same browser session/profile.

Acceptance criteria:
- Tasks are stored using browser localStorage.
- Tasks, category, due date, and completion status are loaded on page startup.
- After adding or changing a task, refreshing the page retains the saved values in the same browser profile.

Development tasks: Read from localStorage on startup; save changes after each mutation; check the application after refresh; document browser-local storage limitations.
