import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogLabel } from "@/components/ui/dialogs/dialogLabel"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task, Column } from "@/types/api"
import { useUpdateTask, useToggleSubtask } from "@/hooks/use-tasks"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";

interface TaskDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    task: Task | null
    columns: Column[]
    onEditTask: (taskId: string) => void
}

export function TaskDetailsDialog({
    open,
    onOpenChange,
    task,
    columns,
    onEditTask,
}: TaskDetailsDialogProps) {
    const updateTaskMutation = useUpdateTask()
    const toggleSubtaskMutation = useToggleSubtask()

    if (!task) return null

    const completedSubtasks = task.subtasks?.filter(s => s.is_completed).length || 0
    const totalSubtasks = task.subtasks?.length || 0

    const handleStatusChange = (newStatus: string) => {
        updateTaskMutation.mutate({
            taskId: task.id,
            payload: { column_id: parseInt(newStatus) }
        })
    }


    const handleSubtaskToggle = (subtaskId: string, currentStatus: boolean) => {
        toggleSubtaskMutation.mutate({
            subtaskId,
            isCompleted: !currentStatus
        })
    }

    const handleEditClick = () => {
        onEditTask(task.id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[480px] p-8 gap-6"
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <DialogTitle className="text-lg font-bold flex-1 min-w-0">{task.title}</DialogTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex-shrink-0 p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors outline-none focus:outline-none" aria-label="Task options">
                                <Image
                                    className="cursor-pointer"
                                    src="/assets/icon-vertical-ellipsis.svg"
                                    alt="More icon"
                                    width={5}
                                    height={20}
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[12rem] z-[100]">
                                <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">Edit Task</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" className="cursor-pointer">Delete Task</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </DialogHeader>

                <div className="text-[13px] leading-6 text-gray-500">
                    {task.description || "No description available"}
                </div>

                <div className="space-y-4">
                    <DialogLabel>Subtasks ({completedSubtasks} of {totalSubtasks})</DialogLabel>
                    <div className="flex flex-col gap-2">
                        {task.subtasks?.map((subtask) => (
                            <div
                                key={subtask.id}
                                className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-md hover:bg-[#635FC7]/25 transition-colors cursor-pointer"
                                onClick={() => handleSubtaskToggle(subtask.id, subtask.is_completed)}
                            >
                                <input
                                    type="checkbox"
                                    checked={subtask.is_completed}
                                    readOnly
                                    className="w-4 h-4 text-primary rounded focus:ring-primary accent-[#635FC7]"
                                />
                                <span className={`text-xs font-bold ${subtask.is_completed ? 'text-gray-500 line-through' : 'text-color-txtcolor'}`}>
                                    {subtask.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <DialogLabel>Current Status</DialogLabel>
                    <Select value={task.column_id.toString()} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full rounded-sm">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {columns.map((col) => (
                                    <SelectItem key={col.id} value={col.id.toString()}>
                                        {col.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </DialogContent>
        </Dialog>
    )
}
