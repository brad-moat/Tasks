

// Initialize an empty array to store tasks
let tasks = [];
let editIndex = null;

// Elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeBtn = document.querySelector(".close");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskTitle = document.getElementById("taskTitle");
const taskBody = document.getElementById("taskBody");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("filterSelect");

let filter = 'all';

// Save tasks to local storage
function saveTasksToLocal() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromLocal() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

// Render tasks based on the filter
function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        
        // Task title and details
        const titleElement = document.createElement("strong");
        titleElement.className = 'task-title';
        titleElement.textContent = task.title;
        
        const detailsElement = document.createElement("span");
        detailsElement.className = 'task-details';
        detailsElement.textContent = task.body;

        // Move Up and Down icons
        const moveUpIcon = document.createElement("i");
        moveUpIcon.className = "fas fa-arrow-up move-icon";
        moveUpIcon.onclick = () => moveTask(index, 'up');
        
        const moveDownIcon = document.createElement("i");
        moveDownIcon.className = "fas fa-arrow-down move-icon";
        moveDownIcon.onclick = () => moveTask(index, 'down');

        // Completed icon
        const completeIcon = document.createElement("i");
        completeIcon.className = task.completed ? "fas fa-check-square completed-icon" : "far fa-square completed-icon";
        completeIcon.onclick = () => toggleComplete(index);

        // Edit icon
        const editIcon = document.createElement("i");
        editIcon.className = "fas fa-pencil-alt edit-icon";
        editIcon.onclick = () => editTask(index);

        // Delete icon
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash delete-icon";
        deleteIcon.onclick = () => deleteTask(index);

        // Append elements to list item
        li.appendChild(moveUpIcon);
        li.appendChild(moveDownIcon);
        li.appendChild(titleElement);
        li.appendChild(detailsElement);
        li.appendChild(completeIcon);
        li.appendChild(editIcon);
        li.appendChild(deleteIcon);

        taskList.appendChild(li);
    });
}

// Save or edit a task
function saveTask() {
    const title = taskTitle.value.trim();
    const body = taskBody.value.trim();

    if (title && body) {
        if (editIndex !== null) {
            tasks[editIndex] = { title, body, completed: tasks[editIndex].completed };
            editIndex = null;
        } else {
            tasks.push({ title, body, completed: false });
        }
        saveTasksToLocal();
        renderTasks();
    }

    // Clear modal fields and close it
    taskTitle.value = '';
    taskBody.value = '';
    taskModal.style.display = 'none';
}

// Move task up or down
function moveTask(index, direction) {
    if (direction === 'up' && index > 0) {
        [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
    } else if (direction === 'down' && index < tasks.length - 1) {
        [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    }
    saveTasksToLocal();
    renderTasks();
}

// Show modal to add a new task
function showModal() {
    taskModal.style.display = 'flex';
}

// Close modal
function closeModal() {
    taskModal.style.display = 'none';
    editIndex = null;
    taskTitle.value = '';
    taskBody.value = '';
}

// Edit a task
function editTask(index) {
    editIndex = index;
    taskTitle.value = tasks[index].title;
    taskBody.value = tasks[index].body;
    showModal();
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasksToLocal();
    renderTasks();
}

// Toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasksToLocal();
    renderTasks();
}

// Filter function
function filterTasks(event) {
    filter = event.target.value;
    renderTasks();
}

// Event listeners
addTaskBtn.addEventListener("click", showModal);
closeBtn.addEventListener("click", closeModal);
saveTaskBtn.addEventListener("click", saveTask);
filterSelect.addEventListener("change", filterTasks);

// Load tasks from local storage on page load
loadTasksFromLocal();

// Feedback modal elements
const feedbackModal = document.getElementById("feedbackModal");
const closeFeedbackBtn = document.querySelector(".close-feedback");
const feedbackForm = document.getElementById("feedbackForm");
const feedbackSentMessage = document.getElementById("feedbackSentMessage");

// Open feedback modal (Triggered by button click)
function showFeedbackModal() {
    feedbackModal.style.display = "block";
}

// Close feedback modal
function closeFeedbackModal() {
    feedbackModal.style.display = "none";
}

// Send feedback using EmailJS
function sendFeedback(event) {
    event.preventDefault();

    const feedbackName = document.getElementById("feedbackName").value;
    const feedbackMessage = document.getElementById("feedbackMessage").value;

    const feedbackData = {
        name: feedbackName,
        message: feedbackMessage,
    };

    // Use EmailJS to send the feedback email
    emailjs.send("service_hayslck", "YOUR_TEMPLATE_ID", feedbackData, "YOUR_USER_ID")
        .then((response) => {
            alert("Feedback sent successfully!");
            // Clear the form fields
            document.getElementById("feedbackName").value = "";
            document.getElementById("feedbackMessage").value = "";
            closeFeedbackModal();
        }, (error) => {
            alert("Failed to send feedback. Please try again later.");
        });
}

// Event listener for feedback form submission
feedbackForm.addEventListener("submit", sendFeedback);

// Event listener for closing the feedback modal
closeFeedbackBtn.addEventListener("click", closeFeedbackModal);

// Trigger the feedback modal only when the "Give Feedback" button is clicked
document.getElementById("giveFeedbackBtn").addEventListener("click", showFeedbackModal);



