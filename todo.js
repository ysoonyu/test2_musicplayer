// Array to hold the to-do items
let todoItems = [];

// Function to add a new to-do item
function addTodoItem(item, time) {
    if (item) {
        const todo = { item, time };
        todoItems.push(todo);
        renderTodoList();
        setReminder(time, item); // Set reminder
    }
}

// Function to remove a to-do item
function removeTodoItem(index) {
    todoItems.splice(index, 1);
    renderTodoList();
}

// Function to render the to-do list
function renderTodoList() {
    const todoList = document.getElementById('todoListItems');
    todoList.innerHTML = ''; // Clear the current list

    todoItems.forEach((todo, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${todo.item} - Due: ${todo.time}`;

        // Create a remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeTodoItem(index);

        listItem.appendChild(removeButton);
        todoList.appendChild(listItem);
    });
}

// Function to set a reminder
function setReminder(time, item) {
    const reminderTime = new Date(time).getTime();
    const now = new Date().getTime();
    const delay = reminderTime - now;

    if (delay > 0) {
        setTimeout(() => {
            alert(`Reminder: ${item} is due!`);
        }, delay);
    }
}

// Event listener for adding a new to-do item
document.getElementById('addTodoButton').addEventListener('click', () => {
    const todoInput = document.getElementById('todoInput');
    const timeInput = document.getElementById('timeInput'); // Assuming you have a time input field
    addTodoItem(todoInput.value, timeInput.value);
    todoInput.value = ''; // Clear the input field
    timeInput.value = ''; // Clear the time input field
});