import { apiClient } from '@/lib/api-client'
import { Board } from '@/types/api'

export async function getBoards() {
    return apiClient.get<Board[]>('/boards')
}

export async function getBoardColumns(boardId: string | null) {
    if (!boardId) return []
    const board = await apiClient.get<Board>(`/boards/${boardId}`)
    return board.columns || []
}
