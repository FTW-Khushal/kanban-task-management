"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogProps {
    title: string
    description: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
    isDeleting?: boolean
}

export function DeleteDialog({
    title,
    description,
    open,
    onOpenChange,
    onDelete,
    isDeleting = false,
}: DeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-8 gap-6" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-destructive">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-[13px] leading-6 text-gray-500">
                    {description}
                </DialogDescription>
                <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-2">
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="w-full sm:flex-1 h-10 font-bold rounded-full transition-colors"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="w-full sm:flex-1 h-10 font-bold rounded-full transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-white dark:hover:bg-white/90 text-[#635FC7] dark:text-[#635FC7]"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
