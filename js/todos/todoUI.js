import { updateEmptyStates } from "./todoManager.js";

export function renderTodoList(todos, elementId, clickHandler) {
    const liste = document.getElementById(elementId);
    liste.innerHTML = "";

    todos.forEach((todo) => {
        const li = document.createElement("li");
        li.dataset.id = todo._id;
        li.className = "flex items-center p-2 bg-base-100 rounded-lg border border-base-200 hover:border-base-300 cursor-pointer transition-colors";

        const label = document.createElement("label");
        label.className = "flex items-center gap-3 cursor-pointer flex-1 min-w-0";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox checkbox-primary";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => {
            clickHandler(todo._id);
        });

        const span = document.createElement("span");
        span.textContent = todo.text;
        span.className = "text-base-content flex-1 min-w-0 break-words";

        const editBtn = document.createElement("button");
        editBtn.dataset.id = todo._id;
        editBtn.className = "btn btn-sm btn-ghost opacity-50 hover:opacity-100 transition-opacity edit";
        const editIcon = document.createElement("i");
        editIcon.className = "fa-solid fa-pen-to-square";
        editBtn.appendChild(editIcon);

        const delteBtn = document.createElement("button");
        delteBtn.dataset.id = todo._id;
        delteBtn.className = "btn btn-sm btn-ghost text-error opacity-50 hover:opacity-100 transition-opacity";
        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash-can";
        delteBtn.appendChild(trashIcon);

        const btnContainer = document.createElement('div');
        btnContainer.className = "flex gap-1 ml-auto items-start border border-base-300 rounded-lg bg-base-200 hover:bg-base-300 transition-colors shrink-0";
        btnContainer.append(editBtn, delteBtn);

        label.append(checkbox, span);
        li.append(label, btnContainer);
        liste.appendChild(li);
    });

    updateEmptyStates();
}