import Link from 'next/link';
import { Home, User, FileEdit, History, BookOpen } from 'lucide-react';

const navItems = [
  { name: 'หน้าหลัก', href: '/', icon: Home },
  { name: 'ข้อมูลส่วนบุคคล', href: '/profile', icon: User },
  { name: 'จัดทำแผน IDP', href: '/create-idp', icon: FileEdit },
  { name: 'ประวัติการพัฒนา', href: '/history', icon: History },
  { name: 'คู่มือการใช้งาน', href: '/manual', icon: BookOpen },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col bg-[#1e3a8a] text-white md:flex">
      <div className="flex h-16 items-center justify-center border-b border-[#2d4b9f]">
        <h1 className="text-xl font-bold tracking-wider">กรมประมง</h1>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
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
      <div className="p-4 border-t border-[#2d4b9f]">
        <div className="text-xs text-white/60 text-center">
          ระบบจัดทำแผนพัฒนารายบุคคล
        </div>
      </div>
    </aside>
  );
}
