import { useState } from "react";

// 1. เพิ่ม useState
import { KeyRound, Loader2, LogOut, Settings, User } from "lucide-react";

// 3. Import ฟอร์มที่เราเพิ่งเขียนไป

import { useLogout } from "@/features/login/api/logout";
import ChangePasswordForm from "@/features/login/components/changePass-form";
import { useAuthStore } from "@/store/auth-store";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
// 2. Import Dialog components (เช็ค Path ของคุณด้วยนะครับว่าอยู่ตรงนี้ไหม)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// <-- แก้ path ให้ตรงกับไฟล์ของคุณ

export function UserCardProfile() {
  const { mutate: logout, isPending } = useLogout();
  const user = useAuthStore((state) => state.user);

  // สร้าง State ควบคุมการเปิด/ปิด Popup เปลี่ยนรหัสผ่าน
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <>
      {/* --- ส่วนของ Popover เดิมของคุณ --- */}
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

              {/* --- จุดที่แก้ไข: ผูกปุ่มเข้ากับ State --- */}
              <Button
                onClick={() => setIsPasswordModalOpen(true)}
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
                {/* (โค้ด Logout เดิมของคุณ) */}
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

      {/* --- ส่วนที่เพิ่มใหม่: Popup (Dialog) เปลี่ยนรหัสผ่าน --- */}
      {/* วางไว้ข้างนอก Popover เพื่อไม่ให้เกิดบัคเวลากดพื้นที่ว่างแล้วกล่องหายพร้อมกัน */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          {/* เอา Form ที่เราสร้างไว้มาวาง และส่งฟังก์ชันปิด Popup ให้มันด้วย */}
          <div className="mt-4">
            <ChangePasswordForm
              onSuccessCallback={() => setIsPasswordModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
