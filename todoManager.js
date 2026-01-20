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

