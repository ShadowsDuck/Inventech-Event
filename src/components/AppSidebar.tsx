import { useLocation, useNavigate } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_LINKS } from "@/data/constants";
import { cn } from "@/lib/utils";

import { UserCardProfile } from "./UserCardProfile";

export function AppSidebar() {
  const { isMobile, setOpenMobile, state } = useSidebar();

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {state === "collapsed" ? (
              <>
                {/* Mini Sidebar */}
                <div className="hidden pt-4 pl-1 md:block">
                  <Tooltip>
                    <TooltipTrigger>
                      <SidebarTrigger />
                    </TooltipTrigger>
                    <TooltipContent side="right">Open sidebar</TooltipContent>
                  </Tooltip>
                </div>

                {/* Mobile Sidebar */}
                <div className="sm:block md:hidden">
                  <div className="flex items-center justify-between px-1 pt-2">
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-1"
                    >
                      <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600">
                        <span className="font-bold text-white">EF</span>
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          EventFlow
                        </span>
                        <span className="truncate text-xs">
                          Event Management
                        </span>
                      </div>
                    </SidebarMenuButton>
                    <SidebarTrigger />
                  </div>
                </div>
              </>
            ) : (
              // Full Sidebar
              <div className="flex items-center justify-between pt-2">
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground -mb-2 flex-1"
                >
                  <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600">
                    <span className="font-bold text-white">EF</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">EventFlow</span>
                    <span className="truncate text-xs">Event Management</span>
                  </div>
                </SidebarMenuButton>
                <SidebarTrigger />
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_LINKS.map((item) => {
                // เช็คว่าหน้าปัจจุบันตรงกับเมนูนี้หรือไม่ เพื่อทำสถานะ Active
                const isActive =
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      onClick={() => {
                        navigate({ to: item.url });

                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                      className={cn(
                        "h-10 px-4 group-data-[collapsible=icon]:h-10! group-data-[collapsible=icon]:w-10! group-data-[collapsible=icon]:justify-center",
                        isActive
                          ? "bg-sidebar-primary/10! rounded-lg font-medium text-blue-600! hover:text-blue-600"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground/90 transition-colors",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserCardProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
