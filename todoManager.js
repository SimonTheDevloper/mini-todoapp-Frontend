import { getCompletedTodos, getOpenTodos } from "./script.js";
import { data } from "./testDaten.js";

console.log(data)
function renderTodoList(todos, elementId) {
    const liste = document.getElementById(elementId);
    liste.innerHTML = "" // ganz wichtig löschen damit keine duplicate entsehen!!!!!!!!!!
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo._id;
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("click", () => {
            handleTodoClick(todo._id,)
        });
        const span = document.createElement('span');
        span.textContent = todo.text;
        label.append(checkbox, span);
        li.appendChild(label);
        liste.appendChild(li);
    });
}
renderTodoList(getOpenTodos(), 'openTask');
renderTodoList(getCompletedTodos(), 'completedList');


function handleTodoClick(id) {
    console.log("CLICK ERKANNT! ID:", id);  // ← Sie
    const todo = data.find(todo => todo._id === id);

    todo.completed = !todo.completed;
    console.log("Rendere Listen...");
    renderTodoList(getOpenTodos(), 'openTask');
    renderTodoList(getCompletedTodos(), 'completedList');
}

handleTodoClick('696cf50bb7222e1da92147b6');

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask')
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});
addTaskBtn.addEventListener('click', () => addNewTask())

function addNewTask() {
    const task = taskInput.value.trim();
    if (task.length === 0) {
        return;
    }
    const newTaskObj = {
        _id: Math.random().toString(36),
        text: task,
        completed: false,
        tags: [],
        priority: "Low",
        date: new Date().toISOString() // macht das zu dem richtigen string den man auch in mongoDB hat
    }
    console.log(newTaskObj)
}
