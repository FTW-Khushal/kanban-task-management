"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ResetDbDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onReset: () => void
    isResetting?: boolean
}

export function ResetDbDialog({
    open,
    onOpenChange,
    onReset,
    isResetting = false,
}: ResetDbDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-8 gap-6" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-destructive">
                        Reset Database?
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-[13px] leading-6 text-gray-500">
                    This will permanently delete all current data and restore the default demo data. This action cannot be undone.
                </DialogDescription>
                <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-2">
                    <Button
                        variant="destructive"
                        onClick={onReset}
                        disabled={isResetting}
                        className="w-full sm:flex-1 h-10 font-bold rounded-full transition-colors"
                    >
                        {isResetting ? "Resetting..." : "Reset"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isResetting}
                        className="w-full sm:flex-1 h-10 font-bold rounded-full transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-white dark:hover:bg-white/90 text-[#635FC7] dark:text-[#635FC7]"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
