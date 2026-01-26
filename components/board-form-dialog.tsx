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
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCreateBoard } from "@/hooks/use-boards";

interface BoardFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BoardFormDialog({
    open,
    onOpenChange,
}: BoardFormDialogProps) {
    const [name, setName] = useState("");
    const [columns, setColumns] = useState<string[]>(["Todo", "Doing"]);

    const createBoardMutation = useCreateBoard();

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setName("");
            setColumns(["Todo", "Doing"]);
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        // Filter out empty columns
        const validColumns = columns
            .filter((c) => c.trim() !== "")
            .map(c => ({ name: c }));

        createBoardMutation.mutate(
            {
                name,
                columns: validColumns,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.error("Failed to create board:", error);
                    alert("Failed to create board: " + (error as any).message);
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Board</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <DialogLabel htmlFor="name">Board Name</DialogLabel>
                        <DialogInput
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Web Design"
                        />
                    </div>

                    <div className="grid gap-4">
                        <DialogLabel>Board Columns</DialogLabel>
                        <div className="grid gap-2">
                            {columns.map((column, index) => (
                                <div className="flex items-center gap-2" key={index}>
                                    <DialogInput
                                        value={column}
                                        onChange={(e) => {
                                            const newColumns = [...columns];
                                            newColumns[index] = e.target.value;
                                            setColumns(newColumns);
                                        }}
                                        placeholder={
                                            index === 0 ? "e.g. Todo" :
                                                index === 1 ? "e.g. Doing" : ""
                                        }
                                    />
                                    <Image
                                        src="/assets/icon-cross.svg"
                                        alt="cross icon"
                                        width={15}
                                        height={15}
                                        className="flex-shrink-0 cursor-pointer hover:opacity-70"
                                        onClick={() => {
                                            setColumns(columns.filter((_, i) => i !== index));
                                        }}
                                    />
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full rounded-full font-bold bg-[#635FC7]/10 dark:bg-white text-[#635FC7] dark:text-[#635FC7] hover:bg-[#635FC7]/20 dark:hover:bg-white/90"
                                onClick={() => {
                                    setColumns([...columns, ""]);
                                }}
                            >
                                + Add New Column
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button className="w-full rounded-full font-bold" type="submit" disabled={createBoardMutation.isPending}>
                            {createBoardMutation.isPending ? "Creating..." : "Create New Board"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
