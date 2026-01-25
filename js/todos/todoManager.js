import { fetchAllTodos, getCompletedTodos, getOpenTodos, localTodos } from "./todoService.js";
import { data } from "../data/testDaten.js";
import { renderTodoList } from "./todoUI.js";

fetchAllTodos();
function renderAllTodos() {
    renderTodoList(getOpenTodos(), 'openTask', handleTodoClick);
    renderTodoList(getCompletedTodos(), 'completedList', handleTodoClick);
}
renderAllTodos()


export function handleTodoClick(id) {
    console.log("CLICK ERKANNT! ID:", id);
    const todo = data.find(todo => todo._id === id);

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

function addNewTask() {
    const task = taskInput.value.trim();
    if (task.length === 0) {
        return;
    }
    const newTaskObj = {
        _id: "temp-" + Math.random().toString(36).substring(2, 9), // für später schon ein temp-id
        text: task,
        completed: false,
        tags: [],
        priority: "Low",
        date: new Date().toISOString() // macht das zu dem richtigen string den man auch in mongoDB hat
    }
    console.log(newTaskObj);
    data.unshift(newTaskObj); // unshift, da es am anfang des array kommen soll
    renderAllTodos();
    taskInput.value = "";
}
