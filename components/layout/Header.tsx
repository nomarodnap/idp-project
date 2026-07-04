"use client";

import { Bell, Search, Menu, Home, User, FileEdit, History, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';

const navItems = [
  { name: 'หน้าหลัก', href: '/', icon: Home },
  { name: 'ข้อมูลส่วนบุคคล', href: '/profile', icon: User },
  { name: 'จัดทำแผน IDP', href: '/create-idp', icon: FileEdit },
  { name: 'ประวัติการพัฒนา', href: '/history', icon: History },
  { name: 'คู่มือการใช้งาน', href: '/manual', icon: BookOpen },
];

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[#1e3a8a] p-0 text-white">
            <div className="flex h-16 items-center justify-center border-b border-[#2d4b9f]">
              <h1 className="text-xl font-bold tracking-wider">กรมประมง</h1>
            </div>
            <nav className="space-y-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  <item.icon className="h-5 w-5 opacity-90" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="ค้นหา..."
            className="w-64 rounded-full bg-gray-100 pl-9 border-none focus-visible:ring-1 focus-visible:ring-[#1e3a8a]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-[#1e3a8a]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <div className="hidden h-8 w-px bg-gray-200 md:block" />
        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-sm font-medium">สมชาย ใจดี</span>
            <span className="text-xs text-gray-500">นักวิชาการประมง</span>
          </div>
          <Avatar className="h-9 w-9 border">
            <AvatarImage src="https://i.pravatar.cc/150?img=11" alt="User Profile" />
            <AvatarFallback>ส</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
