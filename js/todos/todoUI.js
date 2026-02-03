export function renderTodoList(todos, elementId, clickHandler) {
    // jetzt clickhandler als callbackk
    const liste = document.getElementById(elementId);
    if (!todos || todos.length === 0) {
        liste.innerHTML = `<div class="text-center py-8 text-gray-400 opacity-60">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                <p class="text-sm">Nothing completed yet</p>
                            </div>`;
        return
    }
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
}
