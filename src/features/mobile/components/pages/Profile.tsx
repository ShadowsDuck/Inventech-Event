import React from "react";

import {
  Bell,
  ChevronRight,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Profile = () => {
  return (
    <div className="animate-in fade-in mx-auto flex min-h-full w-full max-w-2xl flex-col p-4 pt-8 duration-500">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Profile</h1>

      <div className="mb-8 flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-linear-to-tr from-indigo-100 to-violet-100 shadow-md">
          <User className="h-10 w-10 text-indigo-600" />
          <div className="absolute right-0 bottom-0 h-5 w-5 rounded-full border-2 border-white bg-emerald-500"></div>
        </div>
        <h2 className="text-xl font-bold text-slate-900">John Cena</h2>
        <p className="mt-1 text-sm text-slate-500">Senior Event Host</p>

        <div className="mt-6 flex w-full border-t border-slate-100 pt-6">
          <div className="flex-1 border-r border-slate-100">
            <p className="text-3xl font-bold text-slate-900">12</p>
            <p className="mt-1 text-xs font-medium tracking-wider text-slate-500 uppercase">
              Total Jobs
            </p>
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold text-indigo-600">3</p>
            <p className="mt-1 text-xs font-medium tracking-wider text-slate-500 uppercase">
              Upcoming
            </p>
          </div>
        </div>
      </div>

      <div className="mb-auto space-y-2">
        <h3 className="mb-2 px-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
          Settings
        </h3>
        {[
          { icon: User, label: "Edit Profile" },
          { icon: Bell, label: "Notifications" },
          { icon: ShieldCheck, label: "Privacy & Security" },
          { icon: Settings, label: "App Settings" },
        ].map((item, idx) => (
          <button
            key={idx}
            className="group flex w-full items-center justify-between rounded-2xl border border-transparent bg-white p-4 transition-colors hover:border-slate-200 hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900">
                {item.label}
              </span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </button>
        ))}
      </div>

      <div className="mt-10 pb-4">
        <Button
          variant="destructive"
          className="w-full rounded-2xl border-none bg-rose-50 py-6 text-base font-semibold text-rose-600 shadow-none hover:bg-rose-100"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
};
