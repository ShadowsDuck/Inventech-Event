import { Link } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NAV_LINKS } from "@/data/constants";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="font-bold text-white">EF</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">EventFlow</span>
                <span className="truncate text-xs">Event Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="border-b" />

      <SidebarContent>
        <SidebarGroup className="px-3">
          <SidebarGroupLabel>Event Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_LINKS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-auto rounded-xl p-0 hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit"
                  >
                    <Link
                      to={item.url}
                      className="text-muted-foreground hover:text-foreground/90 hover:bg-hover flex w-full items-center gap-3 px-3 py-3 transition-colors"
                      activeProps={{
                        className:
                          "bg-sidebar-primary/5 text-blue-600! font-medium hover:text-blue-600 hover:bg-sidebar-primary/5",
                      }}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t" />

      <SidebarFooter>
        <div className="p-2">
          <Card className="bg-muted/60 flex cursor-pointer flex-row items-center gap-3 p-3 shadow-sm transition-colors">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="/avatars/admin.png" alt="Admin" />
              <AvatarFallback className="bg-blue-600 font-bold text-white">
                AD
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="text-foreground truncate font-semibold">
                Admin User
              </span>
              <span className="text-muted-foreground truncate text-xs">
                admin@eventflow.com
              </span>
            </div>
          </Card>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
