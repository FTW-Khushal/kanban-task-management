
import { apiClient } from "@/lib/api-client";
import { QueryClient } from "@tanstack/react-query";
import { Board, Column, Subtask, Task, UpdateTaskDto } from "@/types/api";

type BridgeContext = {
    boardId: string | null;
    columns: Column[];
    navigate: (path: string) => void;
};

export const executeBridgeFunction = async (
    functionName: string,
    args: Record<string, string>,
    queryClient: QueryClient,
    context: BridgeContext
): Promise<{ success: boolean; message: string }> => {


    try {
        switch (functionName) {
            case "bridge_get_boards":
                const boards = await apiClient.get<Board[]>("/boards");
                const boardNames = boards.map((b) => b.name).join(", ");
                return { success: true, message: `Available boards: ${boardNames}` };

            case "bridge_get_board_details":
                if (!args.board_name) throw new Error("board_name is required");
                const allBoards = await apiClient.get<Board[]>("/boards");
                const targetBoard = allBoards.find(
                    (b) => b.name.toLowerCase() === args.board_name.toLowerCase()
                );

                if (targetBoard) {
                    context.navigate(`/board/${targetBoard.id}`);
                    return { success: true, message: `Switched to board: ${targetBoard.name}` };
                } else {
                    return { success: false, message: `Board '${args.board_name}' not found.` };
                }

            case "bridge_create_board":
                if (!args.name) throw new Error("name is required");
                const columns = args.columns ? JSON.parse(args.columns) : ["Todo", "Done"];

                // We use the existing API which might simple or complex. 
                // Based on useCreateBoard, it takes CreateBoardDto.
                // If the backend assumes default columns or handles array, we pass it.
                // Looking at user request "JSON array of column names".

                // Note: The actual API might expect columns structure differently. 
                // We'll try to map it to what CreateBoardDto likely expects 
                // (checking previous conversations, it seems it supports nested columns).

                await apiClient.post("/boards", {
                    name: args.name,
                    // If backend supports creating columns with board:
                    columns: columns.map((name: string) => ({ name }))
                });

                await queryClient.invalidateQueries({ queryKey: ["boards"] });
                // We might want to switch to it, but requires finding the ID.
                return { success: true, message: `Board '${args.name}' created.` };

            case "bridge_update_board":
                if (!args.current_name) throw new Error("current_name is required");

                // We need board ID first.
                // If we are on the board, context.boardId matches.
                // But user might say "Rename board X" while on board Y.
                // So let's fetch boards to find ID.
                const boardsToUpdate = await apiClient.get<Board[]>("/boards");
                const boardStart = boardsToUpdate.find(b => b.name.toLowerCase() === args.current_name.toLowerCase());

                if (!boardStart) return { success: false, message: `Board '${args.current_name}' not found.` };

                const updatePayload: Partial<Board> = {};
                if (args.new_name) updatePayload.name = args.new_name;
                // Complex column updates might be tricky via bridge.

                await apiClient.patch(`/boards/${boardStart.id}`, updatePayload);
                await queryClient.invalidateQueries({ queryKey: ["boards"] });
                if (context.boardId === String(boardStart.id)) {
                    await queryClient.invalidateQueries({ queryKey: ["board", context.boardId] });
                }

                return { success: true, message: `Board '${args.current_name}' updated.` };

            case "bridge_delete_board":
                if (!args.board_name) throw new Error("board_name is required");
                const boardsToDelete = await apiClient.get<Board[]>("/boards");
                const boardToDelete = boardsToDelete.find(b => b.name.toLowerCase() === args.board_name.toLowerCase());

                if (!boardToDelete) return { success: false, message: `Board '${args.board_name}' not found.` };

                await apiClient.delete(`/boards/${boardToDelete.id}`);
                await queryClient.invalidateQueries({ queryKey: ["boards"] });

                // If we deleted current board, navigate to home/first board?
                if (context.boardId === String(boardToDelete.id)) {
                    context.navigate("/");
                }

                return { success: true, message: `Board '${args.board_name}' deleted.` };

            case "bridge_create_task":
                if (!args.title || !args.column_name) throw new Error("title and column_name are required");

                // We need to match column name to ID in THIS board.
                // context.columns should have this data.
                if (!context.boardId) return { success: false, message: "No active board to create task in." };

                const targetColumn = context.columns.find(c => c.name.toLowerCase() === args.column_name.toLowerCase());
                if (!targetColumn) return { success: false, message: `Column '${args.column_name}' not found in this board.` };

                const subtasks = args.subtasks ? JSON.parse(args.subtasks) : [];

                const newTask = await apiClient.post<Task>("/tasks", {
                    title: args.title,
                    description: args.description || "",
                    column_id: targetColumn.id, // Ensure this is number/string correctly. Types say string usually or number.
                    subtasks: subtasks.map((title: string) => ({ title, is_completed: false })),
                    position: 0 // Default to top
                });

                await queryClient.invalidateQueries({ queryKey: ["board", context.boardId] });

                // Wait for UI to settle before highlighting
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("task-highlight", { detail: { taskId: newTask.id } }));
                }, 1000);

                return { success: true, message: `Task '${args.title}' created in '${args.column_name}'.` };

            case "bridge_update_task":
                if (!args.current_task_title) throw new Error("current_task_title is required");

                // Find task in current board context
                let foundTask: Task | null = null;

                for (const col of context.columns) {
                    const task = col.tasks?.find(t => t.title.toLowerCase() === args.current_task_title.toLowerCase());
                    if (task) {
                        foundTask = task;
                        break;
                    }
                }

                if (!foundTask) return { success: false, message: `Task '${args.current_task_title}' not found on this board.` };

                const taskUpdatePayload: Partial<UpdateTaskDto> = {};
                if (args.new_title) taskUpdatePayload.title = args.new_title;
                if (args.new_description) taskUpdatePayload.description = args.new_description;

                if (args.target_column_name) {
                    const newCol = context.columns.find(c => c.name.toLowerCase() === args.target_column_name.toLowerCase());
                    if (newCol) {
                        taskUpdatePayload.column_id = newCol.id;
                    } else {
                        return { success: false, message: `Target column '${args.target_column_name}' not found.` };
                    }
                }

                const updatedTask = await apiClient.patch<Task>(`/tasks/${foundTask.id}`, taskUpdatePayload);
                await queryClient.invalidateQueries({ queryKey: ["board", context.boardId] });

                // Wait for UI to settle before highlighting
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("task-highlight", { detail: { taskId: updatedTask.id } }));
                }, 1000);

                return { success: true, message: `Task '${args.current_task_title}' updated.` };

            case "bridge_delete_task":
                if (!args.task_title) throw new Error("task_title is required");

                let taskToDelete: Task | null = null;
                for (const col of context.columns) {
                    const task = col.tasks?.find(t => t.title.toLowerCase() === args.task_title.toLowerCase());
                    if (task) {
                        taskToDelete = task;
                        break;
                    }
                }

                if (!taskToDelete) return { success: false, message: `Task '${args.task_title}' not found on this board.` };

                await apiClient.delete(`/tasks/${taskToDelete.id}`);
                await queryClient.invalidateQueries({ queryKey: ["board", context.boardId] });
                return { success: true, message: `Task '${args.task_title}' deleted.` };

            case "bridge_toggle_subtask":
                if (!args.parent_task_title || !args.subtask_title) throw new Error("parent_task_title and subtask_title are required");

                let parentTask: Task | null = null;
                for (const col of context.columns) {
                    const task = col.tasks?.find(t => t.title.toLowerCase() === args.parent_task_title.toLowerCase());
                    if (task) {
                        parentTask = task;
                        break;
                    }
                }

                if (!parentTask) return { success: false, message: `Task '${args.parent_task_title}' not found.` };

                // Assuming subtasks are loaded with tasks
                const subtask = parentTask.subtasks?.find((s: Subtask) => s.title.toLowerCase() === args.subtask_title.toLowerCase());
                if (!subtask) return { success: false, message: `Subtask '${args.subtask_title}' not found.` };

                const isCompleted = args.is_completed === "true";

                await apiClient.patch(`/subtasks/${subtask.id}`, { is_completed: isCompleted });
                await queryClient.invalidateQueries({ queryKey: ["board", context.boardId] });

                // Wait for UI to settle before highlighting
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("task-highlight", { detail: { taskId: parentTask.id } }));
                }, 1000);

                return { success: true, message: `Subtask '${args.subtask_title}' marked as ${isCompleted ? 'completed' : 'incomplete'}.` };

            default:
                return { success: false, message: `Function '${functionName}' not implemented.` };
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Bridge Error [${functionName}]:`, error);
        return { success: false, message: `Error: ${message}` };
    }
};
