const url = 'http://localhost:3000/todos'
export const localTodos = [
    [
        {
            "_id": "696cf50bb7222e1da92147b6",
            "text": "Mäppchen ordnen",
            "completed": true,
            "tags": [
                "Schule"
            ],
            "priority": "Medium",
            "userId": "69692ffb3e0f0084a5e99167",
            "date": "2026-01-18T14:58:19.055Z",
            "__v": 0
        },
        {
            "_id": "696cf4e9b7222e1da92147b4",
            "text": "Physik lernen",
            "completed": false,
            "tags": [
                "Schule"
            ],
            "priority": "High",
            "userId": "69692ffb3e0f0084a5e99167",
            "date": "2026-01-18T14:57:45.722Z",
            "__v": 0
        },
        {
            "_id": "696cf4dcb7222e1da92147b2",
            "text": "Mathe machen",
            "completed": false,
            "tags": [
                "Schule"
            ],
            "priority": "High",
            "userId": "69692ffb3e0f0084a5e99167",
            "date": "2026-01-18T14:57:32.360Z",
            "__v": 0
        },
        {
            "_id": "696bed328ed0011efcb767b9",
            "text": "refreshToken",
            "completed": false,
            "tags": [],
            "priority": "Low",
            "userId": "69692ffb3e0f0084a5e99167",
            "date": "2026-01-17T20:12:34.722Z",
            "__v": 0
        },
        {
            "_id": "696936ba3e0f0084a5e99173",
            "text": "Test-4",
            "completed": false,
            "tags": [],
            "priority": "Low",
            "userId": "69692ffb3e0f0084a5e99167",
            "date": "2026-01-15T18:49:30.086Z",
            "__v": 0
        }
    ]
]

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
            throw new Error('Failed to load todos');
        }
        const todos = await response.json() // man muss wait machen, das es sozusagen 'ausspackt'
        console.log(todos)
        return todos
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch data');
    }
}
async function refreshToken() {
}