"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Search, Clock, MessageSquareText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

export default function ApprovalsClient({ initialPlans }: { initialPlans: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const pendingPlans = initialPlans.filter(p => {
    const matchesSearch = p.courseTitle.includes(searchTerm) || 
                          (p.planCode && p.planCode.includes(searchTerm)) || 
                          (p.userDepartment && p.userDepartment.includes(searchTerm)) || 
                          (p.userName && p.userName.includes(searchTerm));
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "pending" && p.status === "รออนุมัติ") ||
      (statusFilter === "approved" && p.status === "อนุมัติแล้ว");
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">ระบบอนุมัติแผน IDP</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">ตรวจสอบและอนุมัติแผนพัฒนาของพนักงานในความดูแล</p>
        </div>
      </div>

      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-purple-900/50 bg-slate-50/50 dark:bg-[#150926]/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="ค้นหาแผน, หมวดหมู่ หรือ สังกัด..." 
              className="pl-10 h-12 rounded-xl border-slate-200 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Select defaultValue="all" onValueChange={(val) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-full sm:w-[150px] h-12 rounded-xl border-slate-200 dark:border-purple-900/50">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="pending">รออนุมัติ</SelectItem>
                <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-purple-950/30">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-purple-900/50">
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 h-14 px-6 sm:px-8 whitespace-nowrap">แผนงาน / หลักสูตร</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap">ผู้ส่งแผน</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden md:table-cell">สังกัด</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden lg:table-cell">หมวดหมู่</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap">สถานะ</TableHead>
                  <TableHead className="text-right font-bold text-[#2e1065] dark:text-purple-200 px-6 sm:px-8 whitespace-nowrap">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      ไม่พบข้อมูลแผน IDP
                    </TableCell>
                  </TableRow>
                ) : null}
                {pendingPlans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-colors border-slate-100 dark:border-purple-900/30 group">
                    <TableCell className="px-6 sm:px-8 py-4">
                      <div className="font-bold text-slate-700 dark:text-purple-100 line-clamp-2">{plan.courseTitle}</div>
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
                        {plan.planCode || "IDP-LEGACY"}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> ส่งเมื่อ: {plan.createdAt ? format(new Date(plan.createdAt), "dd/MM/yyyy") : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#4c1d95] dark:text-purple-300">
                          {plan.userName || "ไม่ระบุ"}
                        </span>
                        {plan.userPosition && (
                          <span className="text-xs text-slate-500 mt-0.5">
                            {plan.userEmployeeType === "ข้าราชการพลเรือนสามัญ" && plan.userLevel 
                              ? `${plan.userPosition}${plan.userLevel}`
                              : plan.userPosition}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {plan.userDepartment || "-"}
                        </span>
                        {plan.userDivision && (
                          <span className="text-xs text-slate-500 mt-0.5">
                            {plan.userDivision}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 hidden lg:table-cell">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {plan.devCategory}
                      </span>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge 
                        variant="outline" 
                        className={`font-bold px-3 py-1 rounded-full border shadow-sm whitespace-nowrap
                          ${plan.status === "Approved" || plan.status === "อนุมัติแล้ว" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                          ${plan.status === "Pending" || plan.status === "รออนุมัติ" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : ""}
                          ${plan.status === "Completed" || plan.status === "เสร็จสิ้น" ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" : ""}
                          ${plan.status === "Draft" || plan.status === "แบบร่าง" ? "bg-slate-50 text-slate-500 border-slate-200" : ""}
                        `}
                      >
                        {plan.status === "Pending" ? "รออนุมัติ" : plan.status === "Approved" ? "อนุมัติแล้ว" : plan.status === "Completed" ? "เสร็จสิ้น" : plan.status === "Draft" ? "แบบร่าง" : plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 sm:px-8">
                      <div className="flex justify-end items-center gap-2">
                        {plan.status === "Pending" || plan.status === "รออนุมัติ" ? (
                          <>
                            <Button variant="ghost" size="icon" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl" title="อนุมัติ">
                              <CheckCircle2 className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl" title="ส่งกลับแก้ไข">
                              <XCircle className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl" title="ให้ข้อเสนอแนะ">
                              <MessageSquareText className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Link href={`/idp/${plan.id}`}>
                            <Button variant="outline" size="sm" className="rounded-xl border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 font-bold transition-all shadow-sm">
                              ดูแผน
                            </Button>
                          </Link>
                        )}
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
