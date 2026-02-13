'use client'

import { useBoardData } from '@/hooks/use-board-data'
import { Column } from './column'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateTask } from '@/hooks/use-tasks'
import { Column as ColumnType } from '@/types/api'
import { useEffect, useState } from 'react'

export default function BoardView({ boardId }: { boardId: string }) {
    const { data: columns, isLoading, error } = useBoardData(boardId)
    const queryClient = useQueryClient()
    const { mutate: updateTask } = useUpdateTask()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === 'COLUMN') {
            // Column reordering logic would go here
            return;
        }

        if (type === 'TASK') {
            const sourceColId = source.droppableId;
            const destColId = destination.droppableId;

            // Optimistic update
            queryClient.setQueryData(['board', boardId], (oldData: ColumnType[] | undefined) => {
                if (!oldData) return oldData;

                // Deep clone to safely mutate
                const newColumns = JSON.parse(JSON.stringify(oldData)) as ColumnType[];

                const sourceCol = newColumns.find(c => String(c.id) === sourceColId);
                const destCol = newColumns.find(c => String(c.id) === destColId);

                if (!sourceCol || !destCol) return oldData;

                // Ensure tasks arrays exist
                if (!sourceCol.tasks) sourceCol.tasks = [];
                if (!destCol.tasks) destCol.tasks = [];

                // Remove from source
                const [movedTask] = sourceCol.tasks.splice(source.index, 1);

                // Update task's column_id if moving to updated column
                if (sourceColId !== destColId) {
                    movedTask.column_id = Number(destColId);
                }

                // Add to destination
                destCol.tasks.splice(destination.index, 0, movedTask);

                // Start: Calculate Position Logic inside the optimistic update to ensure consistency?
                // Actually, we just need to calculate it to send to API. 
                // The Optimistic UI just needs the order, which we just set.

                return newColumns;
            });

            // Calculate new position for API
            // We need to look at the *new* state to find neighbors.
            // Since we just updated the cache synchronously (if setQueryData is sync, which it is),
            // we can retrieve it or just re-calculate on the fly using the same logic.
            // Let's re-calculate on the fly to avoid re-fetching from cache immediately.

            // Note: We need the neighbors from the DESTINATION column.
            // We can get them from the `columns` prop? No, that's stale.
            // We'll use the functional update of setQueryData to capture the new state?
            // Or just do the logic carefully on a clone.

            // Let's re-clone from current `columns` (which is technically stale vs the setQueryData we just did? 
            // setQueryData updates the cache, `columns` from `useQuery` will update on next render.
            // So we can't use `columns` variable immediately here for the *new* order.

            // To solve this, we can calculate position *during* the clone operation or access the updated cache.
            const updatedData = queryClient.getQueryData<ColumnType[]>(['board', boardId]);
            if (!updatedData) return;

            const destCol = updatedData.find(c => String(c.id) === destColId);
            if (!destCol || !destCol.tasks) return;

            const movedTaskIndex = destination.index;
            const prevTask = destCol.tasks[movedTaskIndex - 1];
            const nextTask = destCol.tasks[movedTaskIndex + 1];

            let newPosition = 0;
            if (!prevTask && !nextTask) {
                newPosition = 10000;
            } else if (!prevTask) {
                newPosition = nextTask.position / 2;
            } else if (!nextTask) {
                newPosition = prevTask.position + 10000;
            } else {
                newPosition = (prevTask.position + nextTask.position) / 2;
            }

            updateTask({
                taskId: draggableId,
                payload: {
                    column_id: Number(destColId),
                    position: newPosition
                }
            });
        }
    }

    if (isLoading) return <div className="flex items-center justify-center h-full">Loading Board...</div>
    if (error) return <div className="flex items-center justify-center h-full text-red-500">Error loading board</div>
    if (!isMounted) return <div className="flex gap-6 overflow-x-auto pb-4 h-full px-4 md:px-6">Loading...</div>

    if (!columns || columns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <p className="text-gray-500 text-lg font-bold">This board is empty. Create a new column to get started.</p>
                <button className="bg-primary text-white px-6 py-3 rounded-full font-bold">+ Add New Column</button>
            </div>
        )
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="COLUMN">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-6 overflow-x-auto pb-4 h-full snap-x snap-mandatory px-4 md:px-6"
                    >
                        {columns.map((column, index) => (
                            <Column key={column.id} column={column} index={index} columns={columns} />
                        ))}
                        {provided.placeholder}

                        {/* "New Column" Placeholder Block */}
                        <div className="min-w-[280px] mt-10 shrink-0 bg-gray-200 dark:bg-gray-800/50 rounded-lg flex items-center justify-center cursor-pointer hover:text-primary transition-colors">
                            <h2 className="text-xl font-bold text-gray-500">+ New Column</h2>
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
