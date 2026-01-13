
import * as React from "react";
import PopupSelector from "@/components/ui/PopupSelector";
import Image from "next/image";
import { DialogDemo } from "@/components/ui/dialogs/DialogDemo";
import BoardView from "@/components/board-view";
import { AddTaskButton } from "@/components/add-task-button";
import { fetchQuery, prefetchQuery } from "@/lib/prefetch";
import { getBoardColumns, getBoards } from "@/lib/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { notFound } from "next/navigation";

export default async function BoardPage(props: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await props.params;

    await prefetchQuery(['boards'], getBoards)

    try {
        // Fetch critical board data - fail hard if 404
        await fetchQuery(['board', boardId], () => getBoardColumns(boardId))
    } catch (e) {
        return notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(getQueryClient())}>
            <main className="flex flex-col h-screen bg-foreground">
                {/* Header Section */}
                <header className="flex items-center px-4 py-4 bg-white dark:bg-[#2B2C37]">
                    <Image src="/assets/logo-mobile.svg" alt="logo" width={24} height={25} />
                    <div className="w-4" />
                    <PopupSelector />
                    <div className="w-4" />

                    <AddTaskButton boardId={boardId} />

                    <Image
                        className="ml-4 cursor-pointer"
                        src="/assets/icon-vertical-ellipsis.svg"
                        alt="More icon"
                        width={5}
                        height={20}
                    />
                </header>

                {/* Board Content */}
                <div className="flex-1 overflow-hidden bg-[#F4F7FD] dark:bg-[#20212C] py-6">
                    <BoardView boardId={boardId} />
                </div>

                <div className="hidden">
                    {/* Dialogs often need to be mounted at root, keeping here for now */}
                    <DialogDemo title="" />
                </div>
            </main>
        </HydrationBoundary>
    );
}
