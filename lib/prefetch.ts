import { QueryKey, QueryFunction } from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'

/**
 * Prefetches data for the server. Swallows errors to allow page rendering to continue.
 * Use this for non-critical data. The client will attempt to refetch if the data is missing.
 * 
 * @example
 * await prefetchQuery(['tasks'], getTasks)
 */
export async function prefetchQuery(queryKey: QueryKey, queryFn: QueryFunction) {
    const queryClient = getQueryClient()
    try {
        await queryClient.prefetchQuery({
            queryKey,
            queryFn,
        })
    } catch (error) {
        console.error(`Prefetch failed for key ${JSON.stringify(queryKey)}:`, error)
    }
}

/**
 * Fetches data for the server. Throws errors to block page rendering.
 * Use this for critical data where you want to show a 404 or error page if the fetch fails.
 * 
 * @example
 * try {
 *   await fetchQuery(['board', id], () => getBoard(id))
 * } catch (e) {
 *   notFound()
 * }
 */
export async function fetchQuery<TData = unknown>(queryKey: QueryKey, queryFn: QueryFunction<TData>) {
    const queryClient = getQueryClient()
    await queryClient.fetchQuery({
        queryKey,
        queryFn,
    })
}
