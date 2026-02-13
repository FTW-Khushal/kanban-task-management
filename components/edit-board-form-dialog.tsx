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
import { useUpdateBoard } from "@/hooks/use-boards";
import { Board } from "@/types/api";

interface EditBoardFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    board: Board;
}

export function EditBoardFormDialog({
    open,
    onOpenChange,
    board,
}: EditBoardFormDialogProps) {
    const [name, setName] = useState(board.name);
    const [columns, setColumns] = useState<{ id?: number; name: string }[]>(
        board.columns?.map(c => ({ id: c.id, name: c.name })) || []
    );

    const updateBoardMutation = useUpdateBoard();

    // Reset form when dialog opens or board changes
    useEffect(() => {
        if (open) {
            setName(board.name);
            setColumns(board.columns?.map(c => ({ id: c.id, name: c.name })) || []);
        }
    }, [open, board]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        // Filter out empty columns
        const validColumns = columns
            .filter((c) => c.name.trim() !== "");

        updateBoardMutation.mutate(
            {
                boardId: board.id.toString(),
                payload: {
                    name,
                    columns: validColumns,
                },
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (error) => {
                    console.error("Failed to update board:", error);
                    alert("Failed to update board: " + (error as Error).message);
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Board</DialogTitle>
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
                                        value={column.name}
                                        onChange={(e) => {
                                            const newColumns = [...columns];
                                            newColumns[index] = { ...column, name: e.target.value };
                                            setColumns(newColumns);
                                        }}
                                        placeholder="e.g. Done"
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
                                    setColumns([...columns, { name: "" }]);
                                }}
                            >
                                + Add New Column
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button className="w-full rounded-full font-bold" type="submit" disabled={updateBoardMutation.isPending}>
                            {updateBoardMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
