"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AddTaskButton } from "@/components/add-task-button";
import BoardTitle from "@/components/BoardTitle";
import PopupSelector from "@/components/ui/PopupSelector";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DeleteDialog } from "./delete-dialog";
import { EditBoardFormDialog } from "./edit-board-form-dialog";
import { useBoards, useDeleteBoard } from "@/hooks/use-boards";
import { useBoardData } from "@/hooks/use-board-data";
import { useRouter } from "next/navigation";

export default function Header() {
    const params = useParams();
    const router = useRouter();
    const boardId = params.boardId ? String(params.boardId) : null;
    const { data: boards } = useBoards();
    const { data: boardData } = useBoardData(boardId);
    const deleteBoardMutation = useDeleteBoard();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] = useState(false);

    // Use boardData for edit dialog (has full details with columns)
    // Combine basic board info with columns for complete Board object
    const currentBoardBasic = boards?.find((b) => b.id.toString() === boardId);
    const currentBoardWithColumns = currentBoardBasic && boardData ? {
        ...currentBoardBasic,
        columns: boardData
    } : undefined;

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!boardId) return;

        deleteBoardMutation.mutate(boardId, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                // Redirect to home or first board
                const remainingBoards = boards?.filter(b => b.id.toString() !== boardId);
                if (remainingBoards && remainingBoards.length > 0) {
                    router.push(`/board/${remainingBoards[0].id}`);
                } else {
                    router.push("/");
                }
            }
        });
    };

    return (
        <header className="flex items-center px-4 py-4 bg-foreground md:px-8 md:py-5 border-b border-sidebar-border shrink-0">
            {/* Mobile Logo & Selector */}
            <div className="flex items-center md:hidden">
                <Image src="/assets/logo-mobile.svg" alt="logo" width={24} height={25} />
                <div className="w-4" />
                <PopupSelector />
            </div>

            {/* Desktop Logo & Title */}
            <div className="hidden md:flex items-center gap-8">
                <div className="dark:hidden block">
                    <Image src="/assets/logo-dark.svg" alt="kanban" width={152} height={25} style={{ width: 'auto', height: '25px' }} />
                </div>
                <div className="hidden dark:block">
                    <Image src="/assets/logo-light.svg" alt="kanban" width={152} height={25} style={{ width: 'auto', height: '25px' }} />
                </div>
                <div className="h-8 w-[1px] bg-sidebar-border" />
                <div className="text-lg font-bold">
                    <BoardTitle />
                </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
                <AddTaskButton boardId={boardId} />
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex-shrink-0 p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors outline-none focus:outline-none" aria-label="Board options">
                        <Image
                            className="cursor-pointer"
                            src="/assets/icon-vertical-ellipsis.svg"
                            alt="More icon"
                            width={5}
                            height={20}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[12rem] z-[100]">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setIsEditBoardDialogOpen(true)}
                            disabled={!boardId}
                        >
                            Edit Board
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={handleDeleteClick}
                            disabled={!boardId}
                        >
                            Delete Board
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <DeleteDialog
                title="Delete this board?"
                description={`Are you sure you want to delete the '${currentBoardBasic?.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDelete={handleDeleteConfirm}
                isDeleting={deleteBoardMutation.isPending}
            />

            {currentBoardWithColumns && (
                <EditBoardFormDialog
                    open={isEditBoardDialogOpen}
                    onOpenChange={setIsEditBoardDialogOpen}
                    board={currentBoardWithColumns}
                />
            )}
        </header>
    );
}
