import { getCompletedTodos, getOpenTodos } from "./script.js";

const openTodos = getOpenTodos();
const completedTodos = getCompletedTodos();



function renderTodos() {
    const openTaskliste = document.getElementById('openTask');
    openTodos.forEach((todo => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        const span = document.createElement('span');
        span.textContent = todo.text;
        label.append(checkbox, span);
        li.appendChild(label);
        openTaskliste.appendChild(li);
    }));

    const completedTaskListe = document.getElementById('completedList');

    completedTodos.forEach((todo => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        const span = document.createElement('span');
        span.textContent = todo.text;
        label.append(checkbox, span);
        li.appendChild(label);
        completedTaskListe.appendChild(li);
    }));

};
renderTodos();