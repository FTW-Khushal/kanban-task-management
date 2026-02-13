"use client";

import { useState } from "react";
import Image from "next/image";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { useBoardData } from "@/hooks/use-board-data";

export function AddTaskButton({ boardId }: { boardId: string | null }) {
    const [open, setOpen] = useState(false);

    // We fetch board data here as well to pass columns to the dialog.
    // Since Query de-duplicates, this uses the same cache as BoardView.
    const { data: columns } = useBoardData(boardId);

    // If no board is selected, we disable the button or show nothing
    if (!boardId) return null;

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="bg-primary dark:bg-primary rounded-full px-6 py-3.5 ml-auto cursor-pointer opacity-100 hover:opacity-80 transition-opacity"
            >
                <p className="font-medium dark:text-white text-white">
                    <Image
                        src="/assets/icon-add-task-mobile.svg"
                        alt="Add Icon"
                        width={12}
                        height={12}
                    />
                </p>
            </div>

            <TaskFormDialog
                open={open}
                onOpenChange={setOpen}
                columns={columns || []}
            />
        </>
    );
}
