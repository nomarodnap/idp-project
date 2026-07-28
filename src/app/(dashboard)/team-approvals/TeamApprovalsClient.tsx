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
import { useRouter } from "next/navigation";
import { formatThaiDate } from "@/lib/date";

export default function TeamApprovalsClient({ initialPlans }: { initialPlans: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("ทุกปีงบประมาณ");
  const itemsPerPage = 10;
  
  const availableYears = Array.from(new Set(initialPlans.map(p => p.fiscalYear).filter(Boolean))).sort((a, b) => (b as number) - (a as number));

  const pendingPlans = initialPlans.filter(p => {
    const matchesSearch = p.courseTitle.includes(searchTerm) ||
      (p.planCode && p.planCode.includes(searchTerm)) ||
      (p.userDepartment && p.userDepartment.includes(searchTerm)) ||
      (p.userName && p.userName.includes(searchTerm)) ||
      (p.userEmployeeType && p.userEmployeeType.includes(searchTerm));
    const matchesStatus = statusFilter === "ทั้งหมด" || p.status === statusFilter;
    const matchesYear = yearFilter === "ทุกปีงบประมาณ" || p.fiscalYear === parseInt(yearFilter);
    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalPages = Math.ceil(pendingPlans.length / itemsPerPage);
  const paginatedPlans = pendingPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val: string) => {
    setYearFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">ตรวจสอบแผนลูกทีม</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">ดูและติดตามแผนพัฒนาของบุคลากรที่ส่งถึงคุณ</p>
        </div>
      </div>

      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-purple-900/50 bg-slate-50/50 dark:bg-[#150926]/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="ค้นหาแผน, ชื่อ, สังกัด หรือ ประเภทบุคลากร..."
              className="pl-10 h-12 rounded-xl border-slate-200 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Select value={yearFilter} onValueChange={(val) => val && handleYearChange(val)}>
              <SelectTrigger className="w-full sm:w-[150px] h-12 rounded-xl border-slate-200 dark:border-purple-900/50">
                <SelectValue placeholder="ปีงบประมาณ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทุกปีงบประมาณ">ทุกปีงบประมาณ</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year?.toString() || ""}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(val) => val && handleStatusChange(val)}>
              <SelectTrigger className="w-full sm:w-[170px] h-12 rounded-xl border-slate-200 dark:border-purple-900/50">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                <SelectItem value="รออนุมัติ">รออนุมัติ</SelectItem>
                <SelectItem value="กำลังดำเนินการ">กำลังดำเนินการ</SelectItem>
                <SelectItem value="รอประเมินผล">รอประเมินผล</SelectItem>
                <SelectItem value="สำเร็จ">สำเร็จ</SelectItem>
                <SelectItem value="ไม่สำเร็จ">ไม่สำเร็จ</SelectItem>
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
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden lg:table-cell">ประเภทบุคลากร</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden xl:table-cell">ผู้กำกับดูแล</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap">สถานะ</TableHead>
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
                {paginatedPlans.map((plan) => (
                  <TableRow
                    key={plan.id}
                    onClick={() => router.push(`/idp/${plan.id}`)}
                    className="hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-colors border-slate-100 dark:border-purple-900/30 group cursor-pointer"
                  >
                    <TableCell className="px-6 sm:px-8 py-4">
                      <div className="font-bold text-slate-700 dark:text-purple-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all">
                        {plan.courseTitle}
                      </div>
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
                        {plan.planCode || "IDP-LEGACY"}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {plan.updatedAt && new Date(plan.updatedAt).getTime() !== new Date(plan.createdAt).getTime() ? (
                          <>แก้ไขเมื่อ: {formatThaiDate(plan.updatedAt)}</>
                        ) : (
                          <>ส่งเมื่อ: {formatThaiDate(plan.createdAt)}</>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-purple-800 bg-slate-100 dark:bg-purple-900/50 flex items-center justify-center">
                          {plan.userAvatarUrl || plan.userImage ? (
                            <img
                              src={plan.userAvatarUrl || plan.userImage}
                              alt={plan.userName || ""}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-slate-500 dark:text-purple-300 font-bold text-sm uppercase">
                              {plan.userName ? plan.userName.charAt(0) : "?"}
                            </span>
                          )}
                        </div>
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
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {plan.userEmployeeType || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 hidden xl:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {plan.supervisorName || "-"}
                        </span>
                        {plan.supervisorPosition && (
                          <span className="text-xs text-slate-500 mt-0.5">
                            {plan.supervisorPosition}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge
                        variant="outline"
                        className={`font-bold px-3 py-1 rounded-full border shadow-sm whitespace-nowrap
                          ${plan.status === "สำเร็จ" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                          ${plan.status === "รออนุมัติ" || plan.status === "รอประเมินผล" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : ""}
                          ${plan.status === "กำลังดำเนินการ" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : ""}
                          ${plan.status === "ไม่สำเร็จ" ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800" : ""}
                          ${plan.status === "แบบร่าง" ? "bg-slate-50 text-slate-500 border-slate-200" : ""}
                        `}
                      >
                        {plan.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-[#1a0b2e] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-purple-900/50">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            แสดงหน้า {currentPage} จาก {totalPages} (ทั้งหมด {pendingPlans.length} รายการ)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-slate-200 dark:border-purple-800 text-slate-700 dark:text-purple-300"
            >
              ก่อนหน้า
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border-slate-200 dark:border-purple-800 text-slate-700 dark:text-purple-300"
            >
              ถัดไป
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
