import { refreshToken } from "../authHelper.js"

const url = 'http://localhost:3000/todos'
export const localTodos = [
]
console.log(localTodos)
export function getOpenTodos() {
    return localTodos.filter(todo => todo.completed === false)
}
export function getCompletedTodos() {
    return localTodos.filter(todo => todo.completed === true)
}
//console.log(getOpenTodos());

export async function fetchAllTodos() {
    try {
        let response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });


        if (response.status === 401) {
            console.log('accestoken abgelaufen. Veruchen das accestoken zu refreshen...')
            const refreshSucces = await refreshToken();
            if (refreshSucces) {
                response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                });
            }
        }
        if (!response.ok) {
            throw new Error(data.message || data.error || `Fehler: ${response.status}`);
        }
        const data = await response.json() // man muss wait machen, das es sozusagen 'ausspackt'

        console.log(data)
        localTodos.unshift(...data)
        console.log(localTodos)
        //return data
    } catch (error) {
        throw new Error(error.message || 'Fehler in FetchTodos'); // immer mit || da es irgendwie sein kann das ich error msg vergessen hat aber man trotzdem einen error bekommt
    }
}
