document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function displayTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div>
                    <strong>${task.title}</strong> - ${task.description} 
                    <br> Deadline: ${task.deadline} | Priority: ${task.priority} | Category: ${task.category}
                </div>
                <div class="actions">
                    <button onclick="markCompleted(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const task = {
            title: taskForm.taskTitle.value,
            description: taskForm.taskDescription.value,
            deadline: taskForm.taskDeadline.value,
            priority: taskForm.taskPriority.value,
            category: taskForm.taskCategory.value,
            completed: false,
        };

        tasks.push(task);
        saveTasks();
        displayTasks();
        taskForm.reset();
    });

    window.markCompleted = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        displayTasks();
    };

    window.editTask = function(index) {
        const task = tasks[index];
        taskForm.taskTitle.value = task.title;
        taskForm.taskDescription.value = task.description;
        taskForm.taskDeadline.value = task.deadline;
        taskForm.taskPriority.value = task.priority;
        taskForm.taskCategory.value = task.category;
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
    };

    function checkNotifications() {
        const now = new Date();
        tasks.forEach(task => {
            const deadline = new Date(task.deadline);
            if (!task.completed && deadline - now < 24 * 60 * 60 * 1000) {
                alert(`Reminder: Task "${task.title}" is due soon!`);
            }
        });
    }

    setInterval(checkNotifications, 60 * 1000); // Check every minute
    displayTasks();
});
