import { useEffect, useState } from "react";

import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_auth/_sidebarLayout")({
  component: RouteComponent,
});

function getSidebarState(): boolean {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sidebar_state="));

  if (!match) {
    return window.innerWidth >= 1024;
  }

  // ถ้าจอเล็กกว่า 1024 ให้ย่อเสมอ ไม่สนใจ cookie
  if (window.innerWidth < 1024) {
    return false;
  }

  return match.split("=")[1] === "true";
}

function RouteComponent() {
  const [open, setOpen] = useState(() => getSidebarState());

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOpen(false); // auto-collapse
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        <AppSidebar />
        <SidebarInset>
          <main className="scrollbar scrollbar-track-transparent scrollbar-thumb-gray-400/40 scrollbar-w-2.5 flex h-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-scroll bg-transparent print:h-auto print:overflow-visible">
            <div className="min-h-[calc(100%+1px)] w-full flex-1">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
