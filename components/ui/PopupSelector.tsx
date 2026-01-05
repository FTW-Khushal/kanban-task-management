"use client";
// This component provides a dropdown selector for choosing a project board.
// It displays a list of available boards and allows the user to select one.
// It also includes functionality for creating a new board and switching between light/dark themes.
import { useState, useRef, useEffect, Suspense } from "react";
import { Switch } from "./switch";
import { Sun, Moon, ArrowBigDown, ChevronDown } from "lucide-react";
import Image from "next/image";
import IconBoard from "../../public/assets/icon-board.svg";
import { useBoards } from "@/hooks/use-boards";
import { useRouter, useSearchParams } from "next/navigation";

function BoardSelectorContent() {
  const { data: boards, isLoading } = useBoards();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBoardId = searchParams.get("boardId");

  // Sync URL with Boards: Default to first board if none selected
  useEffect(() => {
    if (boards && boards.length > 0 && !currentBoardId) {
      router.replace(`/?boardId=${boards[0].id}`);
    }
  }, [boards, currentBoardId, router]);

  const selectedBoard = boards?.find(
    (b) => b.id.toString() === currentBoardId
  );

  const handleBoardClick = (boardId: number) => {
    router.push(`/?boardId=${boardId}`);
    setIsPopupVisible(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPopupVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsPopupVisible(false);
    }, 150);
  };

  const onThemeChange = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const onNewBoardClick = () => {
    alert("Create New Board Clicked");
  };

  return (
    <div
      className="relative inline-block "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer font-bold flex items-center gap-1  text-lg  rounded transition-all">
        <p>{selectedBoard ? selectedBoard.name : "Select Board"}</p>
        <ChevronDown
          className={`transition-transform duration-200 text-primary ${isPopupVisible ? "rotate-180" : ""
            }`}
          size={16}
        />
      </div>

      <div
        className={` absolute z-10 mt-2 w-max border border-foreground-200 rounded shadow-lg bg-foreground transition-opacity duration-200 text-muted ${isPopupVisible ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <p className="text-sm tracking-widest font-bold pt-3.5 pl-8 pb-2">{`ALL BOARDS (${boards?.length || 0
          })`}</p>
        <div className="pr-8">
          {boards?.map((board) => (
            <div
              key={board.id}
              onClick={() => handleBoardClick(board.id)}
              className={` py-3.5 pr-12 pl-8 cursor-pointer rounded-tr-full rounded-br-full text-gray font-semibold flex items-center gap-x-3 ${selectedBoard?.id === board.id
                  ? "bg-primary font-bold text-white"
                  : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <IconBoard />
              {board.name}
            </div>
          ))}

          <div
            onClick={onNewBoardClick}
            className={
              "py-3.5 pr-12 pl-8 cursor-pointer flex items-center gap-x-3 font-bold text-primary"
            }
          >
            <IconBoard />
            <p> + Create New Board</p>
          </div>
        </div>

        <div className=" flex bg-background p-4 my-4 mx-4 rounded justify-center gap-x-4">
          <Image
            src="/assets/icon-light-theme.svg"
            alt="Light Theme"
            width={19}
            height={19}
          />
          <Switch
            className="data-[state=unchecked]:bg-primary"
            onCheckedChange={onThemeChange}
          />
          <Image
            src="/assets/icon-dark-theme.svg"
            alt="Dark Theme"
            width={19}
            height={19}
          />
        </div>
      </div>
    </div>
  );
}

export default function PopupSelector() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoardSelectorContent />
    </Suspense>
  );
}
