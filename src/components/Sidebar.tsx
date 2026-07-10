"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, FileEdit, History, BookOpen, Anchor, ChevronLeft, ChevronRight, LogOut, Shield, Users, CheckSquare, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "หน้าหลัก", icon: Home, href: "/" },
  { name: "ข้อมูลส่วนบุคคล", icon: User, href: "/profile" },
  { name: "จัดทำแผน IDP", icon: FileEdit, href: "/idp/create" },
  { name: "ประวัติการพัฒนา", icon: History, href: "/idp" },
  { name: "คู่มือการใช้งาน", icon: BookOpen, href: "#" },
];

const adminItems = [
  { name: "แดชบอร์ด (Overview)", icon: Shield, href: "/admin", exact: true },
  { name: "จัดการบุคลากร", icon: Users, href: "/admin/users", exact: false },
  { name: "อนุมัติแผน IDP", icon: CheckSquare, href: "/admin/approvals", exact: false },
  { name: "จัดการข้อมูลพื้นฐาน", icon: Database, href: "/admin/master-data", exact: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "bg-white dark:bg-[#150a29] border-r border-slate-100 dark:border-purple-900/50 flex flex-col h-full shadow-sm z-10 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-[#1a0b2e] border border-slate-200 dark:border-purple-800 rounded-full p-1 shadow-md z-20 text-slate-500 hover:text-[#2e1065] dark:text-purple-300 dark:hover:text-white transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo Area */}
      <div className={cn("h-20 flex items-center border-b border-slate-100 dark:border-purple-900/50 relative overflow-hidden", isCollapsed ? "px-0 justify-center" : "px-6")}>
        {/* Subtle gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-purple-600 to-amber-400" />
        <Link href="/" className={cn("flex items-center gap-3 hover:opacity-80 transition-opacity", isCollapsed ? "justify-center w-full px-0" : "")}>
          <div className="h-10 w-10 rounded-full bg-white dark:bg-white/10 shadow-md border border-amber-200/50 dark:border-amber-500/30 p-0.5 shrink-0 overflow-hidden relative group">
            <img src="/logo-fisheries.png" alt="กรมประมง" className="w-full h-full object-contain rounded-full transition-transform duration-500 group-hover:scale-110" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-[#2e1065] dark:text-white leading-tight">ระบบ IDP</span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">กรมประมง</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 overflow-x-hidden">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-300 group relative",
                  isCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-3",
                  isActive 
                    ? "bg-purple-50 dark:bg-purple-900/40 text-[#4c1d95] dark:text-purple-200 font-bold shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-purple-900/20 hover:text-[#2e1065] dark:hover:text-purple-300 font-medium"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-amber-500 rounded-r-full" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-amber-500" : "text-slate-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400"
                )} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin Navigation */}
        <div className="mt-6 px-3">
          {!isCollapsed && <h3 className="px-4 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Management</h3>}
          <nav className="space-y-1">
            {adminItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-300 group relative",
                    isCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-3",
                    isActive 
                      ? "bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-bold shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-purple-900/20 hover:text-amber-600 dark:hover:text-amber-400 font-medium"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-amber-500 rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-amber-500" : "text-slate-400 dark:text-slate-500 group-hover:text-amber-500 dark:group-hover:text-amber-400"
                  )} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-3 pb-4">
        <button
          onClick={async () => {
            const { logout } = await import("@/actions/auth");
            await logout();
            window.location.href = "/login";
          }}
          className={cn(
            "flex items-center w-full rounded-xl transition-all duration-300 group relative text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
            isCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-3 font-medium"
          )}
          title={isCollapsed ? "ออกจากระบบ" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
          {!isCollapsed && <span>ออกจากระบบ</span>}
        </button>
      </div>

      {/* System Status */}
      <div className={cn("border-t border-slate-100 dark:border-purple-900/50", isCollapsed ? "p-4 flex justify-center" : "p-6")}>
        {isCollapsed ? (
          <div className="relative flex h-3 w-3" title="System Online: เชื่อมต่อกับ DPIS 6 สมบูรณ์">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-[#1a0b2e] rounded-xl p-4 border border-slate-100 dark:border-purple-900/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-purple-200">System Online</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">เชื่อมต่อกับ DPIS 6 สมบูรณ์</p>
          </div>
        )}
      </div>
    </aside>
  );
}
