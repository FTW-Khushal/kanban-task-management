
import * as React from "react";
import BoardView from "@/components/board-view";
import { fetchQuery } from "@/lib/prefetch";
import { getBoardColumns } from "@/lib/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { notFound } from "next/navigation";

export default async function BoardPage(props: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await props.params;

    try {
        // Fetch critical board data - fail hard if 404
        await fetchQuery(['board', boardId], () => getBoardColumns(boardId))
    } catch (e) {
        return notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(getQueryClient())}>
            <BoardView boardId={boardId} />
        </HydrationBoundary>
    );
}
