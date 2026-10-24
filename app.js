(() => {
  'use strict';
  const STORAGE_KEY = 'campusflow.tasks.v1';
  const form = document.querySelector('#task-form');
  const titleInput = document.querySelector('#task-title');
  const categoryInput = document.querySelector('#task-category');
  const dueInput = document.querySelector('#task-due');
  const titleError = document.querySelector('#title-error');
  const taskList = document.querySelector('#task-list');
  const taskCount = document.querySelector('#task-count');
  const progressSummary = document.querySelector('#progress-summary');
  const clearCompletedButton = document.querySelector('#clear-completed');
  const statusMessage = document.querySelector('#status-message');
  const confirmDialog = document.querySelector('#confirm-dialog');
  const confirmClearButton = document.querySelector('#confirm-clear');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  let activeFilter = 'all';
  let tasks = loadTasks();

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(task => task && typeof task.id === 'string' && typeof task.title === 'string' && typeof task.completed === 'boolean');
    } catch (error) {
      console.warn('CampusFlow could not read saved tasks:', error);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('CampusFlow could not save tasks:', error);
      announce('Your browser could not save this change. Check available browser storage.');
      return false;
    }
  }

  function announce(message) { statusMessage.textContent = message; }
  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  }
  function prettyDate(dateString) {
    if (!dateString) return '';
    const date = new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, {month:'short',day:'numeric',year:'numeric'}).format(date);
  }
  function createId() {
    return (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  function render() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.length - activeTasks;
    taskCount.textContent = String(activeTasks);
    progressSummary.textContent = tasks.length === 0 ? 'You’re all caught up.' : (activeTasks === 0 ? 'Everything is complete. Nice work!' : `${activeTasks} task${activeTasks === 1 ? '' : 's'} left to do`);
    clearCompletedButton.disabled = completedTasks === 0;
    const visibleTasks = tasks.filter(task => activeFilter === 'all' || (activeFilter === 'active' && !task.completed) || (activeFilter === 'completed' && task.completed));
    taskList.querySelectorAll('.task-item, #empty-state, #filter-empty-state').forEach(node => node.remove());
    if (visibleTasks.length === 0) {
      const empty = document.createElement('div');
      empty.id = activeFilter === 'all' ? 'empty-state' : 'filter-empty-state';
      empty.className = 'empty-state';
      empty.innerHTML = activeFilter === 'all'
        ? '<div class="empty-illustration" aria-hidden="true"><span>✓</span></div><h3>A clear page is a good start.</h3><p>Add your first task above and it will show up here.</p>'
        : `<div class="empty-illustration" aria-hidden="true"><span>✓</span></div><h3>No ${activeFilter === 'active' ? 'open' : 'completed'} tasks here.</h3><p>${activeFilter === 'active' ? 'You may have finished everything on your list.' : 'Complete a task and it will appear here.'}</p>`;
      taskList.append(empty);
      return;
    }
    visibleTasks.forEach(task => {
      const item = document.createElement('article');
      item.className = `task-item${task.completed ? ' completed' : ''}`;
      item.dataset.taskId = task.id;
      const due = task.dueDate ? prettyDate(task.dueDate) : '';
      const dueClass = task.dueDate && task.dueDate < new Date().toISOString().slice(0,10) && !task.completed ? 'due-date overdue' : 'due-date';
      item.innerHTML = `
        <input class="task-check" type="checkbox" aria-label="Mark ${escapeText(task.title)} as ${task.completed ? 'to do' : 'completed'}" ${task.completed ? 'checked' : ''}>
        <div class="task-content">
          <div class="task-title">${escapeText(task.title)}</div>
          <div class="task-meta"><span class="category-tag" data-category="${escapeText(task.category)}">${escapeText(task.category)}</span>${due ? `<span class="${dueClass}">Due ${escapeText(due)}</span>` : ''}</div>
        </div>
        <div class="task-actions"><button class="task-action delete" type="button" aria-label="Delete ${escapeText(task.title)}" title="Delete task">Delete</button></div>`;
      taskList.append(item);
    });
  }

  function showTitleError(show) {
    titleError.hidden = !show;
    titleInput.setAttribute('aria-invalid', show ? 'true' : 'false');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
      showTitleError(true);
      titleInput.focus();
      announce('A task name is required. No task was added.');
      return;
    }
    showTitleError(false);
    const task = {id:createId(), title, category:categoryInput.value, dueDate:dueInput.value, completed:false, createdAt:new Date().toISOString()};
    tasks.unshift(task);
    saveTasks();
    activeFilter = 'all';
    updateFilters();
    render();
    form.reset();
    categoryInput.value = 'Study';
    titleInput.focus();
    announce(`Task added: ${title}`);
  });

  titleInput.addEventListener('input', () => {
    if (titleInput.value.trim()) showTitleError(false);
  });

  taskList.addEventListener('change', event => {
    if (!event.target.matches('.task-check')) return;
    const item = event.target.closest('.task-item');
    const task = tasks.find(candidate => candidate.id === item?.dataset.taskId);
    if (!task) return;
    task.completed = event.target.checked;
    saveTasks();
    render();
    announce(task.completed ? `Task completed: ${task.title}` : `Task reopened: ${task.title}`);
  });

  taskList.addEventListener('click', event => {
    const deleteButton = event.target.closest('.delete');
    if (!deleteButton) return;
    const item = deleteButton.closest('.task-item');
    const task = tasks.find(candidate => candidate.id === item?.dataset.taskId);
    if (!task) return;
    tasks = tasks.filter(candidate => candidate.id !== task.id);
    saveTasks();
    render();
    announce(`Task deleted: ${task.title}`);
  });

  function updateFilters() {
    filterButtons.forEach(button => {
      const selected = button.dataset.filter === activeFilter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    updateFilters();
    render();
  }));

  clearCompletedButton.addEventListener('click', () => {
    if (typeof confirmDialog.showModal === 'function') confirmDialog.showModal();
    else if (window.confirm('Clear completed tasks?')) { tasks = tasks.filter(task => !task.completed); saveTasks(); render(); }
  });
  confirmClearButton.addEventListener('click', event => {
    event.preventDefault();
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    if (confirmDialog.open) confirmDialog.close();
    render();
    announce('Completed tasks cleared.');
  });

  render();
  updateFilters();
})();
