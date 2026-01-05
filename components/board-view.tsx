'use client'

import { useBoardData } from '@/hooks/use-board-data'
import { Column } from './column'

export default function BoardView({ boardId }: { boardId: string }) {
    const { data: columns, isLoading, error } = useBoardData(boardId)

    if (isLoading) return <div className="flex items-center justify-center h-full">Loading Board...</div>

    if (error) return <div className="flex items-center justify-center h-full text-red-500">Error loading board</div>

    if (!columns || columns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <p className="text-gray-500 text-lg font-bold">This board is empty. Create a new column to get started.</p>
                <button className="bg-primary text-white px-6 py-3 rounded-full font-bold">+ Add New Column</button>
            </div>
        )
    }

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full snap-x snap-mandatory px-4 md:px-6">
            {columns.map((column, index) => (
                <Column key={column.id} column={column} index={index} />
            ))}

            {/* "New Column" Placeholder Block */}
            <div className="min-w-[280px] mt-10 shrink-0 bg-gray-200 dark:bg-gray-800/50 rounded-lg flex items-center justify-center cursor-pointer hover:text-primary transition-colors">
                <h2 className="text-xl font-bold text-gray-500">+ New Column</h2>
            </div>
        </div>
    )
}
