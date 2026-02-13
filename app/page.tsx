import * as React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

export default async function Home() {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-500 mb-4">No Board Selected</h2>
          <p className="text-gray-400">Please select a board from the menu to get started.</p>
        </div>
      </div>
    </HydrationBoundary>
  );
}
