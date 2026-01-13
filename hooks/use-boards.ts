import { useQuery } from '@tanstack/react-query'
import { getBoards } from '@/lib/queries'

export function useBoards() {
    return useQuery({
        queryKey: ['boards'],
        queryFn: getBoards,
    })
}
