"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AddTaskButton } from "@/components/add-task-button";
import BoardTitle from "@/components/BoardTitle";
import PopupSelector from "@/components/ui/PopupSelector";

export default function Header() {
    const params = useParams();
    const boardId = params.boardId ? String(params.boardId) : null;

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
                <Image
                    className="cursor-pointer"
                    src="/assets/icon-vertical-ellipsis.svg"
                    alt="More icon"
                    width={5}
                    height={20}
                />
            </div>
        </header>
    );
}
