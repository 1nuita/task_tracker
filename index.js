const fs = require("fs");
const path = require("path");

// File to store tasks
const TASKS_FILE = path.join(__dirname, "tasks.json");

// Load tasks from the JSON file
function loadTasks() {
    if (!fs.existsSync(TASKS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(TASKS_FILE, "utf8");
    return JSON.parse(data);
}

// Save tasks to the JSON file
function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Add a new task
function addTask(description) {
    const tasks = loadTasks();
    const taskId = tasks.length + 1;
    const task = {
        id: taskId,
        description,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${taskId})`);
}

// Update a task
function updateTask(taskId, newDescription) {
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.description = newDescription;
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} updated successfully`);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

// Delete a task
function deleteTask(taskId) {
    let tasks = loadTasks();
    tasks = tasks.filter((t) => t.id !== taskId);
    saveTasks(tasks);
    console.log(`Task ${taskId} deleted successfully`);
}

// Mark a task as in progress or done
function markTask(taskId, status) {
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log(`Task ${taskId} marked as ${status}`);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

// List all tasks or tasks by status
function listTasks(status) {
    const tasks = loadTasks();
    const filteredTasks = status ? tasks.filter((t) => t.status === status) : tasks;
    filteredTasks.forEach((task) => {
        console.log(
            `ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created: ${task.createdAt}, Updated: ${task.updatedAt}`
        );
    });
}

// Main function to handle CLI commands
function main() {
    const [command, arg1, arg2] = process.argv.slice(2);

    switch (command) {
        case "add":
            if (!arg1) {
                console.log('Usage: node index.js add "Task description"');
                return;
            }
            addTask(arg1);
            break;

        case "update":
            if (!arg1 || !arg2) {
                console.log('Usage: node index.js update [task_id] "New description"');
                return;
            }
            updateTask(Number(arg1), arg2);
            break;

        case "delete":
            if (!arg1) {
                console.log("Usage: node index.js delete [task_id]");
                return;
            }
            deleteTask(Number(arg1));
            break;

        case "mark-in-progress":
            if (!arg1) {
                console.log("Usage: node index.js mark-in-progress [task_id]");
                return;
            }
            markTask(Number(arg1), "in-progress");
            break;

        case "mark-done":
            if (!arg1) {
                console.log("Usage: node index.js mark-done [task_id]");
                return;
            }
            markTask(Number(arg1), "done");
            break;

        case "list":
            listTasks(arg1);
            break;

        default:
            console.log(
                "Invalid command. Available commands: add, update, delete, mark-in-progress, mark-done, list"
            );
    }
}

// Run the CLI
main();