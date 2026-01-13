import * as React from "react";
import PopupSelector from "@/components/ui/PopupSelector";
import Image from "next/image";
import { prefetchQuery } from "@/lib/prefetch";
import { getBoards } from "@/lib/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

export default async function Home() {
  // Prefetch boards so the selector has data immediately
  await prefetchQuery(['boards'], getBoards)

  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      <main className="flex flex-col h-screen bg-foreground">
        <header className="flex items-center px-4 py-4 bg-white dark:bg-[#2B2C37]">
          <Image src="/assets/logo-mobile.svg" alt="logo" width={24} height={25} />
          <div className="w-4" />
          <PopupSelector />
          <div className="w-4" />
          {/* No AddTaskButton here as no board is selected */}
        </header>

        <div className="flex-1 overflow-hidden bg-[#F4F7FD] dark:bg-[#20212C] py-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-500 mb-4">No Board Selected</h2>
            <p className="text-gray-400">Please select a board from the menu to get started.</p>
          </div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
