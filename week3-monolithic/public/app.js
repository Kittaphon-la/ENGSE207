// Fetch all tasks
async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    renderTasks(data.tasks);
}

// Create task
async function createTask(taskData) {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
    const data = await response.json();
    return data;
}

// Load on page load
document.addEventListener('DOMContentLoaded', fetchTasks);