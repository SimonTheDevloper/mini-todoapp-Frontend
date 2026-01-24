const url = "http://localhost:3000/user"

export async function createNewUser(newUser) {
    try {
        const response = await fetch(`${url}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser),
            credentials: 'include',
        })
        const data = await response.json();
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}
export async function loginUser(user) {
    try {
        const response = await fetch(`${url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include',
        })
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }
        return data
    } catch (err) {
        console.error('created user error:', err);
        throw new Error(err.message || 'Failed to create user')
    }
}