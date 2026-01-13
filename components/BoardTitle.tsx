"use client";

import { useBoards } from "@/hooks/use-boards";
import { useParams } from "next/navigation";

export default function BoardTitle() {
    const { data: boards } = useBoards();
    const params = useParams();
    const currentBoardId = params.boardId ? String(params.boardId) : "";

    const selectedBoard = boards?.find((b) => b.id.toString() === currentBoardId);

    if (!selectedBoard) return null;

    return <span>{selectedBoard.name}</span>;
}
