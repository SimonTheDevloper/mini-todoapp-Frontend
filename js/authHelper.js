const url = '/api/user'
export async function refreshToken() {
    try {
        const response = await fetch(`${url}/refresh`, {
            method: 'POST',
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Refresh Token failed')
        }
        return true
    } catch (error) {
        throw new Error('Refresh token error' || error)

    }
};