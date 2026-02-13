import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBoards } from '@/lib/queries'
import { apiClient } from '@/lib/api-client'
import { CreateBoardDto, UpdateBoardDto } from '@/types/api'

export function useBoards() {
    return useQuery({
        queryKey: ['boards'],
        queryFn: getBoards,
    })
}

export function useCreateBoard() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newBoard: CreateBoardDto) => {
            return apiClient.post('/boards', newBoard)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
        },
    })
}

export function useUpdateBoard() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ boardId, payload }: { boardId: string; payload: UpdateBoardDto }) => {
            return apiClient.patch(`/boards/${boardId}`, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
            queryClient.invalidateQueries({ queryKey: ['board'] })
        },
    })
}

export function useDeleteBoard() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (boardId: string) => {
            return apiClient.delete(`/boards/${boardId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] })
        },
    })
}
