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
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                await refreshToken()
            }
            else {
                throw new Error(data.message || data.error || 'Failed to fetch todos');
            }
            throw new Error('Failed to load todos');
        }
        const data = await response.json() // man muss wait machen, das es sozusagen 'ausspackt'

        console.log(data)
        localTodos.unshift(...data)
        console.log(localTodos)
        //return data
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch data');
    }
}
async function refreshToken() {
};