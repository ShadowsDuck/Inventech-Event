import { useState } from "react";

import { KeyRound, Loader2, LogOut, Settings, User } from "lucide-react";

import { useLogout } from "@/features/login/api/logout";
import ChangePasswordForm from "@/features/login/components/changePass-form";
import { useAuthStore } from "@/store/auth-store";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface UserCardProfileProps {
  onBeforeOpenDialog?: () => void;
}

export function UserCardProfile({ onBeforeOpenDialog }: UserCardProfileProps) {
  const { mutate: logout, isPending } = useLogout();
  const user = useAuthStore((state) => state.user);
  const API_URL = import.meta.env.VITE_API_URL;

  // State คุม Dialog Change Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // State คุม Popover (เมนู Profile/Settings)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <div className="p-2">
        {/* สั่งให้ Popover ถูกควบคุมด้วย State นี้ */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger className="w-full">
            <Card className="hover:bg-muted/80 bg-muted/60 flex cursor-pointer flex-row items-center gap-3 border-none p-3 shadow-sm transition-colors">
              <Avatar className="h-9 w-9 border">
                <AvatarImage
                  src={
                    user?.avatar
                      ? `${API_URL}/uploads/${user.avatar}`
                      : undefined
                  }
                  alt={user?.fullName || "Admin"}
                />
                <AvatarFallback className="bg-blue-600 font-bold text-white uppercase">
                  <User size={14} />
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

              <Button
                onClick={() => {
                  onBeforeOpenDialog?.();

                  // 1. สั่งปิด Popover ทันที
                  setIsPopoverOpen(false);

                  // 2. สั่งเปิด Modal Password
                  setIsPasswordModalOpen(true);
                }}
                variant="ghost"
                className="h-9 w-full justify-start gap-2 text-sm font-normal"
              >
                <KeyRound className="size-4" />
                Change Password
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

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-106">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <div>
            <ChangePasswordForm
              onSuccess={() => setIsPasswordModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
