
const BASE_URL = 'http://localhost:3001'

export const apiClient = {
    get: async <T>(endpoint: string): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`)
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`)
        }
        return res.json()
    },
    post: async <T>(endpoint: string, body: any): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        if (!res.ok) {
            const errorBody = await res.text()
            console.error('API Post Error:', res.status, res.statusText, errorBody)
            throw new Error(`API Error: ${res.statusText} ${errorBody}`)
        }
        return res.json()
    },
    patch: async <T>(endpoint: string, body: any): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`)
        }
        return res.json()
    },
    delete: async <T>(endpoint: string): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
        })
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`)
        }
        return res.json()
    }
}
