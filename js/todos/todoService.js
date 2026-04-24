import { refreshToken } from "../authHelper.js"
import { apiBase } from "../config/api.js";
import { renderAllTodos } from "./todoManager.js";
const url = `${apiBase}/todos`
export let localTodos = [
]
export function updateLocalTodos(newArray) {
    localTodos = newArray;
};
export function getOpenTodos() {
    return localTodos.filter(todo => todo.completed === false)
}
export function getCompletedTodos() {
    return localTodos.filter(todo => todo.completed === true)
}

export async function fetchAllTodos() {
    try {
        let response = await fetch(`${url}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            console.log('accestoken abgelaufen. Veruchen das accestoken zu refreshen...')
            const refreshSucces = await refreshToken();
            if (refreshSucces) {
                response = await fetch(`${url}`, {
                    method: 'GET',
                    credentials: 'include'
                });
            }
        }
        if (!response.ok) {
            throw new Error(data.message || data.error || `Fehler: ${response.status}`);
        }
        const data = await response.json() // man muss wait machen, das es sozusagen 'ausspackt'
        localTodos.unshift(...data)
        console.log(localTodos)
    } catch (error) {
        throw new Error(error.message || 'Fehler in FetchTodos'); // immer mit || da es irgendwie sein kann das ich error msg vergessen hat aber man trotzdem einen error bekommt
    }
}
export async function postTodo(newTodo) {
    try {
        let response = await fetch(`${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ text: newTodo })
        });

        if (response.status === 401) {
            console.log('accestoken abgelaufen. Veruchen das accestoken zu refreshen...')
            const refreshSucces = await refreshToken();
            if (refreshSucces) {
                response = await fetch(`${url}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(newTodo)
                });
            }
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || `Fehler: ${response.status}`)
        }
        console.log('Create-Todo data', data);
        return data.NewTodo
    } catch (error) {
        throw new Error("Create Todo Failed", error)
    }
}
export async function patchTodo(id, uptdates) {
    try {
        let response = await fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(uptdates)
        });

        if (response.status === 401) {
            console.log('accestoken abgelaufen. Veruchen das accestoken zu refreshen...')
            const refreshSucces = await refreshToken();
            if (refreshSucces) {
                response = await fetch(`${url}/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(uptdates)
                });
            }
        }
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message || data.error || `Fehler: ${response.status}`)
        }

        return data
    } catch (error) {
        throw new Error("Patch Todo Failed", error);

    }
}
export async function deleteTodo(id) {
    try {
        let response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.status === 401) {
            console.log('Access-Token abgelaufen. Versuche Refresh...');
            const refreshSuccess = await refreshToken();

            if (refreshSuccess) {
                response = await fetch(`${url}/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
            }
        }
        if (!response.ok) {
            throw new Error(errorData.message || errorData.error || `Fehler beim Löschen: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Delete Todo Failed:", error);
        throw error;
    }
}
export async function handleDeleteAllTasks() {
    const previousTodos = [...localTodos];

    try {
        updateLocalTodos([]);
        renderAllTodos();

        const fetchOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        };

        let response = await fetch(`${url}/deleteAll`, fetchOptions);

        if (response.status === 401) {
            console.log('Access-Token abgelaufen. Versuche Refresh...');
            const refreshSuccess = await refreshToken();
            if (refreshSuccess) {
                response = await fetch(`${url}/deleteAll`, fetchOptions);
            }
        }

        const data = await response.json();

        //Rollback Auslösen
        if (!response.ok) {
            throw new Error(data.error || data.message || `Fehler: ${response.status}`);
        }

        console.log("Sucsess:", data.message);
        return data;

    } catch (error) {
        // ROLLBACK: alles wiederherrstellen 
        console.error("Delete All Failed: Rollback ist auch aktiv:", error);

        updateLocalTodos(previousTodos); // Alte Daten zurückschreiben
        renderAllTodos();

        alert(`Deletion failed: ${error.message}`);
        throw error;
    }
}