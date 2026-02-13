import React from 'react'
import { Task } from '@/types/api'
import { Draggable } from '@hello-pangea/dnd'

interface TaskCardProps {
    task: Task;
    index: number;
    onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                    onClick={onClick}
                    className={`bg-white dark:bg-[#2B2C37] px-4 py-6 rounded-lg shadow-sm cursor-pointer hover:text-primary transition-colors group ${snapshot.isDragging ? 'opacity-50' : ''}`}
                >
                    <h3 className="font-bold text-[15px] mb-2 group-hover:text-primary transition-colors text-color-txtcolor truncate">{task.title}</h3>
                    <p className="text-xs font-bold text-gray-500">{task.subtasks?.filter(s => s.is_completed).length || 0} of {task.subtasks?.length || 0} subtasks</p>
                </div>
            )}
        </Draggable>
    )
}
