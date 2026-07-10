"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, ShieldAlert } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type UserType = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  employeeType: string | null;
  position: string | null;
  systemRole: string;
  supervisorId: string | null;
};

export default function UserTableClient({ initialUsers }: { initialUsers: UserType[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = initialUsers.filter(u => 
    (u.name && u.name.includes(searchTerm)) || 
    (u.position && u.position.includes(searchTerm))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">จัดการบุคลากร</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">จัดการรายชื่อ กำหนดสิทธิ์ และผู้กำกับดูแลแผน IDP</p>
        </div>
        <Button className="rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] border-none">
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มบุคลากร
        </Button>
      </div>

      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-purple-900/50 bg-slate-50/50 dark:bg-[#150926]/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="ค้นหารายชื่อ หรือ ตำแหน่ง..." 
              className="pl-10 h-12 rounded-xl border-slate-200 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px] h-12 rounded-xl border-slate-200 dark:border-purple-900/50">
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="ข้าราชการ">ข้าราชการ</SelectItem>
                <SelectItem value="พนักงานราชการ">พนักงานราชการ</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px] h-12 rounded-xl border-slate-200 dark:border-purple-900/50">
                <SelectValue placeholder="สิทธิ์ในระบบ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
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
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden lg:table-cell">ประเภทพนักงาน</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden md:table-cell">ผู้กำกับดูแล (Supervisor)</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap">สิทธิ์ในระบบ</TableHead>
                  <TableHead className="text-right font-bold text-[#2e1065] dark:text-purple-200 px-6 sm:px-8 whitespace-nowrap">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-colors border-slate-100 dark:border-purple-900/30 group">
                    <TableCell className="px-6 sm:px-8 py-4">
                      <div className="font-bold text-slate-700 dark:text-purple-100">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.position}</div>
                    </TableCell>
                    <TableCell className="px-4 hidden lg:table-cell">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {user.employeeType || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 hidden md:table-cell">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{user.supervisorId ? "มีหัวหน้าแล้ว" : "-"}</span>
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
                        <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl" title="แก้ไขสิทธิ์">
                          <ShieldAlert className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl" title="แก้ไขข้อมูล">
                          <Edit2 className="h-4 w-4" />
                        </Button>
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
