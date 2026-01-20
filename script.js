import { data } from "/testDaten.js";

export function getOpenTodos() {
    return data.filter(todo => todo.completed === false)
}
export function getCompletedTodos() {
    return data.filter(todo => todo.completed === true)
}
console.log(getOpenTodos());

