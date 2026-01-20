import { getCompletedTodos, getOpenTodos } from "./script.js";

const openTodos = getOpenTodos();
const completedTodos = getCompletedTodos();

function renderTodoList(todos, elementId) {

    todos.forEach(todo => {
        const liste = document.getElementById(elementId);
        const li = document.createElement('li');
        li.dataset.id = todo._id;
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        const span = document.createElement('span');
        span.textContent = todo.text;
        label.append(checkbox, span);
        li.appendChild(label);
        liste.appendChild(li);
    });
}
renderTodoList(openTodos, 'openTask')
renderTodoList(completedTodos, 'completedList')

