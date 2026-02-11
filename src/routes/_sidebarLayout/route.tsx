import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_sidebarLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        <AppSidebar />

        <main className="scrollbar scrollbar-track-transparent scrollbar-thumb-gray-400/40 scrollbar-w-2.5 h-full min-w-0 flex-1 overflow-x-hidden overflow-y-scroll bg-transparent">
          <div className="min-h-[calc(100%+1px)] w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
