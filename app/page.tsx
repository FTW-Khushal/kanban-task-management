import * as React from "react";
import PopupSelector from "@/components/ui/PopupSelector";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center bg-foreground px-4 py-4">
      <Image src="/assets/logo-mobile.svg" alt="logo" width={24} height={25} />
      <div className="w-4" />
      <PopupSelector />
      <div className="w-4" />
      <div className="bg-primary dark:bg-primary rounded-full px-6 py-3.5 ml-auto ">
        <p className="font-medium dark:text-white text-white">
          <Image
            src="/assets/icon-add-task-mobile.svg"
            alt="Add Icon"
            width={12}
            height={12}
          />
        </p>
      </div>
      <Image
        className="ml-4"
        src="/assets/icon-vertical-ellipsis.svg"
        alt="More icon"
        width={5}
        height={20}
        />
    </main>
  );
}


