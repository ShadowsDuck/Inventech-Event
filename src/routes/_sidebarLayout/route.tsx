import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_sidebarLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex min-h-full w-full flex-1 flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
