"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatThaiDate } from "@/lib/date";

export default function IDPTableClient({ initialPlans, IDP_PHASE }: { initialPlans: any[], IDP_PHASE: number }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("ทุกปีงบประมาณ");
  const itemsPerPage = 25;
  
  const availableYears = Array.from(new Set(initialPlans.map(p => p.fiscalYear).filter(Boolean))).sort((a, b) => (b as number) - (a as number));

  const filteredPlans = initialPlans.filter(p => {
    const matchesSearch = p.courseTitle.includes(searchTerm) ||
      (p.planCode && p.planCode.includes(searchTerm)) ||
      (p.devCategory && p.devCategory.includes(searchTerm)) ||
      (p.devTopic && p.devTopic.includes(searchTerm));
    const matchesStatus = statusFilter === "ทั้งหมด" || p.status === statusFilter;
    const matchesYear = yearFilter === "ทุกปีงบประมาณ" || p.fiscalYear === parseInt(yearFilter);
    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const exportData = filteredPlans.map(p => {
        return {
          "รหัสแผน": p.planCode || "IDP-LEGACY",
          "ชื่อหลักสูตร": p.courseTitle,
          "ปีงบประมาณ": p.fiscalYear,
          "สถานะ": p.status,
          "หมวดหมู่": p.devCategory,
          "หัวข้อการพัฒนา": p.devTopic,
          "70% (ประสบการณ์)": p.dev70,
          "20% (ผู้อื่น)": p.dev20,
          "10% (อบรม)": p.dev10,
          "ผู้กำกับดูแล": p.supervisorName || "-",
          "วันที่ส่งแผน": p.createdAt ? formatThaiDate(p.createdAt) : "-"
        };
      });
      
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "My IDP Plans");
      
      XLSX.writeFile(workbook, `My_IDP_Plans_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">แผนการพัฒนาทั้งหมด</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">รายการแผนพัฒนาบุคลากรรายบุคคล (IDP) ทั้งหมดของคุณ</p>
        </div>
        {IDP_PHASE === 1 && (
          <Link href="/idp/create">
            <Button className="rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] border-none">
              <Plus className="w-5 h-5 mr-2" />
              สร้างแผนใหม่
            </Button>
          </Link>
        )}
      </div>

      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-purple-900/50 bg-slate-50/50 dark:bg-[#150926]/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="ค้นหาแผน, หมวดหมู่ หรือ หัวข้อ..."
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
                <SelectItem value="กำลังดำเนินการ">กำลังดำเนินการ</SelectItem>
                <SelectItem value="รอประเมินผล">รอประเมินผล</SelectItem>
                <SelectItem value="สำเร็จ">สำเร็จ</SelectItem>
                <SelectItem value="ไม่สำเร็จ">ไม่สำเร็จ</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={exportToExcel}
              className="h-12 px-4 rounded-xl border-slate-200 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e] hidden sm:flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#2e1065]"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-purple-950/30">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-purple-900/50">
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 h-14 px-6 sm:px-8 whitespace-nowrap">ชื่อหลักสูตร / รหัสแผน</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden lg:table-cell">หมวดหมู่ / หัวข้อการพัฒนา</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden xl:table-cell">สัดส่วนการพัฒนา (70:20:10)</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden md:table-cell">ผู้กำกับดูแล</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden sm:table-cell">วันที่ส่งแผน</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap">สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
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
                    <TableCell className="px-6 sm:px-8 py-5">
                      <div className="font-bold text-slate-700 dark:text-purple-100 truncate max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[150px] xl:max-w-[200px] leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all">{plan.courseTitle}</div>
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
                        {plan.planCode || "IDP-LEGACY"}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium lg:hidden">
                        {plan.devCategory}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 hidden lg:table-cell">
                      <div className="font-bold text-slate-700 dark:text-purple-100">{plan.devCategory}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.devTopic}</div>
                    </TableCell>
                    <TableCell className="px-4 hidden xl:table-cell max-w-[200px]">
                      <div className="flex flex-col gap-1 text-xs">
                        {plan.dev70 && plan.dev70.trim() !== "" && plan.dev70 !== "-" && plan.dev70 !== "ไม่มี" && (
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] leading-none shrink-0">70</span>
                            <span className="truncate text-slate-600 dark:text-slate-400" title={plan.dev70}>{plan.dev70}</span>
                          </div>
                        )}
                        {plan.dev20 && plan.dev20.trim() !== "" && plan.dev20 !== "-" && plan.dev20 !== "ไม่มี" && (
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400 px-1.5 py-0.5 rounded text-[10px] leading-none shrink-0">20</span>
                            <span className="truncate text-slate-600 dark:text-slate-400" title={plan.dev20}>{plan.dev20}</span>
                          </div>
                        )}
                        {plan.dev10 && plan.dev10.trim() !== "" && plan.dev10 !== "-" && plan.dev10 !== "ไม่มี" && (
                          <div className="flex items-start gap-1.5">
                            <span className="font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] leading-none shrink-0">10</span>
                            <span className="truncate text-slate-600 dark:text-slate-400" title={plan.dev10}>{plan.dev10}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 dark:text-purple-100">{plan.supervisorName}</span>
                        {plan.supervisorPosition && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.supervisorPosition}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 hidden sm:table-cell whitespace-nowrap">
                      <div className="font-bold text-slate-700 dark:text-purple-100">{formatThaiDate(plan.createdAt)}</div>
                      {plan.updatedAt && new Date(plan.updatedAt).getTime() !== new Date(plan.createdAt).getTime() && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">แก้ไข: {formatThaiDate(plan.updatedAt)}</div>
                      )}
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

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-purple-900/50 flex items-center justify-between bg-slate-50/30 dark:bg-[#150926]/30">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium px-4">
                แสดง {((currentPage - 1) * itemsPerPage) + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredPlans.length)} จาก {filteredPlans.length} รายการ
              </span>
              <div className="flex gap-2 pr-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-slate-200 dark:border-purple-800 text-slate-600 dark:text-purple-300 font-bold"
                >
                  ก่อนหน้า
                </Button>
                <div className="flex items-center justify-center px-4 rounded-xl bg-white dark:bg-[#1a0b2e] border border-slate-200 dark:border-purple-800 text-sm font-black text-[#2e1065] dark:text-purple-200 shadow-sm">
                  {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-slate-200 dark:border-purple-800 text-slate-600 dark:text-purple-300 font-bold"
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
