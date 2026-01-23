const url = "http://localhost:3000/user"

export async function createNewUser(newUser) {
    try {
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newUser })
        })
        const data = await response.JSON();
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}