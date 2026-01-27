"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useBoards } from "@/hooks/use-boards";
import { Switch } from "@/components/ui/switch";
import IconBoard from "@/public/assets/icon-board.svg";
import IconHideSidebar from "@/public/assets/icon-hide-sidebar.svg";
import IconShowSidebar from "@/public/assets/icon-show-sidebar.svg";
import { BoardFormDialog } from "./board-form-dialog";

// Note: Ensure @svgr/webpack is configured in next.config.ts to import SVGs as components.
// If standard Image imports are preferred for some, we can switch, but IconBoard uses it.

export default function Sidebar() {
    const { data: boards } = useBoards();
    const params = useParams();
    const router = useRouter();
    const currentBoardId = params.boardId ? String(params.boardId) : "";

    // Sidebar visibility state
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);

    // Theme handling
    const onThemeChange = (checked: boolean) => {
        if (checked) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const onNewBoardClick = () => {
        setIsBoardDialogOpen(true);
    };

    if (!isSidebarVisible) {
        return (
            <div className="hidden md:block fixed bottom-8 left-0 z-50">
                <button
                    onClick={() => setIsSidebarVisible(true)}
                    className="bg-primary hover:bg-primary/80 text-white p-5 rounded-r-full transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Show Sidebar"
                >
                    <IconShowSidebar />
                </button>
            </div>
        );
    }

    // Calculate total boards logic like PopupSelector
    // We use h-screen, sticky or fixed? 
    // User said "side bar the take the full height of screen". The parent container is likely flex row h-screen.
    // We'll return an aside element.

    return (
        <aside className="hidden md:flex flex-col w-[300px] h-full bg-foreground border-r border-sidebar-border shrink-0 transition-all duration-300 py-8">

            {/* Board List */}
            <div className="flex-1 overflow-y-auto pr-6">
                <p className="text-xs font-bold text-muted-foreground tracking-[2.4px] px-8 mb-5">
                    ALL BOARDS ({boards?.length || 0})
                </p>

                <div className="flex flex-col">
                    {boards?.map((board) => {
                        const isActive = board.id.toString() === currentBoardId;
                        return (
                            <div
                                key={board.id}
                                onClick={() => router.push(`/board/${board.id}`)}
                                className={`py-3.5 pr-12 pl-8 cursor-pointer rounded-tr-full rounded-br-full text-muted-foreground font-semibold flex items-center gap-x-3 ${isActive
                                    ? "bg-primary font-bold text-white"
                                    : "hover:bg-accent hover:text-accent-foreground"
                                    }`}
                            >
                                <IconBoard className={isActive ? "text-white" : "text-inherit"} />
                                <span>{board.name}</span>
                            </div>
                        );
                    })}

                    <button
                        onClick={onNewBoardClick}
                        className="flex items-center gap-4 px-8 py-4 rounded-r-full cursor-pointer text-primary hover:text-primary/80 font-bold transition-colors"
                    >
                        <IconBoard className="text-primary" />
                        <span>+ Create New Board</span>
                    </button>
                </div>
            </div>

            {/* Bottom Actions: Theme & Hide Sidebar */}
            <div className="pb-8 px-2 space-y-4">
                {/* Theme Switcher */}
                <div className="bg-background rounded-md p-4 flex items-center justify-center gap-x-4 mx-2">
                    <Image src="/assets/icon-light-theme.svg" alt="Light" width={19} height={19} />
                    <Switch onCheckedChange={onThemeChange} className="data-[state=unchecked]:bg-primary" />
                    <Image src="/assets/icon-dark-theme.svg" alt="Dark" width={19} height={19} />
                </div>

                {/* Hide Sidebar Button */}
                <button
                    onClick={() => setIsSidebarVisible(false)}
                    className="flex items-center gap-2 px-2 text-muted-foreground hover:text-sidebar-foreground transition-colors w-full cursor-pointer"
                >
                    <span className="w-2"></span>
                    <IconHideSidebar />
                    <span className="font-bold text-sm">Hide Sidebar</span>
                </button>
            </div>

            <BoardFormDialog
                open={isBoardDialogOpen}
                onOpenChange={setIsBoardDialogOpen}
            />
        </aside>
    );
}
