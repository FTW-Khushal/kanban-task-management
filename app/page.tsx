import * as React from "react";
import PopupSelector from "@/components/ui/PopupSelector";
import Image from "next/image";
import { DialogDemo } from "@/components/ui/dialogs/DialogDemo";
import BoardView from "@/components/board-view";
import { AddTaskButton } from "@/components/add-task-button";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const boardId = typeof searchParams.boardId === 'string' ? searchParams.boardId : null;

  return (
    <main className="flex flex-col h-screen bg-foreground">
      {/* Header Section - Kept existing structure with slight mod for layout */}
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
        {boardId ? (
          <BoardView boardId={boardId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a board</p>
          </div>
        )}
      </div>
      <div className="hidden">
        <DialogDemo title="" />
      </div>
    </main>
  );
}
