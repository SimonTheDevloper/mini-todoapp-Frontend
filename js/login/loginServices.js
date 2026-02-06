import { apiBase } from "../config.js/api.js";

const url = `${apiBase}/user`

export async function createNewUser(newUser) {
    try {
        const response = await fetch(`${url}/register`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser),

        })
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Registration failed')
        }
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 1000);
    } catch (err) {
        console.error(err)
        throw new Error(err.message || 'Failed to create user ')
    }
}
export async function loginUser(user) {
    try {
        const response = await fetch(`${url}/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),

        })
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(data.message || data.error || "Login failed");
        }
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 2000);
    } catch (err) {
        console.error('created user error:', err);
        throw new Error(err.message || 'Failed to login user')
    }
}