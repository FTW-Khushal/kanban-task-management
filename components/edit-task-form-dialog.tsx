"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogLabel } from "@/components/ui/dialogs/dialogLabel";
import { DialogInput } from "@/components/ui/dialogs/dialogInput";
import { DialogTextarea } from "@/components/ui/dialogs/dialogTextarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Column, Task } from "@/types/api";
import { useUpdateTask } from "@/hooks/use-tasks";

interface EditTaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    columns: Column[];
    task: Task;
}

export function EditTaskFormDialog({
    open,
    onOpenChange,
    columns,
    task,
}: EditTaskFormDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subtasks, setSubtasks] = useState<{ title: string; is_completed: boolean; id?: string }[]>([]);
    const [status, setStatus] = useState("");

    const updateTaskMutation = useUpdateTask();

    // Pre-fill form when dialog opens
    useEffect(() => {
        if (open && task) {
            setTitle(task.title);
            setDescription(task.description || "");
            setSubtasks(
                task.subtasks && task.subtasks.length > 0
                    ? task.subtasks.map(s => ({ title: s.title, is_completed: s.is_completed, id: s.id }))
                    : [{ title: "", is_completed: false }, { title: "", is_completed: false }]
            );
            setStatus(task.column_id.toString());
        }
    }, [open, task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !status) return;

        // Filter out empty subtasks
        const validSubtasks = subtasks
            .filter((s) => s.title.trim() !== "")
            .map(s => ({
                title: s.title,
                is_completed: s.is_completed,
                id: s.id // Preserve ID for updates
            }));

        updateTaskMutation.mutate(
            {
                taskId: task.id,
                payload: {
                    title,
                    description,
                    column_id: parseInt(status),
                    subtasks: validSubtasks,
                }
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.error("Failed to update task:", error);
                    alert("Failed to update task: " + error.message);
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <DialogLabel htmlFor="title">Title</DialogLabel>
                        <DialogInput
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Take a Coffee break"
                        />
                    </div>
                    <div className="grid gap-3">
                        <DialogLabel htmlFor="description">Description</DialogLabel>
                        <DialogTextarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. It's always good to take break..."
                        />
                    </div>
                    <div className="grid gap-4">
                        <DialogLabel>Subtasks</DialogLabel>
                        <div className="grid gap-2">
                            {subtasks.map((subtask, index) => (
                                <div className="flex items-center gap-2" key={index}>
                                    <DialogInput
                                        value={subtask.title}
                                        onChange={(e) => {
                                            const newSubtasks = [...subtasks];
                                            newSubtasks[index] = { ...newSubtasks[index], title: e.target.value };
                                            setSubtasks(newSubtasks);
                                        }}
                                        placeholder={
                                            index === 0 ? "e.g. Make coffee" :
                                                index === 1 ? "e.g. Drink coffee" : ""
                                        }
                                    />
                                    <Image
                                        src="/assets/icon-cross.svg"
                                        alt="cross icon"
                                        width={15}
                                        height={15}
                                        className="flex-shrink-0 cursor-pointer hover:opacity-70"
                                        onClick={() => {
                                            setSubtasks(subtasks.filter((_, i) => i !== index));
                                        }}
                                    />
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full rounded-full font-bold"
                                onClick={() => {
                                    setSubtasks([...subtasks, { title: "", is_completed: false }]);
                                }}
                            >
                                + Add New Subtask
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <DialogLabel>Status</DialogLabel>
                        <Select value={status} onValueChange={setStatus}>
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

                    <DialogFooter>
                        <Button className="w-full rounded-full font-bold" type="submit" disabled={updateTaskMutation.isPending}>
                            {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
