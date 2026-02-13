import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useResetDb() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            return apiClient.post('/database/reset', {})
        },
        onSuccess: () => {
            // Invalidate all queries to refresh the UI with default data
            queryClient.invalidateQueries()
        },
    })
}
