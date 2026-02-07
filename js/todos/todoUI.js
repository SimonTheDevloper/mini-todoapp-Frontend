import { updateEmptyStates } from "./todoManager.js";

export function renderTodoList(todos, elementId, clickHandler) {
    // jetzt clickhandler als callbackk
    const liste = document.getElementById(elementId);
    liste.innerHTML = ""; // ganz wichtig löschen damit keine duplicate entsehen!!!!!!!!!!
    todos.forEach((todo) => {
        const li = document.createElement("li");
        li.dataset.id = todo._id;
        li.className =
            "flex items-center p-2 py-2 bg-base-100 rounded-lg border-1 border-gray-100 hover:border-gray-200 cursor-pointer";
        const label = document.createElement("label");
        label.className = "flex gap-2";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox ";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
            clickHandler(todo._id);
        });
        const span = document.createElement("span");
        span.textContent = todo.text;
        span.className = "text-gray-700 flex-1";
        label.append(checkbox, span);
        li.appendChild(label);
        liste.appendChild(li);
    });

    updateEmptyStates();
}