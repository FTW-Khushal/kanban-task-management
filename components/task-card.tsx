import React, { useEffect, useState } from 'react'
import { Task } from '@/types/api'
import { Draggable } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TaskCardProps {
    task: Task;
    index: number;
    onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
    const [isHighlighted, setIsHighlighted] = useState(false);

    useEffect(() => {
        const handleHighlight = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.taskId === task.id) {
                setIsHighlighted(true);
                setTimeout(() => setIsHighlighted(false), 3000);
            }
        };

        window.addEventListener('task-highlight', handleHighlight);
        return () => window.removeEventListener('task-highlight', handleHighlight);
    }, [task.id]);

    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                    onClick={onClick}
                    className="relative group mt-3 first:mt-0"
                >
                    <AnimatePresence>
                        {isHighlighted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: [0, 0.5, 0],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: 1,
                                    ease: "easeInOut"
                                }}
                                className="absolute -inset-1 bg-primary/40 rounded-xl blur-md z-0 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={isHighlighted ? {
                            boxShadow: [
                                "0 0 0px 0px rgba(99, 95, 199, 0)",
                                "0 0 20px 4px rgba(99, 95, 199, 0.4)",
                                "0 0 0px 0px rgba(99, 95, 199, 0)"
                            ],
                            scale: [1, 1.02, 1]
                        } : {}}
                        transition={{ duration: 1.5, repeat: 1 }}
                        className={cn(
                            "relative z-10 bg-white dark:bg-[#2B2C37] px-4 py-6 rounded-lg shadow-sm cursor-pointer hover:text-primary transition-colors group",
                            snapshot.isDragging && "opacity-50",
                            isHighlighted && "border-2 border-primary"
                        )}
                    >
                        <h3 className="font-bold text-[15px] mb-2 group-hover:text-primary transition-colors text-color-txtcolor truncate">{task.title}</h3>
                        <p className="text-xs font-bold text-gray-500">{task.subtasks?.filter(s => s.is_completed).length || 0} of {task.subtasks?.length || 0} subtasks</p>
                    </motion.div>
                </div>
            )}
        </Draggable>
    )
}
