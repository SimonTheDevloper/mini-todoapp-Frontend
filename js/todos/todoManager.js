import { deleteTodo, fetchAllTodos, getCompletedTodos, getOpenTodos, localTodos, patchTodo, postTodo, updateLocalTodos } from "./todoService.js";
import { renderTodoList } from "./todoUI.js";

async function init() {
    const loader = document.getElementById('globalLoader');

    loader.classList.remove('hidden')
    document.getElementById('noOpenTask').classList.add('hidden');
    document.getElementById('noCompletedTask').classList.add('hidden')

    try {
        await fetchAllTodos();
        renderAllTodos()
    } catch (error) {
        console.log('Inizialisierung failed:', error)
    } finally {
        loader.classList.add('hidden');
        updateEmptyStates()
    }

}

function renderAllTodos() {
    renderTodoList(getOpenTodos(), 'openTask', handleTodoClick);
    renderTodoList(getCompletedTodos(), 'completedList', handleTodoClick);
}


export async function handleTodoClick(id) {
    //console.log("CLICK ERKANNT! ID:", id);
    const todo = localTodos.find(todo => todo._id === id);
    const completed = !todo.completed
    console.log(completed)
    todo.completed = completed;
    //console.log("Rendere Listen...");
    renderAllTodos()

    try {
        const synTodo = await patchTodo(id, { completed: completed });
        console.log(synTodo)
    } catch (error) {
        console.log(error)
    }
}


const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask')
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});
addTaskBtn.addEventListener('click', () => addNewTask());


async function addNewTask() {
    const task = taskInput.value.trim();
    if (task.length === 0) {
        return;
    }
    const tempId = "temp-" + Math.random().toString(36).substring(2, 9); // für später schon ein temp-id
    const newTaskObj = {
        _id: tempId,
        text: task,
        completed: false,
    }
    console.log(newTaskObj);
    localTodos.unshift(newTaskObj); // unshift, da es am anfang des array kommen soll
    renderAllTodos();
    taskInput.value = "";

    try {
        const serverTodo = await postTodo(task);
        console.log(serverTodo);
        const updateArray = localTodos.map(task =>
            task._id === tempId ? serverTodo : task) // falls todo id die gleiche ist wie vom server ersetzte sie mit dem richtigen ganten server objekt. Wenn nicht lass es so
        updateLocalTodos(updateArray)
        renderAllTodos();
    } catch (error) {
        console.log(error);
        const updateArray = localTodos.filter(task => task._id !== tempId) // wir behalten alle die nicht das "neue" Todo sind und das todo ist wieder weg
        updateLocalTodos(updateArray)
        alert("Failed to add Todo. Try it later again")
    }

}
const openList = document.getElementById('openTask');
const completedList = document.getElementById('completedList');

const handleDelteClick = async (event) => {
    const delteBtn = event.target.closest('.text-error'); // ja das ist eine CSS klasse von dem Button

    if (delteBtn) {
        const todoId = delteBtn.dataset.id;
        const liElement = delteBtn.closest('li');

        liElement.remove()
        updateEmptyStates()

        try {
            const sucsess = await deleteTodo(todoId);
            if (sucsess) {
                const updateArray = localTodos.filter(t =>
                    t._id !== todoId)
                updateLocalTodos(updateArray)
            }
        } catch (error) {
            renderAllTodos();
            console.log(error);
            alert("Failed to delte Todo. Try it later again")
        }
    }
}

let editingTodo = null;

const handleEditClick = (event) => {
    const editBtn = event.target.closest('.edit');
    if (!editBtn) return;

    const todoId = editBtn.dataset.id;
    editingTodo = localTodos.find(t => t._id === todoId);
    console.log(todoId)
    console.log(editingTodo)



    document.getElementById('editInput').value = editingTodo.text;
    toggleEditModal(true);
};
function toggleEditModal(show) {
    const modal = document.getElementById('editModal')
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}
async function saveEditTodo() {
    const newTodoText = document.getElementById('editInput').value.trim();
    const todoId = editingTodo._id;
    const originalTodo = { ...editingTodo };
    if (newTodoText === editingTodo.text) {
        console.log('gleich')
        return toggleEditModal();
    }
    const updatedTodos = localTodos.map(todo =>
        todo._id === todoId ? { ...todo, text: newTodoText } : todo
    );
    updateLocalTodos(updatedTodos);
    renderAllTodos();
    toggleEditModal();
    try {
        const sucsess = await patchTodo(editingTodo._id, { text: newTodoText });
        if (sucsess) {
            const updateArray = localTodos.filter(t =>
                t._id !== todoId)
            updateLocalTodos(updateArray)
        }
    } catch (error) {
        console.log(error);
        const rollbackTodos = localTodos.map(todo =>
            todo._id === todoId ? originalTodo : todo
        );
        updateLocalTodos(rollbackTodos);
        renderAllTodos();
        alert("Failed to edit Todo. Try it later again")
    }
}


document.getElementById('cancelEdit').addEventListener('click', () => { toggleEditModal() })
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        toggleEditModal()
    }
});
document.getElementById('saveEdit').addEventListener('click', () => saveEditTodo())


openList.addEventListener('click', (e) => { handleDelteClick(e), handleEditClick(e) });
completedList.addEventListener('click', (e) => { handleDelteClick(e), handleEditClick(e) });

export function updateEmptyStates() {
    const noOpentaskEl = document.getElementById('noOpenTask');
    const noCompletedEl = document.getElementById('noCompletedTask');

    const hasOpen = localTodos.some(t => t.completed === false);
    const hasCompleted = localTodos.some(t => t.completed === true);
    if (!noOpentaskEl || !noCompletedEl) {
        console.error('Empty state elements nicht gefunden!');
        return;
    }
    if (hasOpen) {
        noOpentaskEl.classList.add('hidden');
    } else {
        noOpentaskEl.classList.remove('hidden');
    };

    if (hasCompleted) {
        noCompletedEl.classList.add('hidden');
    } else {
        noCompletedEl.classList.remove('hidden');
    };

}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}