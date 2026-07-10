import { notFound } from "next/navigation";
import { getIDPPlanById } from "@/actions/idp";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, User } from "lucide-react";
import DeletePlanButton from "./DeletePlanButton";

export default async function IDPDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plan = await getIDPPlanById(resolvedParams.id);

  if (!plan) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="ghost" className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับสู่หน้าหลัก
          </Button>
        </Link>
        
        {plan.status !== "Approved" && plan.status !== "อนุมัติแล้ว" && plan.status !== "Completed" && plan.status !== "เสร็จสิ้น" && (
          <div className="flex items-center gap-2">
            <DeletePlanButton planId={plan.id} />
            <Link href={`/idp/${plan.id}/edit`}>
              <Button variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-bold rounded-xl shadow-sm">
                <FileText className="w-4 h-4 mr-2" />
                แก้ไขแผนพัฒนา
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b-2 border-purple-100 dark:border-purple-800/50 pb-6">
          <div>
            <Badge 
              variant="outline" 
              className={`font-bold px-3 py-1 rounded-full border shadow-sm mb-4
                ${plan.status === "อนุมัติแล้ว" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                ${plan.status === "รออนุมัติ" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : ""}
                ${plan.status === "กำลังดำเนินการ" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : ""}
                ${plan.status === "เสร็จสิ้น" ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" : ""}
              `}
            >
              สถานะ: {plan.status}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight leading-snug">
              {plan.courseTitle}
            </h1>
            <div className="mt-2 inline-flex items-center rounded-md bg-purple-100 dark:bg-purple-900/50 px-2.5 py-0.5 text-sm font-semibold text-purple-800 dark:text-purple-200">
              รหัสแผน: {plan.planCode || "-"}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> สร้างเมื่อ {plan.createdAt ? format(new Date(plan.createdAt), "dd/MM/yyyy") : "-"}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4"/> ผู้กำกับดูแล: {plan.supervisorName}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          <Card className="shadow-sm border-slate-100 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e] rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100">เป้าหมายการพัฒนา</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100/50 dark:border-purple-800/30">
                  <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">หมวดหมู่ที่ต้องการพัฒนา</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.devCategory}</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100/50 dark:border-purple-800/30">
                  <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">หัวข้อที่ต้องการพัฒนา</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.devTopic}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e] rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100">วิธีการพัฒนารูปแบบ 70:20:10</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#150a29] border border-slate-100 dark:border-purple-900/30">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="font-black text-blue-600 dark:text-blue-400">70%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">การเรียนรู้จากประสบการณ์</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.dev70}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#150a29] border border-slate-100 dark:border-purple-900/30">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="font-black text-amber-600 dark:text-amber-400">20%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">การเรียนรู้จากผู้อื่น</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.dev20}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#150a29] border border-slate-100 dark:border-purple-900/30">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">10%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">การเรียนรู้จากการฝึกอบรม</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.dev10}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
