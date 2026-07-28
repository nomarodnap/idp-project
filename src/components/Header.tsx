"use client";

import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser } from "@/components/UserProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Header({ currentPhase = 1 }: { currentPhase?: number }) {
  const { avatarUrl, user } = useUser();

  const getPhaseNotification = (phase: number) => {
    switch (phase) {
      case 1:
        return {
          title: "ระบบเปิดให้จัดทำแผน",
          desc: "ระบบเปิดให้คุณสามารถสร้าง แก้ไข และลบแผนพัฒนาบุคลากร (IDP) ประจำปีได้ตามปกติ",
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800"
        };
      case 2:
        return {
          title: "ช่วงเวลาทบทวนแผน",
          desc: "ขณะนี้ระบบอนุญาตให้แก้ไขรายละเอียดของแผนพัฒนาได้ แต่จะไม่สามารถสร้างแผนใหม่หรือลบแผนได้",
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
        };
      case 3:
        return {
          title: "ระบบปิดการจัดทำแผน",
          desc: "ขณะนี้ระบบปิดรับการปรับปรุงแผนพัฒนา คุณสามารถดูรายละเอียดแผนที่ส่งแล้วได้อย่างเดียว",
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800"
        };
      case 4:
        return {
          title: "ช่วงเวลาประเมินผล",
          desc: "ระบบเปิดให้คุณสามารถเข้าถึงเพื่อประเมินผลสำเร็จของแผนพัฒนาด้วยตัวเองได้แล้ว",
          color: "text-purple-600 dark:text-purple-400",
          bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800"
        };
      default:
        return {
          title: "ระบบ IDP",
          desc: "ยินดีต้อนรับสู่ระบบจัดทำแผนพัฒนาบุคลากรรายบุคคล",
          color: "text-slate-500 dark:text-slate-400",
          bg: "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800"
        };
    }
  };

  const notification = getPhaseNotification(currentPhase);

  return (
    <header className="h-20 bg-white/80 dark:bg-[#150a29]/80 backdrop-blur-md border-b border-slate-100 dark:border-purple-900/50 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 transition-colors duration-500 shadow-sm">
      {/* Left side: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <Link href="/" className="flex items-center md:hidden gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-full bg-white dark:bg-white/10 shadow-sm border border-amber-200/50 dark:border-amber-500/30 p-0.5 overflow-hidden">
            <img src="/logo-fisheries.png" alt="กรมประมง" className="w-full h-full object-contain rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#2e1065] dark:text-white">ระบบ IDP</span>
        </Link>

      </div>

      {/* Right side: Notifications, Theme, & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <Popover>
          <PopoverTrigger render={
            <Button variant="ghost" size="icon" className="relative hover:bg-purple-50 dark:hover:bg-purple-900/40">
              <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white dark:border-[#150a29]"></span>
            </Button>
          } />
          <PopoverContent className="w-80 p-4 rounded-2xl shadow-xl border-slate-100 dark:border-purple-900/50 mr-4 mt-2 bg-white dark:bg-[#1a0b2e]" align="end">
            <h4 className="font-bold text-[#2e1065] dark:text-purple-100 mb-3 border-b border-slate-100 dark:border-purple-900/30 pb-2">การแจ้งเตือนระบบ</h4>
            <div className={`p-3 rounded-xl border border-slate-100 dark:border-purple-900/30 ${notification.bg}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${notification.color}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h5 className={`text-sm font-bold ${notification.color}`}>{notification.title}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{notification.desc}</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-purple-900/50">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-bold text-[#2e1065] dark:text-purple-100 leading-none mb-1">
              {user?.name || "ผู้ใช้งานระบบ"}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">
              {user 
                ? (user.employeeType === "ข้าราชการพลเรือนสามัญ" 
                    ? `${user.position || ""}${user.level || ""}`
                    : user.position || "บุคลากร")
                : "บุคลากร"}
            </span>
          </div>
          <Link href="/profile">
            <Avatar className="h-10 w-10 border-2 border-purple-100 dark:border-purple-800 shadow-sm cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
              <AvatarImage src={avatarUrl} alt="User Avatar" />
              <AvatarFallback className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold">ส</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
