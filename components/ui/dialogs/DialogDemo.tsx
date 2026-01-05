"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogLabel } from "./dialogLabel";
import { DialogInput } from "./dialogInput";
import { DialogTextarea } from "./dialogTextarea";
import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { stat } from "fs";

export function DialogDemo({ title }: { title: string }) {
  const [subtasks, setSubtasks] = useState<string[]>([
    "Make coffee",
    "Why don't you smile",
  ]);

  const statuses = ["Pending", "In Progress", "Completed", "On Hold"];

  const [status, setStatus] = useState("");

  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <DialogLabel htmlFor="title-1">title</DialogLabel>
              <DialogInput
                id="title-1"
                name="title"
                placeholder="e.g. Take a Coffee break"
              />
            </div>
            <div className="grid gap-3">
              <DialogLabel htmlFor="description-1" className="">
                description
              </DialogLabel>
              <DialogTextarea
                id="description-1"
                name="description"
                placeholder="e.g. It's always good to take break, This 15 min break will recharge the batteries"
              />
            </div>
            <div className="grid gap-4">
              <DialogLabel htmlFor="subtask-1">Subtasks</DialogLabel>
              <div className="grid gap-2">
                {subtasks.map((subtask, index) => (
                  <div className="flex items-center gap-2 " key={index}>
                    <DialogInput
                      id={`subtask-${index}`}
                      name={`subtask-${index}`}
                      placeholder={`e.g. ${subtask}`}
                    />
                    <Image
                      src="/assets/icon-cross.svg"
                      alt="cross icon"
                      width={15}
                      height={15}
                      className="flex-shrink-0"
                      onClick={() => {
                        setSubtasks(subtasks.filter((_, i) => i !== index));
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  className="w-full rounded-full font-bold"
                  onClick={() => {
                    setSubtasks([...subtasks, "New Subtask"]);
                  }}
                >
                  + Add New Subtask
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <DialogLabel htmlFor="status-1">Status</DialogLabel>
              <Select>
                <SelectTrigger className="w-full rounded-sm" id="status-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status} >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
