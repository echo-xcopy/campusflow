# CampusFlow - Student Task Tracker

## Project purpose
CampusFlow is a small browser-based task tracker for students. Sprint 1 focuses on one useful workflow: add a study task, track whether it is complete, and keep the task list after refreshing the page.

**Student name:** Replace this line with your full name before submission.

## Sprint 1 goal
Allow a student to add a task with a category and optional due date, manage its completion status, and find the task list still available after a page refresh in the same browser.

## Technologies used
- HTML5 for the page structure and form
- CSS3 for the responsive layout and visual styling
- Vanilla JavaScript for validation, rendering, filters, and task actions
- Browser `localStorage` for persistence in the current browser profile
- Python 3 standard-library HTTP server for local serving (no third-party packages)

## Prerequisites
- Python 3.10 or newer (Python 3.10+ is recommended; Python 3.13 also works)
- A modern browser such as Chrome, Edge, Firefox, or Safari
- Git, if you are working on the development repository

No npm install or Python package installation is needed. The application has no third-party runtime dependencies.

## Installation
1. Download or clone this repository.
2. Open a terminal in the project root folder, the folder containing `index.html`, `styles.css`, and `app.js`.
3. Confirm Python is available:
   ```bash
   python3 --version
   ```
   On Windows, `python --version` may be the appropriate command.
4. No dependency installation command is required because the app uses browser APIs and Python's standard library only.

## Configuration
No environment variables, API keys, backend settings, or `.env` file are required. Tasks are stored in the browser's local storage under the key `campusflow.tasks.v1`.

## Run the application
From the project root folder, run:

```bash
python3 -m http.server 8000
```

On Windows, use `python -m http.server 8000` if that is the configured Python command. Keep the terminal open while using the app, then open this address in your browser:

`http://localhost:8000`

You should see the CampusFlow heading, the Add a task form, and the Your tasks list. To stop the local server, return to the terminal and press `Ctrl+C`.

## Try the Sprint 1 functionality
1. Open `http://localhost:8000`.
2. In **What needs to get done?**, enter `Review database normalization`.
3. Choose `Assignment` from Category and optionally select a due date.
4. Select **Add to my list**. The new task should appear in Your tasks.
5. Select the checkbox beside the task. It should appear completed with a strike-through. Select it again to reopen it.
6. Use **All tasks**, **To do**, and **Completed** to filter the list.
7. Add another task, then refresh the page. Tasks should remain available in the same browser profile.
8. Submit the form with an empty or whitespace-only task name. An error message should appear and no task should be added.
9. Use Delete on a task to remove it. The Clear completed option removes completed tasks after confirmation.

## Storage and limitations
- Data is stored locally in the current browser profile. It is not sent to a server and does not synchronize between devices or browsers.
- Clearing browser site data, using a private browsing session, or switching browser profiles may remove or hide the saved task list.
- There is no login, multi-user collaboration, cloud backup, notifications, or shared database in Sprint 1.
- This is a local application, not a publicly deployed live website. The Python HTTP server must remain running while you use it.
- The application handles a browser-storage write failure by showing an accessible status message, but it does not have a backend recovery mechanism.

## Manual checking
Follow the steps above and record the actual result in the Sprint 1 report. The report should include successful task creation, invalid-input rejection, completion status updates, persistence after refresh, and recent Git history. Do not report a pass unless you actually observe the expected result.

## Troubleshooting
- **The page does not open:** confirm the server command is still running and the browser address is exactly `http://localhost:8000`.
- **Port 8000 is already in use:** stop the other server if appropriate, or run `python3 -m http.server 8001` and open `http://localhost:8001`.
- **Tasks are missing:** return to the same browser profile used to create them. Private browsing and another browser profile use separate storage. Check that browser site data has not been cleared.
- **Changes are not being stored:** make sure the browser allows site storage for localhost and that the device has available storage. The app does not upload or back up tasks to a server.

## Interaction and accessibility notes
- The task title is required; category is selected from a list and due date is optional.
- Validation errors are announced to assistive technology through an alert region. Task-list changes are announced through a status region.
- Form controls and actions use labels and accessible names. The layout adapts for narrow screens.
- The task count and progress summary refer to tasks still marked as to do; the Completed filter shows completed tasks.
