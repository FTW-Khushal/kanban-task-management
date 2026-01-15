import React, { useState } from 'react'
import { Column as ColumnType, Task } from '@/types/api'
import { TaskDetailsDialog } from './task-details-dialog'

// Temporary random colors for columns until we have real data/design
const DOT_COLORS = ['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-red-400']

export function Column({ column, index, columns }: { column: ColumnType; index: number; columns: ColumnType[] }) {
    const colorClass = DOT_COLORS[index % DOT_COLORS.length]
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

    const selectedTask = selectedTaskId ? column.tasks?.find(t => t.id === selectedTaskId) || null : null;

    return (
        <div className="min-w-[280px] shrink-0">
            <div className="flex items-center gap-2 mb-6">
                <div className={`w-4 h-4 rounded-full ${colorClass}`} />
                <h2 className="text-xs font-bold tracking-[2.4px] text-gray-500 uppercase">
                    {column.name} ({column.tasks?.length || 0})
                </h2>
            </div>

            {/* Task List Placeholder */}
            <div className="flex flex-col gap-5">
                {column.tasks?.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="bg-white dark:bg-[#2B2C37] px-4 py-6 rounded-lg shadow-sm cursor-pointer hover:text-primary transition-colors group"
                    >
                        <h3 className="font-bold text-[15px] mb-2 group-hover:text-primary transition-colors text-color-txtcolor">{task.title}</h3>
                        <p className="text-xs font-bold text-gray-500">{task.subtasks?.filter(s => s.is_completed).length || 0} of {task.subtasks?.length || 0} subtasks</p>
                    </div>
                ))}

                {(!column.tasks || column.tasks.length === 0) && (
                    <div className="h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        No Tasks
                    </div>
                )}
            </div>

            <TaskDetailsDialog
                open={!!selectedTask}
                onOpenChange={(open) => !open && setSelectedTaskId(null)}
                task={selectedTask}
                columns={columns}
            />
        </div>
    )
}
