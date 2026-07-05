"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser } from "@/components/UserProvider";

export function Header() {
  const { avatarUrl } = useUser();

  return (
    <header className="h-20 bg-white/80 dark:bg-[#150a29]/80 backdrop-blur-md border-b border-slate-100 dark:border-purple-900/50 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 transition-colors duration-500 shadow-sm">
      {/* Left side: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center md:hidden gap-2">
          <div className="h-8 w-8 rounded-full bg-white dark:bg-white/10 shadow-sm border border-amber-200/50 dark:border-amber-500/30 p-0.5 overflow-hidden">
            <img src="/logo-fisheries.png" alt="กรมประมง" className="w-full h-full object-contain rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#2e1065] dark:text-white">ระบบ IDP</span>
        </div>

        <div className="hidden md:flex relative w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
          <Input 
            type="search" 
            placeholder="ค้นหาแผนพัฒนาสมรรถนะ..." 
            className="w-full pl-9 bg-slate-50 dark:bg-[#1a0b2e] border-slate-200 dark:border-purple-900/50 focus-visible:ring-purple-500/30 focus-visible:bg-white dark:focus-visible:bg-[#230f3f] rounded-xl transition-all text-[#2e1065] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right side: Notifications, Theme, & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative hover:bg-purple-50 dark:hover:bg-purple-900/40">
          <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white dark:border-[#150a29]"></span>
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-purple-900/50">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-bold text-[#2e1065] dark:text-purple-100 leading-none mb-1">สมชาย ใจดี</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">นักวิชาการประมงปฏิบัติการ</span>
          </div>
          <Avatar className="h-10 w-10 border-2 border-purple-100 dark:border-purple-800 shadow-sm cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
            <AvatarImage src={avatarUrl} alt="User Avatar" />
            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold">ส</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
