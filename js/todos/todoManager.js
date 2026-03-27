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
    const todo = localTodos.find(todo => todo._id.toString() === id.toString());
    console.log("localTodos ids:", localTodos.map(t => ({ id: t._id, type: typeof t._id })))
    console.log("id:", id, typeof id)
    const completed = !todo.completed
    console.log(completed)
    todo.completed = completed;
    renderAllTodos()
    updateEmptyStates()
    try {
        const synTodo = await patchTodo(id, { completed: completed });
        console.log(synTodo)
    } catch (error) {
        console.log(error)
    }
}

// Input & Add
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

addTaskBtn.addEventListener('click', () => addNewTask());

async function addNewTask() {
    const task = taskInput.value.trim();
    if (task.length === 0) return;

    const tempId = "temp-" + Math.random().toString(36).substring(2, 9);
    const newTaskObj = {
        _id: tempId,
        text: task,
        completed: false,
    }
    console.log(newTaskObj);
    localTodos.unshift(newTaskObj);
    renderAllTodos();
    taskInput.value = "";
    charCountEl.textContent = "0 / 100";
    charCountEl.classList.remove('text-warning', 'text-error');
    charCountEl.classList.add('text-base-content/40');

    try {
        const serverTodo = await postTodo(task);
        console.log(serverTodo);
        const updateArray = localTodos.map(task =>
            task._id === tempId ? serverTodo : task)
        updateLocalTodos(updateArray)
        renderAllTodos();
    } catch (error) {
        console.log(error);
        const updateArray = localTodos.filter(task => task._id !== tempId)
        updateLocalTodos(updateArray)
        renderAllTodos();
        alert("Failed to add Todo. Try it later again")
    }
}

// Charakter-Zähler
const charCountEl = document.getElementById('charCount');

taskInput.addEventListener('input', () => {
    const len = taskInput.value.length;
    charCountEl.textContent = `${len} / 100`;
    if (len >= 80) {
        charCountEl.classList.add('text-warning');
        charCountEl.classList.remove('text-base-content/40', 'text-error');
    }
    if (len >= 100) {
        charCountEl.classList.add('text-error');
        charCountEl.classList.remove('text-warning');
    }
    if (len < 80) {
        charCountEl.classList.remove('text-warning', 'text-error');
        charCountEl.classList.add('text-base-content/40');
    }
});

//  Delete 
const openList = document.getElementById('openTask');
const completedList = document.getElementById('completedList');

const handleDeleteClick = async (event) => {
    const deleteBtn = event.target.closest('.text-error');
    if (deleteBtn) {
        const todoId = deleteBtn.dataset.id;
        const liElement = deleteBtn.closest('li');
        liElement.remove()
        updateEmptyStates()
        try {
            const success = await deleteTodo(todoId);
            if (success) {
                const updateArray = localTodos.filter(t => t._id !== todoId)
                updateLocalTodos(updateArray)
            }
        } catch (error) {
            renderAllTodos();
            console.log(error);
            alert("Failed to delete Todo. Try it later again")
        }
    }
}

//  Edit 
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
        const success = await patchTodo(editingTodo._id, { text: newTodoText });
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

document.getElementById('cancelEdit').addEventListener('click', () => toggleEditModal())
document.getElementById('saveEdit').addEventListener('click', () => saveEditTodo())

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleEditModal()
});

openList.addEventListener('click', (e) => { handleDeleteClick(e); handleEditClick(e) });
completedList.addEventListener('click', (e) => { handleDeleteClick(e); handleEditClick(e) });

document.getElementById('clearCompleted').addEventListener('click', async () => {
    const completedTodos = localTodos.filter(t => t.completed === true);
    const remaining = localTodos.filter(t => t.completed === false);

    updateLocalTodos(remaining);
    renderAllTodos();
    updateEmptyStates();

    try {
        await Promise.all(completedTodos.map(t => deleteTodo(t._id)));
        // Promise.all startet ALLE delete -Requests auf einmal(parallel)
        //    statt einen nach dem anderen (nacheinander)
    } catch (error) {
        console.log(error);
        updateLocalTodos([...remaining, ...completedTodos]);
        renderAllTodos();
        alert("Failed to clear completed todos. Try again later.");
    }
});

export function updateEmptyStates() {
    const noOpentaskEl = document.getElementById('noOpenTask');
    const noCompletedEl = document.getElementById('noCompletedTask');
    const openCountBadge = document.getElementById('openCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');

    const hasOpen = localTodos.some(t => t.completed === false);
    const hasCompleted = localTodos.some(t => t.completed === true);
    const openCount = localTodos.filter(t => t.completed === false).length;

    if (!noOpentaskEl || !noCompletedEl) {
        console.error('Empty state elements nicht gefunden!');
        return;
    }

    if (hasOpen) {
        noOpentaskEl.classList.add('hidden');
        openCountBadge.textContent = openCount;
        openCountBadge.classList.remove('hidden');
    } else {
        noOpentaskEl.classList.remove('hidden');
        openCountBadge.classList.add('hidden');
    }

    if (hasCompleted) {
        noCompletedEl.classList.add('hidden');
        clearCompletedBtn.classList.remove('hidden');
    } else {
        noCompletedEl.classList.remove('hidden');
        clearCompletedBtn.classList.add('hidden');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}