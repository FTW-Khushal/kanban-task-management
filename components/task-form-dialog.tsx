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
import { Column } from "@/types/api";
import { useCreateTask } from "@/hooks/use-tasks";

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    columns: Column[];
    boardId: number;
}

export function TaskFormDialog({
    open,
    onOpenChange,
    columns,
    boardId,
}: TaskFormDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subtasks, setSubtasks] = useState<string[]>(["", ""]);
    const [status, setStatus] = useState("");

    const createTaskMutation = useCreateTask();

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setTitle("");
            setDescription("");
            setSubtasks(["", ""]);
            // Default to first column if available
            if (columns.length > 0) {
                setStatus(columns[0].id.toString());
            }
        }
    }, [open, columns]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !status) return;

        // Filter out empty subtasks
        const validSubtasks = subtasks
            .filter((s) => s.trim() !== "")
            .map(s => ({ title: s, isCompleted: false }));

        // Calculate Position
        const targetColumn = columns.find(c => c.id.toString() === status);
        let newPosition = 100; // Default start position

        if (targetColumn && targetColumn.tasks && targetColumn.tasks.length > 0) {
            const maxPos = Math.max(...targetColumn.tasks.map(t => t.position || 0));
            newPosition = maxPos + 100;
        }

        createTaskMutation.mutate(
            {
                title,
                description,
                columnId: parseInt(status), // Status here is actually columnId
                subtasks: validSubtasks,
                status: status,
                position: newPosition
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.error("Failed to create task:", error);
                    alert("Failed to create task: " + error.message);
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
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
                                        value={subtask}
                                        onChange={(e) => {
                                            const newSubtasks = [...subtasks];
                                            newSubtasks[index] = e.target.value;
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
                                    setSubtasks([...subtasks, ""]);
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
                        <Button className="w-full rounded-full font-bold" type="submit" disabled={createTaskMutation.isPending}>
                            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
