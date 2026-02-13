import React, { useState } from 'react'
import { Column as ColumnType } from '@/types/api'
import { TaskDetailsDialog } from './task-details-dialog'
import { EditTaskFormDialog } from './edit-task-form-dialog'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { TaskCard } from './task-card'

// Temporary random colors for columns until we have real data/design
const DOT_COLORS = ['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-red-400']

export function Column({ column, index, columns }: { column: ColumnType; index: number; columns: ColumnType[] }) {
    const colorClass = DOT_COLORS[index % DOT_COLORS.length]
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

    const selectedTask = selectedTaskId ? column.tasks?.find(t => t.id === selectedTaskId) || null : null;
    const editingTask = editingTaskId ? column.tasks?.find(t => t.id === editingTaskId) || null : null;

    const handleEditTask = (taskId: string) => {
        setSelectedTaskId(null) // Close details dialog
        setEditingTaskId(taskId) // Open edit dialog
    }

    return (
        <Draggable draggableId={String(column.id)} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="w-[280px] shrink-0"
                >
                    <div
                        {...provided.dragHandleProps}
                        className="flex items-center gap-2 mb-6"
                    >
                        <div className={`w-4 h-4 rounded-full ${colorClass}`} />
                        <h2 className="text-xs font-bold tracking-[2.4px] text-gray-500 uppercase">
                            {column.name} ({column.tasks?.length || 0})
                        </h2>
                    </div>

                    <Droppable droppableId={String(column.id)} type="TASK">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex flex-col gap-3 min-h-[500px] transition-colors ${snapshot.isDraggingOver ? 'bg-gray-100/50 rounded-lg dark:bg-gray-800/50' : ''}`}
                            >
                                {column.tasks?.map((task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={index} // This index is critical for dnd logic
                                        onClick={() => setSelectedTaskId(task.id)}
                                    />
                                ))}
                                {(!column.tasks || column.tasks.length === 0) && !snapshot.isDraggingOver && (
                                    <div className="h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                        No Tasks
                                    </div>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <TaskDetailsDialog
                        open={!!selectedTask}
                        onOpenChange={(open) => !open && setSelectedTaskId(null)}
                        task={selectedTask}
                        columns={columns}
                        onEditTask={handleEditTask}
                    />

                    {editingTask && (
                        <EditTaskFormDialog
                            open={!!editingTask}
                            onOpenChange={(open) => !open && setEditingTaskId(null)}
                            columns={columns}
                            task={editingTask}
                        />
                    )}

                </div>
            )}
        </Draggable>
    )
}
