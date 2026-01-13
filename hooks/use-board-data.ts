// This hook is used to fetch the columns for a specific board
import { useQuery } from '@tanstack/react-query'
import { getBoardColumns } from '@/lib/queries'

export function useBoardData(boardId: string | null) {
    return useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoardColumns(boardId),
        enabled: !!boardId,
    })
}
