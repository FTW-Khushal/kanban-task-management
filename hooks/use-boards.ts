
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Board } from '@/types/api'

export function useBoards() {
    return useQuery({
        queryKey: ['boards'],
        queryFn: () => apiClient.get<Board[]>('/boards'),
    })
}
