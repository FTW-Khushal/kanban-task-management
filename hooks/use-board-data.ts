// This hook is used to fetch the columns for a specific board
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Column, Board } from '@/types/api'

import { Task } from '@/types/api'

export function useBoardData(boardId: string | null) {
    return useQuery({
        queryKey: ['board', boardId],
        queryFn: async () => {
            const board = await apiClient.get<Board>(`/boards/${boardId}`)
            return board.columns || []
        },
        enabled: !!boardId,
    })
}
