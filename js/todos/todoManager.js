import { fetchAllTodos, getCompletedTodos, getOpenTodos, localTodos, postTodo, updateLocalTodos } from "./todoService.js";
import { renderTodoList } from "./todoUI.js";

async function init() {
    await fetchAllTodos();
    renderAllTodos()
}

function renderAllTodos() {
    renderTodoList(getOpenTodos(), 'openTask', handleTodoClick);
    renderTodoList(getCompletedTodos(), 'completedList', handleTodoClick);
}



export function handleTodoClick(id) {
    console.log("CLICK ERKANNT! ID:", id);
    const todo = localTodos.find(todo => todo._id === id);

    todo.completed = !todo.completed;
    console.log("Rendere Listen...");
    renderAllTodos()
}

//handleTodoClick('696cf50bb7222e1da92147b6');

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask')
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});
addTaskBtn.addEventListener('click', () => addNewTask())

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
init();