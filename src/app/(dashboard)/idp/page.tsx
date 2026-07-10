import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIDPPlans } from "@/actions/idp";
import { format } from "date-fns";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

export default async function IDPListPage() {
  const plans = await getIDPPlans();

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">แผนการพัฒนาทั้งหมด</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">รายการแผนพัฒนาบุคลากรรายบุคคล (IDP) ทั้งหมดของคุณ</p>
        </div>
        <Link href="/idp/create">
          <Button className="rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] border-none">
            <Plus className="w-5 h-5 mr-2" />
            สร้างแผนใหม่
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-purple-950/30">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-purple-900/50">
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 h-14 px-6 sm:px-8 whitespace-nowrap">ชื่อหลักสูตร / แผนงาน</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden lg:table-cell">หมวดหมู่</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden md:table-cell">ผู้กำกับดูแล</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap hidden sm:table-cell">วันที่สร้าง</TableHead>
                  <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-4 whitespace-nowrap">สถานะ</TableHead>
                  <TableHead className="text-right font-bold text-[#2e1065] dark:text-purple-200 px-6 sm:px-8 whitespace-nowrap">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                      ยังไม่มีแผนการพัฒนา
                    </TableCell>
                  </TableRow>
                )}
                {plans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-colors border-slate-100 dark:border-purple-900/30 group">
                    <TableCell className="px-6 sm:px-8 py-5">
                      <div className="font-bold text-slate-700 dark:text-purple-100 line-clamp-2 leading-snug">{plan.courseTitle}</div>
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
                        {plan.planCode || "IDP-LEGACY"}
                      </div>
                      {/* Show category in mobile view */}
                      <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium lg:hidden">{plan.devCategory}</div>
                    </TableCell>
                    <TableCell className="px-4 hidden lg:table-cell">
                      <span className="text-sm font-bold px-2.5 py-1 rounded-md bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50 whitespace-nowrap">
                        {plan.devCategory}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">{plan.supervisorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 hidden sm:table-cell text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                      {plan.createdAt ? format(new Date(plan.createdAt), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge 
                        variant="outline" 
                        className={`font-bold px-3 py-1 rounded-full border shadow-sm whitespace-nowrap
                          ${plan.status === "Approved" || plan.status === "อนุมัติแล้ว" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                          ${plan.status === "Pending" || plan.status === "รออนุมัติ" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : ""}
                          ${plan.status === "In Progress" || plan.status === "กำลังดำเนินการ" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : ""}
                          ${plan.status === "Completed" || plan.status === "เสร็จสิ้น" ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" : ""}
                          ${plan.status === "Draft" || plan.status === "แบบร่าง" ? "bg-slate-50 text-slate-500 border-slate-200" : ""}
                        `}
                      >
                        {plan.status === "Pending" ? "รออนุมัติ" : plan.status === "Approved" ? "อนุมัติแล้ว" : plan.status === "Completed" ? "เสร็จสิ้น" : plan.status === "Draft" ? "แบบร่าง" : plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 sm:px-8">
                      <Link href={`/idp/${plan.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 font-bold transition-all shadow-sm">
                          ดูรายละเอียด
                        </Button>
                      </Link>
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
