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
        const synTodo = await patchTodo(id, completed);
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

        const updateArray = localTodos.filter(t =>
            t._id !== todoId)
        updateLocalTodos(updateArray)

        liElement.remove()

        updateEmptyStates()

        try {
            const data = await deleteTodo(todoId);
        } catch (error) {
            console.log(error);
            alert("Failed to delte Todo. Try it later again")
        }
    }
}

openList.addEventListener('click', handleDelteClick);
completedList.addEventListener('click', handleDelteClick);

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