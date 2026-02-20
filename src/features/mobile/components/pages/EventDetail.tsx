import React from "react";

import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  MapPin,
  MessageCircle,
  Paperclip,
  Phone,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EventDetail = () => {
  return (
    <div className="animate-in fade-in flex h-full min-h-full flex-col bg-slate-50 duration-500 sm:bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 p-4 pt-6 shadow-sm backdrop-blur-md transition-all sm:rounded-t-3xl sm:px-8 sm:pt-8 sm:shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="-ml-2 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </Link>
            <div>
              <h1 className="text-xl leading-tight font-bold text-slate-900 sm:text-2xl">
                สัมมนาลูกค้าประจำปี 2025
              </h1>
              <span className="mt-1 inline-block rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 sm:p-8 sm:pb-12">
        {/* Main Header Card (Hero Section) */}
        <Card className="group mb-6 overflow-hidden rounded-2xl border-none bg-white shadow-md sm:mb-8">
          <div className="relative flex flex-col gap-5 overflow-hidden bg-indigo-600 p-6 text-white sm:p-8">
            {/* Background Pattern effect */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-400/20 blur-xl"></div>

            <div className="z-10 flex items-start gap-3.5">
              <Calendar className="mt-0.5 h-5 w-5 text-indigo-200 sm:h-6 sm:w-6" />
              <div>
                <p className="text-lg font-semibold sm:text-xl">18 Nov 2025</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-indigo-200 sm:text-base">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Call Time: 08:00
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Event: 09:00 - 16:00
                  </span>
                </div>
              </div>
            </div>

            <div className="z-10 flex items-start gap-3.5">
              <MapPin className="mt-0.5 h-5 w-5 text-indigo-200 sm:h-6 sm:w-6" />
              <div>
                <p className="text-sm leading-relaxed font-medium sm:text-base">
                  Main Auditorium, โรงแรม Grand Hyatt
                  <br />
                  <span className="text-indigo-200">
                    494 ถ. ราชดำริ, ปทุมวัน, กทม.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <CardContent className="flex items-center justify-between bg-indigo-50/50 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="hidden rounded-xl bg-indigo-100 p-2.5 text-indigo-600 sm:block">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Your Role
                </p>
                <p className="mt-0.5 text-lg font-bold text-indigo-900">
                  Event Host
                </p>
              </div>
            </div>
            <Button className="h-11 rounded-xl bg-indigo-600 px-5 text-white shadow-sm hover:bg-indigo-700">
              <MapPin className="mr-2 h-4 w-4" /> Directions
            </Button>
          </CardContent>
        </Card>

        {/* Grid Layout:
          - Mobile: 1 คอลัมน์ (เรียงลงมา)
          - Tablet/Desktop (md): 2 คอลัมน์
        */}
        <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2">
          {/* ---- Left Column ---- */}
          <div className="space-y-5 sm:space-y-8">
            {/* Brief & Schedule */}
            <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="border-b border-slate-100 bg-white pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base text-slate-800 sm:text-lg">
                  <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  กำหนดการ (Run of Show)
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-0">
                <ul className="divide-y divide-slate-50 text-sm sm:text-base">
                  {[
                    { time: "08:00", text: "นัดหมายพนักงาน / บรีฟงาน" },
                    { time: "08:30", text: "แขกเริ่มลงทะเบียน" },
                    { time: "09:00", text: "สัมมนาเริ่ม", highlight: true },
                    { time: "10:30", text: "พักเบรก (ประสานงาน Catering)" },
                    { time: "16:00", text: "งานเลิก / เก็บของ" },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className={`flex gap-4 p-4 transition-colors sm:p-5 ${item.highlight ? "bg-indigo-50/60" : "hover:bg-slate-50"}`}
                    >
                      <span
                        className={`w-12 shrink-0 font-bold sm:w-14 ${item.highlight ? "text-indigo-600" : "text-slate-900"}`}
                      >
                        {item.time}
                      </span>
                      <span
                        className={`leading-relaxed ${item.highlight ? "font-medium text-indigo-900" : "text-slate-600"}`}
                      >
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4 text-sm sm:p-5 sm:text-base">
                  <span className="font-bold text-slate-700">
                    👗 การแต่งกาย:
                  </span>
                  <br className="sm:hidden" />
                  <span className="text-slate-600 sm:ml-1">
                    เสื้อสูทของบริษัท, เสื้อเชิ้ตดำ, กางเกงดำ
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Equipment & Documents */}
            <Card className="rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base text-slate-800 sm:text-lg">
                  <div className="rounded-lg bg-violet-50 p-1.5 text-violet-600">
                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  อุปกรณ์ & เอกสาร
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-5 sm:p-6">
                {/* Equipment */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Equipment
                  </h4>
                  <ul className="space-y-2.5 text-sm text-slate-700 sm:text-base">
                    <li className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"></div>
                      <span>2x Walkie-Talkie (วอ) (ตั้งค่าช่อง 3)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"></div>
                      <span>1x iPad (สำหรับเช็กชื่อแขก)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"></div>
                      <span>1x Clicker (สำหรับผู้บรรยาย)</span>
                    </li>
                  </ul>
                </div>

                {/* Documents */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Documents
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: "รายชื่อแขก (Guest List).pdf", type: "pdf" },
                      { name: "ผังที่นั่ง (Floor Plan).png", type: "img" },
                      { name: "สคริปต์พิธีกร (MC Script).doc", type: "doc" },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-slate-200 hover:bg-slate-50"
                      >
                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="truncate text-sm font-medium text-slate-700 sm:text-base">
                          {doc.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---- Right Column ---- */}
          <div className="space-y-5 sm:space-y-8">
            {/* On-site Team */}
            <Card className="rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base text-slate-800 sm:text-lg">
                  <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  ทีมงาน (On-site)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 sm:p-5">
                {[
                  {
                    name: "Sarah Johnson",
                    role: "Team Lead",
                    initial: "SJ",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    name: "Mike Chen",
                    role: "Coordinator",
                    initial: "MC",
                    color: "bg-orange-100 text-orange-700",
                  },
                  {
                    name: "Emma Davis",
                    role: "Event Host",
                    initial: "ED",
                    color: "bg-fuchsia-100 text-fuchsia-700",
                  },
                ].map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-sm sm:h-11 sm:w-11 ${member.color}`}
                      >
                        {member.initial}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 sm:text-base">
                          {member.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500 sm:text-sm">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-slate-200 text-slate-600 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:h-10 sm:w-10"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-slate-200 text-slate-600 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:h-10 sm:w-10"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Outsource Tasks */}
            <Card className="rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2.5 text-base text-slate-800 sm:text-lg">
                  <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  Outsource Check-in
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-4 sm:space-y-4 sm:p-5">
                {/* Pending Check-in */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-200">
                  <div>
                    <p className="text-sm font-bold text-slate-900 sm:text-base">
                      Somsak
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                      Technician
                    </p>
                  </div>
                  <Button className="h-9 rounded-xl bg-indigo-600 px-4 text-white shadow-sm hover:bg-indigo-700 sm:h-10">
                    <Clock className="mr-1.5 h-4 w-4" /> Check in
                  </Button>
                </div>

                {/* Completed Check-in */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 sm:text-base">
                      Malee
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                      Technician
                    </p>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1.5 border-none bg-emerald-100 px-2.5 py-1 font-bold text-emerald-700 shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Checked in
                    </Badge>
                    <p className="mt-1.5 text-[10px] font-semibold text-emerald-600 sm:text-xs">
                      at 08:05 AM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
