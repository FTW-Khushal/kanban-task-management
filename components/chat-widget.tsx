
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import { useParams } from "next/navigation";
import { useBoardData } from "@/hooks/use-board-data";
import { AnimatePresence, motion } from "framer-motion";
import { IconMessageChatbot, IconX, IconSend } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const params = useParams();
    const boardId = params.boardId ? String(params.boardId) : null;
    const { data: columns = [] } = useBoardData(boardId);

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, isLoading, sendMessage, confirmAction, cancelAction } = useChat({
        boardId,
        columns,
    });

    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="pointer-events-auto bg-white dark:bg-[#2B2C37] w-[90vw] md:w-[400px] h-[500px] md:h-[600px] rounded-lg shadow-2xl border border-gray-200 dark:border-[#3E3F4E] flex flex-col mb-4 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-[#3E3F4E] flex justify-between items-center bg-white dark:bg-[#2B2C37]">
                            <h3 className="font-bold text-lg dark:text-white">Kanban AI Assistant</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                <IconX size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F7FD] dark:bg-[#20212C]">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-20 p-4">
                                    <p className="mb-2">👋 Hi there!</p>
                                    <p className="text-sm">I can help you manage your board. Try saying:</p>
                                    <ul className="text-sm mt-2 space-y-1 bg-white dark:bg-[#2B2C37] p-3 rounded-lg inline-block text-left">
                                        <li>"Create a task 'Buy Milk' in Todo"</li>
                                        <li>"Add waiting column to this board"</li>
                                        <li>"Switch to Marketing board"</li>
                                        <li>"Delete task 'Old Task'"</li>
                                    </ul>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === "user"
                                                ? "bg-primary text-white rounded-tr-none"
                                                : msg.role === "system"
                                                    ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 italic" // System messages distinct
                                                    : "bg-white dark:bg-[#2B2C37] text-gray-800 dark:text-white rounded-tl-none border border-gray-100 dark:border-gray-700"
                                            } ${msg.type === "confirmation" ? "border-l-4 border-yellow-500" : ""}`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                        {msg.type === "confirmation" && (
                                            <div className="mt-3 flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => confirmAction(msg.payload)}
                                                    className="h-8"
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={cancelAction}
                                                    className="h-8"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-[#2B2C37] rounded-2xl rounded-tl-none px-4 py-3 border border-gray-100 dark:border-gray-700">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-[#2B2C37] border-t border-gray-200 dark:border-[#3E3F4E]">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a command..."
                                    className="flex-1 bg-transparent dark:text-white"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    size="icon"
                                    className="shrink-0"
                                >
                                    <IconSend size={18} />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                {isOpen ? <IconX size={28} /> : <IconMessageChatbot size={28} />}
            </motion.button>
        </div>
    );
}
