"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, ShieldAlert } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { useState, useTransition } from "react";
import { updateUserRole } from "@/actions/user";

type UserType = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  employeeType: string | null;
  position: string | null;
  level: string | null;
  systemRole: string;
  department: string | null;
  division: string | null;
  avatarUrl: string | null;
  image: string | null;
};

export default function UserTableClient({ initialUsers }: { initialUsers: UserType[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ทั้งหมด");
  const [roleFilter, setRoleFilter] = useState("ทั้งหมด");
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, newRole: string) => {
    startTransition(async () => {
      await updateUserRole(userId, newRole);
    });
  };

  const filteredUsers = initialUsers.filter(u => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      (u.name && u.name.toLowerCase().includes(searchLower)) ||
      (u.position && u.position.toLowerCase().includes(searchLower)) ||
      (u.level && u.level.toLowerCase().includes(searchLower)) ||
      (u.department && u.department.toLowerCase().includes(searchLower)) ||
      (u.division && u.division.toLowerCase().includes(searchLower));
    const matchType = typeFilter === "ทั้งหมด" || u.employeeType === typeFilter;
    const matchRole = roleFilter === "ทั้งหมด" || u.systemRole === roleFilter;
    return matchSearch && matchType && matchRole;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">จัดการบุคลากร</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">จัดการรายชื่อ กำหนดสิทธิ์ และผู้กำกับดูแลแผน IDP</p>
        </div>
      </div>

      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-purple-900/50 bg-slate-50/50 dark:bg-[#150926]/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="ค้นหารายชื่อ, ตำแหน่ง หรือ สังกัด..."
              className="pl-10 h-12 rounded-xl border-slate-200 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "ทั้งหมด")}>
              <SelectTrigger className="w-full sm:w-[150px] h-12 rounded-xl border-slate-200 dark:border-purple-900/50">
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                <SelectItem value="ข้าราชการพลเรือนสามัญ">ข้าราชการ</SelectItem>
                <SelectItem value="พนักงานราชการทั่วไป">พนักงานราชการ</SelectItem>
                <SelectItem value="ลูกจ้างประจำ">ลูกจ้าง</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || "ทั้งหมด")}>
              <SelectTrigger className="w-full sm:w-[150px] h-12 rounded-xl border-slate-200 dark:border-purple-900/50">
                <SelectValue placeholder="สิทธิ์ในระบบ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-purple-950/30">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-purple-900/50">
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 h-14 px-6 sm:px-8 whitespace-nowrap">รายชื่อ / ตำแหน่ง</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden md:table-cell">สังกัด / ฝ่าย</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden lg:table-cell">ประเภทบุคลากร</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap">สิทธิ์ในระบบ</TableHead>
                  <TableHead className="text-right font-bold text-[#2e1065] dark:text-purple-200 px-6 sm:px-8 whitespace-nowrap">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-colors border-slate-100 dark:border-purple-900/30 group">
                    <TableCell className="px-6 sm:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-purple-800 bg-slate-100 dark:bg-purple-900/50 flex items-center justify-center">
                          {user.avatarUrl || user.image ? (
                            <img
                              src={user.avatarUrl || user.image || undefined}
                              alt={user.name || ""}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-slate-500 dark:text-purple-300 font-bold text-sm uppercase">
                              {user.name ? user.name.charAt(0) : "?"}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="font-bold text-slate-700 dark:text-purple-100">{user.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {user.employeeType === "ข้าราชการพลเรือนสามัญ" && user.level
                              ? `${user.position}${user.level}`
                              : user.position || "-"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 hidden md:table-cell">
                      <div className="font-bold text-slate-700 dark:text-purple-100">{user.department || "-"}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.division || "-"}</div>
                    </TableCell>
                    <TableCell className="px-4 hidden lg:table-cell">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {user.employeeType || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge
                        variant="outline"
                        className={`font-bold px-3 py-1 rounded-full border shadow-sm whitespace-nowrap
                          ${user.systemRole === "Admin" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" : ""}
                          ${user.systemRole === "Supervisor" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : ""}
                          ${user.systemRole === "User" ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" : ""}
                        `}
                      >
                        {user.systemRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 sm:px-8">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl" title="แก้ไขสิทธิ์" disabled={isPending} />}>
                            <ShieldAlert className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-slate-100 dark:border-purple-800 bg-white dark:bg-[#1a0b2e]">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="font-bold text-[#2e1065] dark:text-purple-200">แก้ไขสิทธิ์</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-slate-100 dark:bg-purple-900/50" />
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleChange(user.id, "User")}>
                                User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleChange(user.id, "Supervisor")}>
                                Supervisor
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleChange(user.id, "Admin")}>
                                Admin
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
