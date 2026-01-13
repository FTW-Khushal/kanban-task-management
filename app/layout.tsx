import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { prefetchQuery } from "@/lib/prefetch";
import { getBoards } from "@/lib/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { DialogDemo } from "@/components/ui/dialogs/DialogDemo";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Prefetch boards at root level so it's available for Sidebar everywhere
  await prefetchQuery(['boards'], getBoards);

  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <Providers>
          <HydrationBoundary state={dehydrate(getQueryClient())}>
            <div className="flex flex-col h-screen bg-background">
              <Header />
              <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-hidden bg-[#F4F7FD] dark:bg-[#20212C] py-6">
                  {children}
                </main>
              </div>
              <div className="hidden">
                <DialogDemo title="" />
              </div>
            </div>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
