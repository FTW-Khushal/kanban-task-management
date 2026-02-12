
import { useState, useCallback } from "react";
import { executeBridgeFunction } from "@/lib/chat-bridge";
import { useQueryClient } from "@tanstack/react-query";
import { Column } from "@/types/api";
import { useRouter } from "next/navigation";

export type MessageType = "text" | "confirmation";

export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
    type?: MessageType;
    payload?: any; // For storing function call details pending confirmation
}

type UseChatProps = {
    boardId: string | null;
    columns: Column[];
};

export interface LlmResponse {
    status: 'success' | 'error';
    function_call: string; // Raw text from the model
    has_tool_calls: boolean;
    tool_calls?: Array<{
        type: 'function';
        function: {
            name: string;
            arguments: string; // NOTE: This is a JSON string, you must JSON.parse() it!
        };
        id: string;
    }>;
}

export function useChat({ boardId, columns }: UseChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const processFunctionCall = async (functionName: string, args: any) => {
        // Intercept delete actions for confirmation
        if (functionName.startsWith("bridge_delete_")) {
            addMessage({
                role: "assistant",
                content: `Are you sure you want to delete ${args.task_title || args.board_name}?`,
                type: "confirmation",
                payload: { functionName, args }
            });
            return;
        }

        // Execute immediately for other actions
        await runBridgeFunction(functionName, args);
    };

    const runBridgeFunction = async (functionName: string, args: any) => {
        setIsLoading(true);
        try {
            const context = {
                boardId,
                columns,
                navigate: (path: string) => router.push(path)
            };

            const result = await executeBridgeFunction(functionName, args, queryClient, context);

            if (result.success) {
                addMessage({ role: "system", content: result.message });
            } else {
                addMessage({ role: "system", content: `Failed: ${result.message}` });
            }
        } catch (error: any) {
            addMessage({ role: "system", content: `Error executing command: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    const confirmAction = async (payload: any) => {
        addMessage({ role: "user", content: "Confirmed" }); // Visual feedback
        await runBridgeFunction(payload.functionName, payload.args);
    };

    const cancelAction = () => {
        addMessage({ role: "user", content: "Cancelled" });
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3001/api/kanban/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_request: text }),
            });

            console.log(response);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to reach chat server");
            }

            const data: LlmResponse = await response.json();
            console.log("Chat Server Response:", data);

            if (data.status === 'success') {
                if (data.has_tool_calls && data.tool_calls) {
                    // Handle tool calls
                    for (const toolCall of data.tool_calls) {
                        try {
                            const args = JSON.parse(toolCall.function.arguments);
                            await processFunctionCall(toolCall.function.name, args);
                        } catch (e: any) {
                            console.error("Failed to parse arguments for tool call:", toolCall, e);
                            addMessage({ role: "system", content: "Error: Failed to parse arguments from AI response." });
                        }
                    }
                } else {
                    // No tool calls, just display the raw text (function_call field contains raw text if no tools)
                    // Wait, the spec says "If has_tool_calls is false, display function_call (the raw text) to the user"
                    addMessage({ role: "assistant", content: data.function_call });
                }
            } else {
                addMessage({ role: "assistant", content: "Something went wrong processing your request." });
            }

        } catch (error: any) {
            addMessage({ role: "system", content: `Error: ${error.message}. Is the NestJS backend running on port 3001?` });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        sendMessage,
        confirmAction,
        cancelAction
    };
}
