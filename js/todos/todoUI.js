export function renderTodoList(todos, elementId, clickHandler) { // jetzt clickhandler als callbackk
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
            clickHandler(todo._id,)
        });
        const span = document.createElement('span');
        span.textContent = todo.text;
        label.append(checkbox, span);
        li.appendChild(label);
        liste.appendChild(li);
    });
}