import { Loader2, LogOut, Settings, User } from "lucide-react";

import { useLogout } from "@/features/login/api/logout";
import { useAuthStore } from "@/store/auth-store";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function UserCardProfile() {
  const { mutate: logout, isPending } = useLogout();
  const user = useAuthStore((state) => state.user);

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="p-2">
      <Popover>
        <PopoverTrigger>
          <Card className="hover:bg-muted/80 bg-muted/60 flex cursor-pointer flex-row items-center gap-3 border-none p-3 shadow-sm transition-colors">
            <Avatar className="h-9 w-9 border">
              <AvatarImage
                src={`${API_URL}/uploads/${user?.avatar}`}
                alt="Admin"
              />
              <AvatarFallback className="bg-blue-600 font-bold text-white uppercase">
                {user?.fullName?.substring(0, 2).toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="text-foreground truncate font-semibold">
                {user?.fullName || "Unknown User"}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email || "no-email@eventflow.com"}
              </span>
            </div>
          </Card>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          sideOffset={6}
          align="center"
          className="w-50 rounded-lg p-2"
        >
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-2 text-sm font-normal"
            >
              <User className="size-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-full justify-start gap-2 text-sm font-normal"
            >
              <Settings className="size-4" />
              Settings
            </Button>

            <div className="my-1 border-t" />

            <Button
              onClick={() => logout()}
              disabled={isPending}
              variant="ghost"
              className="h-9 w-full justify-start gap-2 text-sm font-normal text-red-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-4" />
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <p>Logging out...</p>
                </span>
              ) : (
                "Logout"
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
