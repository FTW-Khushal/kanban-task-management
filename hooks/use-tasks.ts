
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { CreateTaskDto, CreateSubtaskDto, CreateTaskFormValues, Task } from '@/types/api'

/**
 * EXPLANATION OF MUTATIONS
 * 
 * In TanStack Query, a "Mutation" is used to Create, Update, or Delete data 
 * (unlike a "Query" which is used to Read data).
 * 
 * Key concepts:
 * 1. mutationFn: The asynchronous function that performs the request (e.g., fetch, axios).
 * 2. onSuccess: A callback that runs if the request succeeds. We use this to tell
 *    TanStack Query that our local data is now "stale" (outdated) and needs to be re-fetched.
 * 3. invalidateQueries: This is the magic. By invalidating ['columns'], we tell
 *    Query to re-run the `useBoardData` query. This automatically updates 
 *    the UI with the new task without us manually manipulating the state array!
 */

export function useCreateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newTask: CreateTaskFormValues) => {
            // Map form values to API DTO
            const taskPayload: CreateTaskDto = {
                title: newTask.title,
                description: newTask.description,
                column_id: newTask.columnId,
                position: newTask.position,
                subtasks: newTask.subtasks.map(s => ({
                    title: s.title,
                    is_completed: s.isCompleted
                }))
            }

            // Single efficient request!
            return apiClient.post('/tasks', taskPayload)
        },

        onSuccess: () => {
            // Invalidate the board query to refresh UI
            queryClient.invalidateQueries({ queryKey: ['board'] })
        },
    })
}

export function useUpdateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ taskId, payload }: { taskId: string; payload: any }) => {
            console.log("Task updated successfully ===========> " + taskId + "\n " + JSON.stringify(payload))
            return apiClient.patch(`/tasks/${taskId}`, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board'] })
        }
    })
}

export function useToggleSubtask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ subtaskId, isCompleted }: { subtaskId: string; isCompleted: boolean }) => {
            return apiClient.patch(`/subtasks/${subtaskId}`, { is_completed: isCompleted })
        },
        onMutate: async ({ subtaskId, isCompleted }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['board'] })

            // Snapshot the previous value
            const previousBoardData = queryClient.getQueriesData({ queryKey: ['board'] })

            // Optimistically update to the new value
            queryClient.setQueriesData({ queryKey: ['board'] }, (oldData: any) => {
                if (!oldData || !Array.isArray(oldData)) return oldData

                // We need to find the subtask in the deeply nested structure: Column -> Task -> Subtask
                return oldData.map((column: any) => ({
                    ...column,
                    tasks: column.tasks?.map((task: any) => ({
                        ...task,
                        subtasks: task.subtasks?.map((subtask: any) => {
                            if (subtask.id === subtaskId) {
                                return { ...subtask, is_completed: isCompleted }
                            }
                            return subtask
                        })
                    }))
                }))
            })

            // Return a context object with the snapshot value
            return { previousBoardData }
        },
        onError: (err, newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousBoardData) {
                context.previousBoardData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['board'] })
        }
    })
}

// Placeholder for future updates
// export function useUpdateTask() { ... }
